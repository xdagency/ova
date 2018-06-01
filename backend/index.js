/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
const Dictionary = require("oxford-dictionary-api");
const config = require('./config');
*/

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const randomize = require('randomatic');
const bodyParser = require('body-parser');
const Dictionary = require("oxford-dictionary-api");

// Config
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


// Dictionary API
// Define dictionary api variables from config file
let app_id = config.DICT_APP_ID;
let app_key = config.DICT_APP_KEY;

// Dictionary constructor
let dict = new Dictionary(app_id, app_key);


// Pre-defined words for users
// 8 arrays for 7 rounds, round 0 array being null
let words = [
    [null],
    ['blue', 'dumb', 'moon', 'raid', 'food', 'stop', 'toys'], // round 1
    ['pull', 'push', 'bend', 'slip', 'fork', 'rake', 'spin'], // round 2
    ['mouth', 'bread', 'speed', 'float', 'blame', 'melon', 'total'], // round 3
    ['break', 'smoke', 'alter', 'trait', 'drink', 'glass', 'slang'], // round 4
    ['flower', 'figure', 'school', 'spirit', 'daring', 'useful', 'brains'], // round 5
    ['crunch', 'salmon', 'shrimp', 'savage', 'boiled', 'potato', 'eleven'], // round 6
    ['useless', 'blaming', 'growing', 'octopus', 'freedom', 'carnage', 'achieve'] // round 7
];


// Game Array
// Hold all the game states
let games = [];


// LISTEN
http.listen(3001, () => {
    console.log('We up on :3001');
});


// Game constructor
// Not using this
function Game(gameStatus, gameID, gameRound, user_a, user_b) {
    this.gameStatus = gameStatus;
    this.gameID = gameID;
    this.gameRound = gameRound;
    this.user_a = user_a;
    this.user_b = user_b;
}


//////////////////////////////
// GET ROUTE - /words
//////////////////////////////

app.get('/word' , (req, res) => {

    // Send the user a random word from pre-made array
    res.json(words[1][random()]);

});


//////////////////////////////
// POST ROUTE - /words
//////////////////////////////

app.post('/word', (req, res) => {

    let wordToCheck = req.body.word;
    
    // Check what's coming back in req.body
    // console.log(req.body);

    dict.find(wordToCheck, (err, data) => {
        
        if (err) {
            // console.log('error:', err);
            res.sendStatus(404);
            return;
        }

        res.sendStatus(200);
        // console.log(data);
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


//////////////////////////////
// CONNECTED TO SOCKET
//////////////////////////////

io.on('connection', function(socket) {
    console.log('Socket connection made', socket.id);


    //////////////////////////////
    // CREATE A NEW GAME
    //////////////////////////////

    socket.on('create-game', (data) => {

        let gameID = randomize('A', 4);

        games.push({ 
            gameStatus: false,
            gameID: gameID,
            gameRound: 1,
            user_a: { s_id: socket.id, nickname: data.nickname, word: '', score: 0 },
            user_b: { s_id: '', nickname: '', word: '', score: 0 }
        })

        // Send back the game ID
        socket.emit('game-info', { game_id: gameID, gameRound: 1, user_a: { score: 0 }, user_b: { score: 0 } });

        console.log('Game created', games);
    });


    //////////////////////////////
    // JOIN A GAME
    //////////////////////////////

    socket.on('join-game', (data) => {

        // Look for the right game ID
        let foundGameID = '';
        let searchGames = games.forEach((elem, i) => {
            if(elem.gameID === data.game_id){
                foundGameID = i;
            }
        })

        // Send back what we found
        socket.emit('game-status', { found: foundGameID })

        // Set the nickname and Socket ID of player B
        if (foundGameID !== '') {
            games[foundGameID].user_b.nickname = data.nickname;
            games[foundGameID].user_b.s_id = socket.id;
        }

        console.log('Player B joined', games);

    })


    //////////////////////////////
    // SEND USER THEIR S_ID
    //////////////////////////////

    socket.on('id-request', () => {
        socket.emit('id-answer', socket.id);
    })
    

    //////////////////////////////
    // SOCKET DISCONNECTS
    //////////////////////////////

    socket.on('disconnect', function() {
        console.log('Client disconnected.', socket.id);
    });

});


// Randon number generator for picking words from array
function random() {
    return Math.floor(Math.random() * 7);
}
