import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';
import { Action } from 'react-native-router-flux';

export default class Word extends React.Component {

    constructor() {
        super();
        this.state = {
            word: '',
            letterCount: 4,
            url: 'http://10.32.5.219:3001'
        }
    }

    componentDidMount() {
        
        this.input.focus();

        if (this.props.round === 3 || this.props.round === 4) { this.setState({ letterCount: 5 }) }
        if (this.props.round === 5 || this.props.round === 6) { this.setState({ letterCount: 6 }) }
        if (this.props.round === 7) { this.setState({ letterCount: 7 }) }

    }

    _onWordSubmit = (w) => {

        // Make sure word long enough
        if (w.length < this.state.letterCount) {
            Alert.alert('Gotta pick a longer word');
            return;
        }

        // Hit server at the /word endpoint
        fetch(this.state.url + '/word', {
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
                Alert.alert('Invalid word, try another');
            
            // Otherwise set the word as their word for the game
            } else {
                // console.log(response);
                Alert.alert('Valid word');
            }
        })
    
        .catch(error => {
            console.log(error);
        });

    }

    _onButtonPress = () => {

        // Get a pre-defined word
        fetch(this.state.url + '/word', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then (responsejson => {
            //console.log(responsejson);
            // Replace what's in the text box with the word that we got back from server
            this.input.setNativeProps({ text: responsejson });
            this.setState({
                word: responsejson
            })
        })
        .catch(error => {
            console.log(error);
        })

    }

    render() {

        return (
            <View style={styles.container}>

                {/* Top block, game state */}
                <View style={styles.block}>
                    {/* <Text style={styles.p}>Your word: {this.state.word}</Text> */}
                    <Text style={styles.p__small}>Player 1: {this.props.playerName} is connected: {this.props.playerConnected ? 'true' : 'false'}</Text>
                    <Text style={styles.p__small}>Player 2: {this.props.opponentName} is connected: {this.props.opponentConnected ? 'true' : 'false'}</Text>
                </View>

                {/* Bottom block, word selection */}
                <View style={[styles.block, styles.block__top]}>
                    <View style={styles.form}>
                        <Text style={styles.label}>Your word</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="default" 
                            maxLength={this.state.letterCount} 
                            ref={(input) => { this.input = input }} 
                            onChangeText={(text) => this.setState({ word: text })}  
                            placeholder={'Enter a ' + this.state.letterCount + '-letter word'} 
                            onSubmitEditing={ () => this._onWordSubmit(this.state.word) } 
                            returnKeyType='done' />
                        <Button onPress={this._onButtonPress} title={'Generate word instead'} color="#126097" style={styles.button} />
                    </View>
                </View>
                
                {/* Da scores */}
                <View style={styles.round}>
                    <Text style={styles.round__text}>ROUND {this.props.round}</Text>
                </View>
                <View style={styles.scores}>
                    <View style={styles.scoreDetails}>
                        <Text style={styles.scoreDetails__heading}>{this.props.playerName.toUpperCase()}</Text>
                        <Text style={styles.scoreDetails__score}>{this.props.playerScore}</Text>
                    </View>
                    <View style={styles.scoreDetails}>
                        <Text style={[styles.scoreDetails__heading, styles.scoreDetails__right]}>{this.props.opponentName ? this.props.opponentName.toUpperCase() : 'OPPONENT'}</Text>
                        <Text style={[styles.scoreDetails__score, styles.scoreDetails__right]}>{this.props.opponentScore}</Text>
                    </View>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    
    // Layout

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8'
    },
    block: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 36,
        borderWidth: 0, borderColor: 'red'
    },
    block__top: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },

    // Buttons

    button: {
    },

    // Scores 

    round: {
        padding: 6,
        backgroundColor: '#c9c9c9'
    },
    round__text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    scores: {
        paddingTop: 16, paddingBottom: 32, paddingLeft: 32, paddingRight: 32,
        backgroundColor: '#dedede',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    scoreDetails: {
        flex: 1,
        borderWidth: 0, borderColor: 'red'
    },
    scoreDetails__right: {
        textAlign: 'right'
    },
    scoreDetails__heading: {
        fontSize: 12,
        paddingBottom: 8,
        fontWeight: 'bold',
    },
    scoreDetails__score: {
        fontSize: 24
    },

    // Forms

    form: {
        flex: 1,
        borderWidth: 0, borderColor: 'red'
    },
    input: {
        fontSize: 18,
        textAlign: 'center',
        borderBottomWidth: 1,
        padding: 8,
        marginBottom: 16,
        color: 'rgba(0,0,0,0.9)',
        borderBottomColor: 'rgba(0,0,0,0.25)'
    },
    label: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
        color: 'rgba(0,0,0,0.55)'
    },

    // Typography

    p: {
        fontSize: 18,
        color: '#202020',
        lineHeight: 24
    },
    p__small: {
        fontSize: 12,
        color: '#AAAAAA',
        lineHeight: 14
    }

});