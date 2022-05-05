function coinFlip() {
    let rand = Math.floor(Math.random() * 2);
    if(rand == 1){
      return "heads";
    } 
    else{
      return "tails";
    }
  }

function coinFlips(flips) {
    const results = [];
    for( let i = 0; i < flips; i++ ){
      results[i] = coinFlip();
    }
    return results;
  }

function countFlips(array) {
    let head = 0;
    let tail = 0;
  
    for(let i = 0; i < array.length; i++){
      if(array[i] == 'heads'){
        head++;
      }
      if(array[i] == 'tails'){
        tail++;
      }
    }
  
    if (head == 0) {
      return {"tails": tail};
    }
    else if (tail == 0) {
      return {"heads": head};
    }
  
    return {'heads': head, 'tails': tail}
  }

function flipACoin(call) {
    let f = coinFlip();
    let r = "";
    if(call == f){
      r = "win";
    } else{
      r = "lose";
    }
    
    //let callResult = { call: '${call}', flip: '${f}', result: '${r}' }
    let callResult = { call: call , flip: f , result: r }
    return callResult;
  }
  
  const http = require('http')
  
//Require express.js
const express = require('express');
const app = express()

//take an arbitrary port number from argument. default = 5000
const args = require('minimist')(process.argv.slice(2))
args['port']
if(args.port == undefined) {
    args.port = 5000
}
var HTTP_PORT = args.port;

const server = app.listen(HTTP_PORT, () => {
    console.log('App lisenting on port %PORT%' .replace('%PORT%',HTTP_PORT))
});



//Define check endpoint at /app/ return '200 OK'
app.get('/app/', (req, res) => {
    //respond with status 200
        res.status = 200;
    //respond statusmessage
        res.statusMessage = 'OK';
        res.writeHead( res.status, { 'Content-Type' : 'text/plain'});
        res.end(res.status + ' ' + res.statusMessage)
})

// Endpoint /app/flip/ that returns JSON {"flip":"heads"} or {"flip":"tails"} corresponding to the results of the random coin flip.
app.get('/app/flip', (req, res) => {
    res.status(200).json({"flip" : coinFlip()})
})

//Endpoint /app/flips/:number that returns JSON including an array of the raw random flips and a summary. 
/*
$ curl http://localhost:5000/app/flips/20
{"raw":["tails","tails","heads","tails","tails","tails","heads","heads","tails","tails","heads","heads","tails",
"heads","tails","heads","tails","heads","tails","heads"],"summary":{"tails":11,"heads":9}}
*/
app.get('/app/flips/:number', (req, res) => {
    var array = coinFlips(req.params['number'])
    res.status(200).json({"raw" : array, "summary" : countFlips(array) })
})

// Endpoint /app/flip/call/heads that returns the result of a random flip match against heads or tails as JSON
app.get('/app/flip/call/:guess', (req, res) => {
    res.status(200).json(flipACoin(req.params.guess))
})

// define defualt end point that are not defined "404 NOT FOUND"
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND');
});
