import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Router, Stack, Scene, Actions } from 'react-native-router-flux';
import Home from './Home';
import Word from './Word';
import GameSetup from './GameSetup';
import GameJoin from './GameJoin';
import Play from './Play';
import End from './End';

// Assign userAgent to react-native before import socket.io-client
window.navigator.userAgent = 'react-native';

// import io from 'socket.io-client/dist/socket.io';
import io from 'socket.io-client';
const socket = io('http://192.168.0.14:3001', {
  transports: ['websocket'],
})


/* Home Screen (App) */
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {

      // game state
      round: 1,
      letterCount: 4,
      user_a_word: '',
      user_b_word: '',

      // player names & state
      username: '',
      user_a_name: '',
      user_b_name: '',
      is_user_a: false,
      is_user_b: false,

      // scores
      user_a_score: 0,
      user_b_score: 0,

      // sockets
      ip: 'http://192.168.0.14:3001',

      // for styling, etc
      myClasses: null

    }

    // setup socket.io-client
    this.socket = io(this.state.ip, {jsonp: false});
  }


  //////////////////////////////
  // COMPONENT DID MOUNT
  //////////////////////////////

  componentDidMount() {

    // Set the letter counts for different rounds
    // if (this.state.round === 3 || this.state.round === 4) { this.setState({ letterCount: 5 }) }
    // if (this.state.round === 5 || this.state.round === 6) { this.setState({ letterCount: 6 }) }
    // if (this.state.round === 7) { this.setState({ letterCount: 7 }) }
    if (this.state.round === 2) { this.setState({ letterCount: 5 }) }
    if (this.state.round === 3) { this.setState({ letterCount: 6 }) }

    // We are connected now
    socket.on('connect', () => {
    });


    // When user B joins, send their name to Word Scene for user A
    socket.on('player-join', (data) => {
      
      this.setState({
          user_b_name: data.user_b_name
      }, () => {
          Actions.refresh({ key: 'word', user_b_name: this.state.user_b_name });
      })

    });


    // When player B has joined player A's game
    socket.on('game-status', (data) => {

      console.log(data);

      // If no status found, refresh setup page
      if (data.game === "") {
          Actions.refresh('setup', { found: false })

      // Otherwise update state and push to Word Scene
      } else {

          this.setState({
              user_a_name: data.user_a_name,
              game_id: data.game_id,
              // user_b_name: nickname
          }, () => {
            
            // push to word Scene
            Actions.push('word', {
                ip: this.state.ip, 
                game_id: this.state.game_id,
                user_a_name: this.state.user_a_name, 
                user_b_name: this.state.user_b_name, 
                is_user_b: this.state.is_user_b,
                round: this.state.round, 
                user_a_score: this.state.user_a_score,
                user_b_score: this.state.user_b_score,
                letterCount: this.state.letterCount,
                _onWordSubmit: this._onWordSubmit,
                displayOverlay: 'none'
            });

          }) // end setState
      }

  }); // end socket.on('game-status)


    // When both players have a word ready - start game
    // Push both players to the 'Play' scene which will countdown and have players start to make guesses
    socket.on('game-start', (data) => {

        console.log('Game start fired');

        Actions.push('play', {
            ip: this.state.ip,
            _onGuessSubmit: this._onGuessSubmit,
            game_id: data.game_id,
            round: this.state.round,
            letterCount: this.state.letterCount,
            user_a_name: this.state.user_a_name,
            user_b_name: this.state.user_b_name,
            is_user_a: this.state.is_user_a,
            is_user_b: this.state.is_user_b,
            user_a_score: this.state.user_a_score,
            user_b_score: this.state.user_b_score,
            user_a_word: data.user_a_word,
            user_b_word: data.user_b_word
        })

        // console.log(data.user_a_word, data.user_b_word);
    })


    // When a player guesses correctly
    socket.on('round-end', (data) => {

        console.log('winner is', data.winner, '- letter count now', data.letterCount);

        // Update state with new round #
        this.setState({
            round: data.round,
            letterCount: data.letterCount,
            user_a_score: data.user_a_score,
            user_b_score: data.user_b_score
        }, () => {
            Actions.pop({ refresh: { 
                round: this.state.round, 
                letterCount: this.state.letterCount,
                user_a_score: this.state.user_a_score, 
                user_b_score: this.state.user_b_score,
                letterCount: this.state.letterCount,
                winner: data.winner,
                displayOverlay: 'none'
            } });
        })
    })

    // Incorrect guess
    socket.on('wrong', () => {
        Alert.alert('Not quite');
    })

    socket.on('game-over', (data) => {
        console.log('game over', data);
        Actions.end({
            user_a_name: this.state.user_a_name,
            user_b_name: this.state.user_b_name,
            user_a_score: data.game.user_a.score,
            user_b_score: data.game.user_b.score,
            _onNewGame: this._onNewGame
        })
    })

  }


  //////////////////////////////
  // JOIN GAME BUTTON
  //////////////////////////////

  _onJoinGame = (u) => {

      if (u === '') {
          Alert.alert('Please enter a nickname');
          return;
      }

      // If user is joining, we know they are user B
      // So we set user b details
      this.setState({
          user_b_name: u,
          is_user_b: true,
          is_user_a: false
      }, () => {
        Actions.join({
            gameType: 'join', 
            ip: this.state.ip,
            user_b_name: this.state.user_b_name, 
            is_user_b: this.state.is_user_b
        })
      })
  }

  
  //////////////////////////////
  // CREATE GAME BUTTON
  //////////////////////////////

  _onCreateGame = (u) => {

      if (u === '') {
          Alert.alert('Please enter a nickname');
          return;
      }

      // CREATE A GAME OBJECT ON SERVER
      // SEND A SOCKET EMIT HERE WITH NICKNAME FOR USER A

      this.setState({
        user_a_name: u,
        is_user_a: true,
        is_user_b: false,
        username: u
      }, () => {
          
          // Send an emit to server to create a game object in 'games' array
          socket.emit('create-game', { nickname: u })

          // when server sends a 'game-info' emit...
          socket.on('game-info', (data) => {

            // Go to setup scene and pass in data from socket
            Actions.setup({ 
              gameType: 'new',
              ip: this.state.ip,  
              user_a_name: this.state.user_a_name, 
              user_b_name: this.state.user_b_name,
              is_user_a: this.state.is_user_a,
              game_id: data.game_id, 
              round: data.gameRound, 
              user_a_score: this.state.user_a_score,
              user_b_score: this.state.user_b_score,
              letterCount: this.state.letterCount,
              _onWordSubmit: this._onWordSubmit,
              displayOverlay: 'none'
            });

          })
      })

  }


  //////////////////////////////
  // SUBMIT GAME ID (i.e. Joing a Game)
  //////////////////////////////

  _onGameIdSubmit = (id, u) => {

    this.setState({
        username: u
    }, () => {
        
        let _id = id.toUpperCase();

        console.log('_onGameIdSubmit hit by', u);

        // Emit a join game
        socket.emit('join-game', { game_id: _id, nickname: this.state.user_b_name });

    }); // end setState

  }


  //////////////////////////////
  // SUBMIT WORD
  //////////////////////////////

  _onWordSubmit = (id, w) => {

    // Make sure word long enough
    if (w.length < this.state.letterCount) {
        Alert.alert('Gotta pick a longer word');
        return;
    }

    // Hit server at the /word endpoint
    fetch(this.state.ip + '/word', {
        // POST request
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        // send the word the user is guessing
        body: JSON.stringify({
            word: w
        })
      })

      .then(response => {
          // if the word came back from dictionary API as not found
          // give an error and make them keep guessing
          if (response.status === 404) {
              // console.log(response);
              Alert.alert('Hey that\'s not a word, try again');
          
          // Otherwise set the word as their word for the game
          } else {
              // Word is valid so show the "locked in" overlay 
              Actions.refresh({ key: 'word', word: w, displayOverlay: 'flex' });
              // Pop up an alert
              // Alert.alert('Valid word', 'Your word will be: ' + w);

              // Convert game ID to upper case to avoid matching errors on server
              let _id = id.toUpperCase();
              socket.emit('submit-word', { game_id: _id, word: w })
          }
      })

      .catch(error => {
          console.log(error);
      });

  }


  //////////////////////////////
  // WORD GUESS
  //////////////////////////////

  _onGuessSubmit = (id, w, u) => {

    let _id = id.toUpperCase();

    // console.log(id, w, u);

    socket.emit('guess', {
        game_id: _id,
        guess: w,
        user: u
    })

  }


  //////////////////////////////
  // WORD GUESS
  //////////////////////////////

  _onNewGame = () => {

    // When user clicks new game just clear out all old state data
    this.setState({
        round: 1,
        letterCount: 4,
        user_a_name: '',
        user_a_score: 0,
        user_b_name: '',
        user_b_score: 0,
        is_user_a: false,
        is_user_b: false
    }, () => {
      Actions.home({
        _onUsernameSubmit: this._onUsernameSubmit,
        _onJoinGame: this._onJoinGame,
        _onCreateGame: this._onCreateGame,
        letterCount: this.state.letterCount,
        username: this.state.username
      });
    })

  }


  
  ///// RENDER /////

  render() {

    return (

      <Router showNavigationBar={false}>
        <Stack key="root">

          {/* Main scenes/routes */}

          <Scene key="home" headerMode="none" hideNavBar="true" title="Home" initial component={Home} 
              _onUsernameSubmit={this._onUsernameSubmit} 
              _onJoinGame={this._onJoinGame} 
              _onCreateGame={this._onCreateGame} 
              opponentScore={this.state.opponentScore} />

          <Scene key="word" headerMode="none" hideNavBar="true" component={Word} 
              _onWordSubmit={this._onWordSubmit} 
              round={this.state.round} />

          <Scene key="setup" headerMode="float" backTitle="Home" component={GameSetup} />

          <Scene key="join" headerMode="float" backTitle="Home" component={GameJoin} 
              _onGameIdSubmit={this._onGameIdSubmit} />

          <Scene key="play" headerMode="none" hideNavBar="true" component={Play} />

          <Scene key="end" headerMode="none" hideNavBar="true" component={End} _onNewGame={this._onNewGame} 
          user_a_name="Adam" user_b_name="Brad" user_a_score="3" user_b_score="1" />

        </Stack>
      </Router>

    );
  }
}