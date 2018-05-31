import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';

// Assign userAgent to react-native before import socket.io-client
// window.navigator.userAgent = 'react-native';
// import io from 'socket.io-client/dist/socket.io';
const io = require('socket.io-client');


/* Home Screen (App) */
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {

      // player names
      playerName: '',
      opponentName: '',

      // sockets
      playerConnected: false,
      opponentConnected: false,

      // the players word choice
      word: '',

      // for styling, etc
      myClasses: [styles.beans, styles.cool]

    }

    // setup socket.io-client
    // this.socket = io('http://10.32.5.219:8080', {jsonp: false});
  }

  componentDidMount() {

    this.input.focus();
    
    const socket = io('http://10.32.5.219:3000', {
      transports: ['websocket'],
    })

    socket.on('connect', ()=> {
      this.setState({
        isConnected: true
      })
    })

  }

  _onSubmit() {

    // Alert.alert('sup');

    fetch('http://10.32.5.219:3000/word', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word: this.state.userWord
      })
    })
    .then(response => {
      if (response.status === "Not found") {
        console.log(response);
        Alert.alert('Invalid word')
      } else {
        console.log(response);
        Alert.alert('Valid word')
      }
    })
    .catch(error => {
      console.log(error);
    })

  }

  render() {
    return (
      <View style={styles.container}>

        <Text>Player 1: {this.state.playerName} is connected: {this.state.playerConnected ? 'true' : 'false'}</Text>
        <Text>Player 2: {this.state.opponentName} is connected: {this.state.opponentConnected ? 'true' : 'false'}</Text>
        <Text>{this.state.userWord}</Text>
        <Text style={this.state.myClasses}>This blows.</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="default" 
          ref={(input) => { this.input = input }} 
          onChange={(word) => this.setState({word})}  
          //value={this.state.word} 
          placeholder="Enter a word" 
          onSubmitEditing={ () => this._onSubmit() } 
          returnKeyType='done' />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#999999'
  },
  beans: {
    textAlign: 'center',
    fontSize: 24
  },
  cool: {
    color: '#ff0000',
  }
});
