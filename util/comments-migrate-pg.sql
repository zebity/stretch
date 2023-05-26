--
-- From: pgsql (Commento)
--   copy comments to denormalised migrate table
--
select * into comments_migrate from comments;
--
-- add extra columns for migration data
--
alter table comments_migrate
  add column email text, 
  add column ghost_postid text, 
  add column ghost_commentid text,
  add column ghost_parentid text ;
--
--  get the email address for the comments that have commenterhex
--    note: this might only work with postgresql
--          which is what Commento uses...
--
update comments_migrate
  set email = commenters.email
  from commenters
    where commenters.commenterhex = comments_migrate.commenterhex ;
--
-- dump the table and load into ghost database
--  this can be done by
--   1. get table definition and edit these
--      to remove timezone qualifcation from timestamp and public
--      qualifier from name
--   2. dump table as sql and edit to remove the 'public.' qualifier
--      prior to loading
--
