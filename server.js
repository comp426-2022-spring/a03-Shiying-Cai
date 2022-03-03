//create server

const  http = require("http")

//Require express.js
const express = require('express')
const app = express()

//import functions 
import { coinFlip, coinFlips, countFlips, flipACoin } from './coin.mjs'

//take an arbitrary port number from argument. default = 5000
const args = require('minimist')(process.argv.slice(2))
args['port']
if(args.port == undefined) {
    args.port = 5000
}
var HTTP_PORT = args.port;

//start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App lisenting on port %PORT%' .replace('%PORT%',HTTP_PORT))
});


//define defualt end point that are not defined "404 NOT FOUND"
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});

//Define check endpoint at /app/ return '200 OK'
app.get('/app/', (req, res) => {
    //respond with status 200
        res.statusCode = 200;
    //respond statusmessage
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain'});
        res.end(res.statusCode + ' ' + res.statusMessage)
})

// Endpoint /app/flip/ that returns JSON {"flip":"heads"} or {"flip":"tails"} corresponding to the results of the random coin flip.
app.get('/app/flip', (req, res) => {
    res.statusCode(200).json({"flips" : coinFlip()})
})

//Endpoint /app/flips/:number that returns JSON including an array of the raw random flips and a summary. 
/*
$ curl http://localhost:5000/app/flips/20
{"raw":["tails","tails","heads","tails","tails","tails","heads","heads","tails","tails","heads","heads","tails",
"heads","tails","heads","tails","heads","tails","heads"],"summary":{"tails":11,"heads":9}}
*/

app.get('/app/flips/:number', (req, res) => {
    var array = coinFlips(req.params['number'])
    res.statusCode(200).json({"raw" : array, "summary" : countFlips })
})

//Endpoint /app/flip/call/heads that returns the result of a random flip match against heads or tails as JSON
app.get('/app/flips/call/:guess', (req, res) => {
    res.statusCode(200).json(flipACoin(req.params['guess']))
})