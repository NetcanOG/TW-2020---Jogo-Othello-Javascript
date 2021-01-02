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
  var link = url.parse(req.url,true);
  let body = '';
  let entry = {};

  switch(req.method){
    case 'POST': 
      req
         .on('data', (chunk) => { body += chunk; })
         .on( 'end', () => {
           try { query = JSON.parse(body); 
            methods.postRequest(req, res, query);
           }
           catch(err){ /* erros de JSON*/ }
          })
         .on('error', (err) => { console.log(err.message); });
      break;

    case 'GET':
    entry = methods.getRequest(req, res, link);  
    break;
  }
}

const server = http.createServer(requestListener);
server.listen(port); //localhost:8105