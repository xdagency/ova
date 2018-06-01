import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Router, Stack, Scene, Actions } from 'react-native-router-flux';
import Home from './Home';
import Word from './Word';
import GameSetup from './GameSetup';

// Assign userAgent to react-native before import socket.io-client
window.navigator.userAgent = 'react-native';

// import io from 'socket.io-client/dist/socket.io';
import io from 'socket.io-client';
const socket = io('http://10.32.5.219:3001', {
  transports: ['websocket'],
})


/* Home Screen (App) */
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {

      // game state
      playerReady: false,
      opponentReady: false,
      round: 1,
      playerWord: '',
      opponentWord: '',

      // player names
      playerName: '',
      opponentName: '',

      // scores
      playerScore: 0,
      opponentScore: 0,

      // sockets
      ip: 'http://10.32.5.219:3001',
      playerConnected: false,
      opponentConnected: false,

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

    // We are connected now
    socket.on('connect', () => {

        // do something now that we're connected
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

      Actions.setup({ gameType: 'join', playerName: u })
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
          playerName: u
      }, () => {
          
          socket.emit('create-game', { nickname: u })

          socket.on('game-info', (data) => {

            // Go to setup scene and pass in data from socket
            Actions.setup({ 
              gameType: 'new', 
              playerName: u, 
              game_id: data.game_id, 
              gameRound: data.gameRound, 
              user_a_score: data.user_a.score,
              user_b_score: data.user_b.score,
            });

          })
      })

  }


  //////////////////////////////
  // SUBMIT GAME ID
  //////////////////////////////

  _onGameIdSubmit = (id, nickname) => {
    
    // Grab the game status being emitted by server
    socket.on('game-status', (data) => {
      
      // If no game was found send a prop
      if (data.found === undefined) {
          Actions.refresh('setup', { game_found: false })

      // Otherwise if the game was found emit the join game socket
      // and push to the word selection screen
      } else {
          socket.emit('join-game', { game_id: id, nickname: nickname })
          Actions.push('')
      }
      
    });

  }


  //////////////////////////////
  // SUBMIT A USERNAME
  //////////////////////////////

  _onUsernameSubmit = (u) => {
    
    // Set the player name based on what was submitted on 'Home' screen
    // and then Action (navigate) to that screen with the new params
    this.setState({
      playerName: u
    }, () => {
      Actions.word({ playerName: u })
    })

  }


  //////////////////////////////
  // SUBMIT A WORD FOR X ROUND
  //////////////////////////////

  _onWordSubmit = () => {

  }

  render() {

    return (

      <Router showNavigationBar={false}>
        <Stack key="root">

          {/* Main scenes/routes */}

          <Scene key="home" headerMode="none" hideNavBar="true" title="Home" initial component={Home} 
              _onUsernameSubmit={this._onUsernameSubmit} 
              _onJoinGame={this._onJoinGame} 
              _onCreateGame={this._onCreateGame} 
              playerName={this.state.playerName} 
              opponentName={this.state.opponentName} 
              playerScore={this.state.playerScore} 
              playerConnected={this.state.playerConnected} 
              opponentScore={this.state.opponentScore} />

          <Scene key="word" headerMode="none" hideNavBar="true" component={Word} 
              onSubmit={this._onSubmit} 
              round={this.state.round} 
              playerName={this.state.playerName} 
              opponentName={this.state.opponentName} 
              playerScore={this.state.playerScore} 
              opponentScore={this.state.opponentScore} 
              playerConnected={this.state.playerConnected} 
              opponentConnected={this.state.opponentConnected} />

          <Scene key="setup" headerMode="none" hideNavBar="true" component={GameSetup} 
                _onGameIdSubmit={this._onGameIdSubmit} 
                playerName={this.state.playerName} 
                opponentName={this.state.opponentName} />

            {/* <Scene key="play" component={Play} /> */}

        </Stack>
      </Router>

    );
  }
}