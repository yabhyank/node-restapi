const express = require('express')
const app = express();
const cors = require('cors');
const port = 5000

app.use(cors())

const oracledb = require('oracledb');

const password = '<enter db password>';
const connstr = '<enter db connect string>';
var sql = 'select * from xx where rownum<11';

async function selectTable(req, res, tab) {
  try {
   sql = 'select * from xx where rownum<6';
   sql =  sql.replace("xx",tab);

    connection = await oracledb.getConnection({
      user: "admin",
      password: password,
      connectString: connstr
    });

//    console.log('connected to database');
    // run query to get all records
    result = await connection.execute(sql,[], {outFormat: oracledb.OUT_FORMAT_OBJECT});

  } catch (err) {
    //send error message
//    console.log('in error '+JSON.stringify(err, Object.getOwnPropertyNames(err)));
    sql=`select `+JSON.stringify(err.message, Object.getOwnPropertyNames(err))+` Error from dual`;
    sql = sql.replace('"',"'");
    sql = sql.replace('"',"'");

    result = await connection.execute(sql,[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
//    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
   //     console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
    if (result.rows.length == 0) {
      //query return zero records
      return res.send(JSON.parse('[{"No_Rows":"No rows selected"}]'));
    } else {
      //send all records
      return res.send(result.rows);
    }

  }
}

app.get('/table', function (req, res) {
  let tab = req.query.tab;
  selectTable(req, res, tab);
})

app.get('/', function (req, res) {
    res.send('Welcome to Table API, please search using /table?tab=<table name>')
    return
  })

app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))
