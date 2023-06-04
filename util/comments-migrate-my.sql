--
-- dump the table and load into ghost database
--  this can be done by
--   1. get table definition and edit these
--      to remove timezone qualifcation from timestamp and public
--      qualifier from name
--   2. dump table as sql and edit to remove the 'public.' qualifier
--      prior to loading
--
-- From: mysql (Ghost)
--   load the ghost post ids using path/slug as join point
--
update comments_migrate
  inner join posts on locate(posts.slug, comments_migrate.path) > 0
  set comments_migrate.ghost_postid = posts.id ;
--
--
-- load ghost member id using email as the join point
--
update comments_migrate
  inner join members on comments_migrate.email = members.email
  set comments_migrate.ghost_memberid = members.id ;
--
--
-- Update the deleted comments to point to "anonymous" member
--  added via Ghost UI
--
update comments_migrate
  set comments_migrate.ghost_memberid = 'XXXXXXXXXXXX'
  where comments_migrate.commenterhex = 'anonymous' ;
--
--
-- Now need to allocate ghost comment ids and re-establish
-- parent relationship
--
-- To generate an MongoDB like UID I installed mysql extension
--  this will generate uid using: hex(xid_bin())
--  so adding hexid to comments is just a simple:
--
update comments_migrate
 set comments_migrate.ghost_commentid = hex(xid_bin());
--
--
-- Now re-establish parent relationshsips.
--
-- First create join that finds the missing ghost_parentid
--   via the available Commento parenthex
--
select
  child.commenthex as child_hex,
  parent.commenthex as parent_hex,
  child.ghost_commentid as child_id,
  parent.ghost_commentid as parent_id
from comments_migrate child 
  join comments_migrate parent on child.parenthex = parent.commenthex ;
--
-- This gives Commento: hex / parent hex 
--            Ghost:    id / parent id
--
-- Reducing this to return the set of missing data (ghost parent id)
--
--
select
  child.ghost_commentid as child_id,
  parent.ghost_commentid as parent_id
from comments_migrate child 
  join comments_migrate parent on child.parenthex = parent.commenthex ;
--
-- ok lets squirrel that away in temp table ...
--
--
create temporary table comments_migrate_temp
  select * from
   (select child.ghost_commentid as child_id,
    parent.ghost_commentid as parent_id
   from comments_migrate child
     join comments_migrate parent on child.parenthex = parent.commenthex ) ids ;
--
-- and join and set ...
--
--
update comments_migrate
  inner join comments_migrate_temp on
   (comments_migrate.ghost_commentid = comments_migrate_temp.child_id)
  set comments_migrate.ghost_parentid = comments_migrate_temp.parent_id ;
--
--
-- And now insert the Commento comments...
--
-- First disable foreign key contraints
--
set foreign_key_checks = 0;
--
-- copy Commento comments over..
--
insert into comments
  (id, post_id, member_id, parent_id, status, html, edited_at,
   created_at, updated_at)
select ghost_commentid, ghost_postid,
  ghost_memberid, ghost_parentid, if(deleted=1, 'deleted', 'published'),
  html, if(deleted=1, deletiondate, null), creationdate, creationdate
from comments_migrate;
--
set foreign_key_checks = 1;
--
