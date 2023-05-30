//
// purpose: read in a commento comments csv and load into ghost native comments table
//


// get the client
import * as mysql from 'mysql2';
import * as objid from 'bson-objectid';
import {generate, parse, transform, stringify} from 'csv';
import * as fs from 'fs';

let ObjectId = objid.default;

let columns = { commenthex: 0, domain: 1, path: 2, commenterhex: 3,
               markdown: 4, html: 5, parenthex: 6, score: 7, state: 8,
               creationdate: 9, deleted: 10, deleterhex: 11,
               deletiondate: 12};

function parseArgs(args, flags) {
  let res = 0;
  let i = 0;
  let a = null;
  let max = args.length - 1; 

  for (i = 2; i < args.length; i++) {
    a = args[i];
    if (a[0] == '-' && a.length === 2) {
      switch(a[1]) {
        case 'u': if (i+1 > max) {
                    console.log("Invalid argument: [" + a + "].");
                    res--;
                  } else {
                    flags["user"] = args[i+1];
                    i++; /* skip past user */
                  }
                  break;
        case 'p': if (i+1 > max) {
                    console.log("Invalid argument: [" + a + "].");
                    res--;
                  } else {
                    flags["password"] = args[i+1];
                    i++; /* skip past password */
                  }
                  break;
        case 'h': if (i+1 > max) {
                    console.log("Invalid argument: [" + a + "].");
                    res--;
                  } else {
                    flags["host"] = args[i+1];
                    i++; /* skip past password */
                  }
                  break;
        case 'd': if (i+1 > max) {
                    console.log("Invalid argument: [" + a + "].");
                    res--;
                  } else {
                    flags["db"] = args[i+1];
                    i++; /* skip past password */
                  }
                  break;
        case 'c': if (i+1 > max) {
                    console.log("Invalid argument: [" + a + "].");
                    res--;
                  } else {
                    flags["csv"] = args[i+1];
                    i++; /* skip past commenta */
                  }
                  break;
        default: System.out.println("Invalid argument: [" + a + "].");
      }
    }
  }
  return res;
}

// simple query
/*
connection.query(
  'SELECT * FROM `members` WHERE `name` = "Page" AND `age` > 45',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
); */


function getGhostRecords(gdb, line, cols) {
// with placeholder

  gdb.query(`SELECT * FROM members WHERE email = '${line[cols.email]}'`,
    ['Page', 45],
    function(err, results) {
      console.log(results);
    });
}

// let parser = parse();
// let results = [];


function getCommento(flags, gdb, cols) {

  console.log(` Reading from: ${flags['csv']}`);
  console.log(parse);

  fs.createReadStream(flags['csv'])
    .pipe(parse({ delimiter: ',', from_line: 2}))
    .on('data', function(data) {
      console.log(data);
      getGhostRecords(gdb, data, cols); 
    })
    .on('end', () => {
       console.log('Loaded CSV');
    })
    .on("error", function (err) {
      console.log(err);
    });
};

function loadComments() {
  let flags = [];
  let DEBUG = true;
  let co = null;

  if (DEBUG) {
    console.log(process.argv);
  }
  
  if (parseArgs(process.argv, flags) < 0) {
    console.log('Usage: node loadcommento -u USR -p PASSWORD -h HOST -d DB -c CSV');
  } else {
    //  create the connection to database
    const connection = mysql.createConnection({
      host: flags['host'],
      user: flags['user'],
      password: flags['password'],
      database: flags['db'] });

    getCommento(flags, connection);

    /* for (let i = 0; i < co.length; i++) {
      console.log(`${co[i]['email']}');
    } */
  }
}

loadComments();
