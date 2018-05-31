const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const axios = require('axios');
const Dictionary = require("oxford-dictionary-api");

const config = require('./config');

// headers to fix CORS issues
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let app_id = config.DICT_APP_ID;
let app_key = config.DICT_APP_KEY;

let dict = new Dictionary(app_id, app_key);

// Listen up
app.listen(3000, () => {
    console.log('We up on :3000');
});

let words4letters = ['blue', 'dumb', 'moon', 'raid', 'food', 'stop', 'toys'];
let words5letters = ['mouth', 'bread', 'speed', 'flower', 'blame', 'melon', 'total'];
let words6letters = ['flower', 'figure', 'school'];

app.post('/word', (req, res) => {

    let wordToCheck = req.body.word;
    
    dict.find(wordToCheck, (err, data) => {
        
        if (err) {
            console.log('error:', err);
            res.sendStatus(404);
            return;
        }

        res.sendStatus(200);
        console.log(data);
    });
});

io.on('connection', function(socket) {
    console.log('Socket connection made', socket.id);
});