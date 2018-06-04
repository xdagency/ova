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
    ['blue', 'game', 'moon', 'raid', 'food', 'stop', 'draw', 'slip', 'fork', 'rake', 'pull', 'push', 'bend'], // round 1
    ['mouth', 'bread', 'speed', 'float', 'blame', 'melon', 'total', 'break', 'smoke', 'alter', 'trait', 'drink', 'glass'], // round 2
    ['flower', 'figure', 'school', 'spirit', 'daring', 'useful', 'sprain', 'crunch', 'salmon', 'shrimp', 'savage', 'boiled', 'potato'], // round 3
    ['useless', 'blaming', 'growing', 'octopus', 'freedom', 'carnage', 'achieve'] // round 4???
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
            gameStatus: false,
            gameID: currGameID,
            gameRound: 1,
            user_a: { s_id: socket.id, nickname: data.nickname, word: '', s_word: '', score: 0 },
            user_b: { s_id: '', nickname: '', word: '', s_word: '', score: 0 }
        })

        // the current game index will be the length of the array minus 1
        // since we just pushed the current game to end of array
        currGameIndex = games.length - 1;

        // Join a socket room
        socket.join(currGameID, () => {
            // console.log('socket', socket.id, 'has joined', socket.rooms)
        });

        // Send back the game ID to user A
        socket.emit('game-info', { game_id: currGameID, gameRound: 1, user_a: { score: 0 }, user_b: { score: 0 } });

        // Log the game that was just created 
        console.log('Game created', games[currGameIndex]);
        // Log the game index
        // console.log('Game Index', currGameIndex);

    });


    //////////////////////////////
    // JOIN A GAME
    //////////////////////////////

    socket.on('join-game', (data) => {

        // Look for the right game ID
        let foundGameIndex = '';
        let foundGameID = '';
        let searchGames = games.forEach((elem, i) => {
            if(elem.gameID === data.game_id){
                foundGameIndex = i;
                foundGameID = elem.gameID;
            }
        })

        // Log what we found
        // console.log(foundGameID, foundGameIndex);

        // Send back what we found
        // Which is what we have in the 'game state' on server
        socket.emit('game-status', { 
            game: games[foundGameIndex],
            user_a_name: games[foundGameIndex].user_a.nickname
        });

        // Set the nickname and Socket ID of player B
        // only if we found a game ID based on what user B enetered on their end
        if (foundGameID !== '') {
            games[foundGameIndex].user_b.nickname = data.nickname;
            games[foundGameIndex].user_b.s_id = socket.id;
            
            // Join the socket room
            socket.join(foundGameID, () => {
                // console.log('socket', socket.id, 'has joined', socket.rooms)
                // Emit user B's name back to player A
                socket.to(foundGameID).emit('player-join', {
                    user_b_name: data.nickname
                })
            });

            // Emit user A's name back to player B?
        }

        // console.log('Player B joined', games[foundGameIndex]);

    })


    //////////////////////////////
    // USER SUBMITS A WORD
    //////////////////////////////

    socket.on('submit-word', (data) => {
        
        // Look for the right game ID
        let foundGameIndex = '';
        let foundGameID = '';
        let searchGames = games.forEach((elem, i) => {
            if(elem.gameID == data.game_id) {
                foundGameIndex = i;
                foundGameID = elem.gameID;
            }
        });

        // Log the details found
        // console.log(foundGameID, foundGameIndex);

        // Scramble the word
        let s_word = wordscramble.scramble(data.word);

        // console.log('Found game ID', foundGameID);
        // console.log('Found game Index', foundGameIndex);
        // console.log('User s_id', socket.id);
        // console.log('Choosen word', data.word);
        // console.log('Scrambled word', word_s);

        // Somehow set the word to the respective user
        if (games[foundGameIndex].user_a.s_id === socket.id) {

            // User A
            games[foundGameIndex].user_a.word = data.word;
            games[foundGameIndex].user_a.s_word = s_word;
        } else {

            // User B
            games[foundGameIndex].user_b.word = data.word;
            games[foundGameIndex].user_b.s_word = s_word;
        }

        console.log(games[foundGameIndex]);

        // Check if both words have been submitted
        // If true, game can start
        if (games[foundGameIndex].user_a.word !== '' && games[foundGameIndex].user_b.word !== '') {
            
            // Emit to everyone in 'room'
            // SHOULD I EMIT TO EACH PLAYER INDIVIDUALLY??
            io.in(foundGameID).emit('game-start', {
                game_id: foundGameID,
                user_a_word: games[foundGameIndex].user_a.s_word,
                user_b_word: games[foundGameIndex].user_b.s_word
            });

            // Emit user_a word to user_b && user_b word to user_a
            // socket.to(games[foundGameIndex].user_b.s_id).emit('game-start', {
            //     game_id: foundGameID,
            //     you: 'user_b',
            //     word: games[foundGameIndex].user_a.s_word
            // });
            
            // socket.to(games[foundGameIndex].user_a.s_id).emit('game-start', {
            //     game_id: foundGameID,
            //     you: 'user_a',
            //     word: games[foundGameIndex].user_b.s_word
            // });

        }

    });


    //////////////////////////////
    // USER MAKES GUESS
    //////////////////////////////

    socket.on('guess', (data) => {

        // Look for the right game ID
        let foundGameIndex = '';
        let foundGameID = '';
        let searchGames = games.forEach((elem, i) => {
            if(elem.gameID == data.game_id) {
                foundGameIndex = i;
                foundGameID = elem.gameID;
            }
        });

        // check if it's correct
        // User A wins
        if (data.user === 'a' && data.guess.toUpperCase() === games[foundGameIndex].user_b.word.toUpperCase()) {

            updateGameState('a', foundGameID, foundGameIndex);

        // User B wins
        } else if (data.user === 'b' && data.guess.toUpperCase() === games[foundGameIndex].user_a.word.toUpperCase()) {

            updateGameState('b');

        } else {
            // Wrong guess
            socket.emit('wrong');
        }

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


// Function for updating game state when a user gets a point
function updateGameState(u, id, i) {
    
    // increment round
    games[i].gameRound += 1;

    // increment user score
    u === 'a' ? games[i].user_a.score += 1 : games[i].user_b.score += 1;

    // clear words
    games[i].user_a.word = '';
    games[i].user_a.s_word = '';
    games[i].user_b.word = '';
    games[i].user_b.s_word = '';

    // emit the winner
    io.in(id).emit('round-end', { 
        round: games[i].gameRound,
        user_a_score: games[i].user_a.score,
        user_b_score: games[i].user_b.score,
        winner: 'user_' + u 
    });

    console.log('game status:', games[i]);

}

// Randon number generator for picking words from array
function random() {
    return Math.floor(Math.random() * 13);
}
