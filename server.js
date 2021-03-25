var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database :"shoppingpal"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



const http = require('http')
const qs = require('querystring') 
const url = require('url') 

// const Users = require('./dbConnection');

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3030

const server = http.createServer((req, res) => {
    console.log("req.method",req.method +""+req.url);
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