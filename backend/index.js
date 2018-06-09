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
const wordscramble = require('wordscramble');

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
    ['Blue', 'Game', 'Moon', 'Raid', 'Food', 'Stop', 'Draw', 'Slip', 'Fork', 'Rake', 'Pull', 'Push', 'Bend'], // round 1
    ['Mouth', 'Bread', 'Speed', 'Float', 'Blame', 'Melon', 'Total', 'Break', 'Smoke', 'Alter', 'Trait', 'Drink', 'Glass'], // round 2
    ['Flower', 'Figure', 'School', 'Spirit', 'Daring', 'Useful', 'Sprain', 'Crunch', 'Salmon', 'Shrimp', 'Savage', 'Boiled', 'Potato'], // round 3
    ['Useless', 'Outward', 'Sparrow', 'Octopus', 'Freedom', 'Carnage', 'Achieve', 'Approve', 'Dictate', 'Faction', 'Handout', 'Manager', 'Scooter'], // round 4???
    ['Asterisk', 'Comedian', 'Footnote', 'Identify', 'Imperial', 'Painting', 'Scissors', 'Friendly', 'Standoff', 'Threaten', 'Unlocked', 'Violence', 'Zucchini']
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
// GET ROUTE - /
//////////////////////////////

app.get('/', (req, res) => {

    // Send a homepage
    res.sendFile(__dirname + '/public/index.html');

});


//////////////////////////////
// GET ROUTE - /words
//////////////////////////////

app.get('/word', (req, res) => {

    // Send the user a random word from pre-made array
    res.json(words[req.query.round][random()]);

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

    // a user has connected to a socket
    console.log('Socket connection made', socket.id);

    //////////////////////////////
    // CREATE A NEW GAME
    //////////////////////////////

    socket.on('create-game', (data) => {

        let currGameIndex = '';
        let currGameID = '';

        // Generate a random ID
        currGameID = randomize('A', 4);

        // Push this 'game' to the games array and assign all it's starting values
        games.push({ 
            gameID: currGameID,
            gameRound: 1,
            letterCount: 4,
            user_a: { s_id: socket.id, nickname: data.nickname, word: '', s_word: '', score: 0 },
            user_b: { s_id: '', nickname: '', word: '', s_word: '', score: 0 }
        })

        // the current game index will be the length of the array minus 1
        // since we just pushed the current game to end of array
        // DEPRECATED
        currGameIndex = games.length - 1;

        // Join a socket room
        // DEPRECATED (just to log when a user has joined a room)
        socket.join(currGameID, () => {
            // console.log('socket', socket.id, 'has joined', socket.rooms)
        });

        // Send back the game ID to user A and some initial game values
        socket.emit('game-info', { 
            game_id: currGameID, 
            gameRound: 1, 
            user_a: { score: 0 }, 
            user_b: { score: 0 } 
        });

        // Log the game that was just created 
        // console.log('Game created - All games: \n', games);
        console.log('\n===== Game created ===== \n', games[currGameIndex]);
        // console.log('Game Index', currGameIndex);

    });


    //////////////////////////////
    // JOIN A GAME
    //////////////////////////////

    socket.on('join-game', (data) => {

        console.log('data:', data);

        // Find the correct game id
        let theGame = games.find((elem) => {
            return elem = elem.gameID === data.game_id;
        });

        // Catch a socket trying to hit 'join-game' without a gameID
        if (!data.game_id) {
            console.log('\n===== Phantom ===== \n', socket.id);
            return;
        }
        
        // Send back what we found
        // Which is what we have in the 'game state' on server
        socket.emit('game-status', { 
            game: theGame,
            game_id: theGame.gameID,
            user_a_name: theGame.user_a.nickname
        });

        // Set the nickname and Socket ID of player B
        // only if we found a game ID based on what user B enetered on their end
        if (theGame.gameID !== '') {
            theGame.user_b.nickname = data.nickname;
            theGame.user_b.s_id = socket.id;
            
            // Join the socket room
            socket.join(theGame.gameID, () => {
                // console.log('socket', socket.id, 'has joined', socket.rooms)
                // Emit user B's name back to player A
                socket.to(theGame.gameID).emit('player-join', {
                    user_b_name: data.nickname
                })
            });

        }

        console.log('\n===== Player joined ===== \n', 'Game:', theGame.gameID, '\nName:', data.nickname);
        // console.log('Player B joined', games[foundGameIndex_join]);

    });


    //////////////////////////////
    // USER SUBMITS A WORD
    //////////////////////////////

    socket.on('submit-word', (data) => {

        // Find the correct game id
        let theGame = games.find((elem) => {
            return elem = elem.gameID === data.game_id;
        })

        // Log the details found
        // console.log(foundGameID, foundGameIndex);

        // Scramble the word
        let s_word = wordscramble.scramble(data.word);

        // Find the correct user to map word (and scrambled word) to
        if (theGame.user_a.s_id === socket.id) {

            // User A
            theGame.user_a.word = data.word;
            theGame.user_a.s_word = s_word;
        } else {

            // User B
            theGame.user_b.word = data.word;
            theGame.user_b.s_word = s_word;
        }

        console.log('\n===== Word added ===== \n', theGame);

        // Check if both words have been submitted
        // If true, game can start
        if (theGame.user_a.word !== '' && theGame.user_b.word !== '') {
            
            // Emit to everyone in 'room'
            io.in(theGame.gameID).emit('game-start', {
                game_id: theGame.gameID,
                user_a_word: theGame.user_a.s_word,
                user_b_word: theGame.user_b.s_word
            });
        }

    });


    //////////////////////////////
    // USER MAKES GUESS
    //////////////////////////////

    socket.on('guess', (data) => {

        // Find the correct game id
        let theGameIndex = 0;
        let theGame = games.find((elem, i) => {
            theGameIndex = i;
            return elem = elem.gameID === data.game_id;
        })

        // console.log('Guess was made to gameIndex', theGameIndex);
        console.log('\nuser', data.user, 'guessed:', data.guess);

        // check if it's correct
        // User A wins
        if (data.user === 'a' && data.guess.toUpperCase() === theGame.user_b.word.toUpperCase()) {

            updateGameState('a', theGame.gameID, theGameIndex);

        // User B wins
        } else if (data.user === 'b' && data.guess.toUpperCase() === theGame.user_a.word.toUpperCase()) {

            updateGameState('b', theGame.gameID, theGameIndex);

        } else {
            // Wrong guess
            socket.emit('wrong');
        }

    });


    //////////////////////////////
    // SEND USER THEIR S_ID (Deprecated)
    //////////////////////////////

    socket.on('id-request', () => {
        socket.emit('id-answer', socket.id);
    });
    

    //////////////////////////////
    // SOCKET DISCONNECTS
    //////////////////////////////

    socket.on('disconnect', function() {
        // Log when a user has lost connection with their socket
        console.log('Socket disconnected.', socket.id);
    });

});


// Function for updating game state when a user gets a point
// takes in the user (a or b), the game id, and the game index
function updateGameState(u, id, i) {
    
    // increment round
    games[i].gameRound += 1;

    // increment user score
    u === 'a' ? games[i].user_a.score += 1 : games[i].user_b.score += 1;

    // increment letterCount
    games[i].letterCount += 1;

    // clear words
    games[i].user_a.word = '';
    games[i].user_a.s_word = '';
    games[i].user_b.word = '';
    games[i].user_b.s_word = '';

    // emit the winner
    if (games[i].user_a.score === 3 || games[i].user_b.score === 3) {
        io.in(id).emit('game-over', {
            game: games[i]
        });
    } else {
        io.in(id).emit('round-end', { 
            round: games[i].gameRound,
            letterCount: games[i].letterCount,
            user_a_score: games[i].user_a.score,
            user_b_score: games[i].user_b.score,
            winner: u
        });
    }

    console.log('\n===== Game updated ===== \n', 'Game', games[i].gameID, '\nRound', games[i].gameRound, '\nLetter count', games[i].letterCount);

}

// Randon number generator for picking words from array
function random() {
    return Math.floor(Math.random() * 13);
}
