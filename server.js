var mysql = require('mysql');


var mysqlPort = process.env.MYSQL_PORT || 3306;
var mysqlHost = process.env.MYSQL_HOST || 'mysqldb';
var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 3030;
var db = process.env.MYSQL_DB_NAME || 'shoppingpal';
var user = process.env.MYSQL_DB_USER || 'root';
var password = process.env.MYSQL_DB_PASSWORD ||'root';

var con = mysql.createConnection({
  host: mysqlHost,
  port: mysqlPort,
  user: user,
  password: password,
  database :db
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS book ( id int(6) unsigned NOT NULL AUTO_INCREMENT,author varchar(30) NOT NULL,title varchar(30) NOT NULL,isbn varchar(30) NOT NULL,release_date date DEFAULT NULL,PRIMARY KEY (id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});



const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/book/get') {
        return handleGetReq(req, res)
    } else if (req.method === 'POST' && req.url === '/book/add') {
        return handlePostReq(req, res)
    } else if (req.method === 'POST' && req.url === '/book/delete') {
        return handleDeleteReq(req, res)
    } else if (req.method === 'POST' && req.url === '/book/update') {
        return handlePutReq(req, res)
    }
})

function handleGetReq(req, res) {
    const { pathname } = url.parse(req.url)
    if (pathname !== '/book/get') {
        return handleError(res, 404)
    }
    var sql2 = "select * from  book order by id ";
    con.query(sql2, function (err, data) {
        if (err) throw err; 
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end(JSON.stringify(data))
    })
}

function handlePostReq(req, res) {
var result = {};
const { pathname } = url.parse(req.url)
    if (pathname !== '/book/add') {
        return handleError(res, 404)
    }
    let body = '';
    req 
    .on('data', (chunk) => {         
    body = chunk.toString(); // convert Buffer to string
}) 
    .on('end', () => { 
        result.data = JSON.parse(body);
        con.on('error', function(err) {
            console.log("[mysql error]",err);
          });
        var sql = "INSERT INTO book(author, title,isbn,release_date) VALUES ('"+(result.data.author)+"','"+(result.data.title)+"','"+(result.data.isbn)+"','"+(result.data.release_date)+"')";
         con.query(sql, function (err, data) {
            if (err) throw err; // Check for the error and throw if it exists.
            var sql2 = "select * from  book order by id desc limit 1";
            con.query(sql2, function (err, data) {
                if (err) throw err; 
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.end(JSON.stringify(data));

            })

        });       
      })
}

function handleDeleteReq(req, res) {
    var result = {};
    var userUpdated = {};
    const { pathname, query } = url.parse(req.url)
    if (pathname !== '/book/delete') {
        return handleError(res, 404)
    }

    let body = '';
    req 
    .on('data', (chunk) => {         
    body = chunk.toString(); // convert Buffer to string
 }) 
    .on('end', () => { 
        result.data = JSON.parse(body);
        con.on('error', function(err) {
            console.log("[mysql error]",err);
          });
        var sql = "DELETE from book where id =  '"+(result.data.bookId)+"'";
         con.query(sql, function (err, data) {
            if (err) throw err; // Check for the error and throw if it exists.
            userUpdated.row = JSON.parse(JSON.stringify(data));
           
             if(userUpdated.row.affectedRows == 1){
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.end(`{"userDeleted": ${true}}`)
             }
             else{
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.end(`{"userDeleted": ${false}}`)
             }
            
        });       
      })
   
}

function handlePutReq(req, res) {
    var result  ={};
    var userUpdated ={};
    const { pathname, query } = url.parse(req.url)
    if (pathname !== '/book/update') {
        return handleError(res, 404)
    }
    let body = '';
    req 
    .on('data', (chunk) => {         
    body = chunk.toString(); // convert Buffer to string
 }) 
    .on('end', () => { 
        result.data = JSON.parse(body);
        con.on('error', function(err) {
            console.log("[mysql error]",err);
          });
        var sql = "Update book set author = '"+(result.data.author)+"' , title = '"+(result.data.title)+"',isbn = '"+(result.data.isbn)+"',release_date = '"+(result.data.release_date)+"'  where id =  '"+(result.data.bookId)+"'";
         con.query(sql, function (err, data) {
            if (err) throw err; // Check for the error and throw if it exists.
            userUpdated.row = JSON.parse(JSON.stringify(data));
           
             if(userUpdated.row.affectedRows == 1){
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.end(`{"userUpdated": ${true}}`)
             }
             else{
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.end(`{"userUpdated": ${false}}`)
             }
            
        });       
      })
   
}

function handleError (res, code) { 
    res.statusCode = code 
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`) 
} 

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});