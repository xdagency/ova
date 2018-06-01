import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class GameSetup extends React.Component {

    constructor() {
        super();
        this.state = {
            game_id: ''
        }
    }

    componentDidMount() {
        
        if (this.props.gameType === 'join') {
            this.input.focus();
        }

    }

    _onStart = () => {
        Actions.push('word', { playerName: this.props.playerName });
    }

    render() {

        if (this.props.gameType === 'new') {

            return (
                <View style={styles.container}>
                    <View style={styles.block}>
                        {/*
                        <Text style={styles.p}>Player 1: {this.props.user_a_score}</Text>
                        <Text style={styles.p}>Player 2: {this.props.user_b_score}</Text>
                        */}
                        <Text style={styles.p}></Text>
                        <Text style={[styles.p, styles.p__space]}>Hey, {this.props.playerName}</Text>
                        <Text style={styles.p}>Game ID</Text>
                        <Text style={styles.p__big}>{this.props.game_id}</Text>
                        <Button style={styles.button} onPress={this._onStart} title="Start Game" color="#f9f9f9" />
                    </View>
                </View>
            );

        } else {

            return (
                <View style={styles.container}>
                    <View style={styles.block}>
                        <Text style={[styles.p, styles.p__space]}>Hey, {this.props.playerName}</Text>
                    </View>
                    <View style={[styles.block, styles.block__top]}>
                        <View style={styles.form}>
                            <Text style={styles.label}>Join Game</Text>
                            <TextInput 
                                style={styles.input} 
                                keyboardType="default" 
                                returnKeyType="go" 
                                ref={(input) => { this.input = input }} 
                                onChangeText={ (text) => this.setState({ game_id: text }) } 
                                onSubmitEditing={ () => this.props._onGameIdSubmit(this.state.game_id, this.props.playerName) } 
                                placeholder="Enter a game ID" />
                        </View>
                    </View>
                </View>
            )

        }
    }
}

const styles = {

    // Layout

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#e5523c'
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

    // Forms

    form: {
        flex: 1,
        marginBottom: 0,
        borderWidth: 0, borderColor: 'red'
    },
    input: {
        fontSize: 18,
        textAlign: 'center',
        borderBottomWidth: 1,
        padding: 8,
        color: 'rgba(255,255,255,0.9)',
        borderBottomColor: 'rgba(255,255,255,0.25)'
    },
    button: {
    },

    // Typography 
    p: {
        fontSize: 18,
        color: '#f9f9f9',
        lineHeight: 24
    },
    p__big: {
        fontSize: 32,
        color: '#f9f9f9',
        lineHeight: 36,
        fontWeight: 'bold',
        marginBottom: 21
    },
    p__space: {
        marginBottom: 21
    },
    label: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
        color: 'rgba(255,255,255,0.55)'
    }
}