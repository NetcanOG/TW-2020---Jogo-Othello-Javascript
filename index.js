const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const methods = require('./methods.js');
const heads = require('./heads.js');

var port = 8105;

//req = request
//res = response
const requestListener = function (req, res) {
  var link = url.parse(req.url);
  var path = link.pathname;
  let body = '';
  switch(req.method){
    case 'POST':
      request
             .on('data', (chunk) => { body += chunk; })
             .on( 'end', () => {
               try { query = JSON.parse(body); /*processar query*/ }
               catch(err){ /* erros de JSON*/ }
             })
             .on('error', (err) => { console.log(err.message); });
    break;

    case 'GET':
      request
             .on('data', (chunk) => { body += chunk; })
             .on( 'end', () => {
               try { query = JSON.parse(body); /*processar query*/ }
               catch(err){ /* erros de JSON*/ }
             })
             .on('error', (err) => { console.log(err.message); });
    break;
  }
  /*
  res.writeHead(200);
  res.end('Hello, World!');
  */
}


const server = http.createServer(requestListener);
server.listen(port); //localhost:8105

