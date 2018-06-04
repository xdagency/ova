import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class GameSetup extends React.Component {

    constructor() {
        super();
        this.state = {
            game_id: ''
        }
    }


    //////////////////////////////
    // COMPONENT DID MOUNT
    //////////////////////////////

    componentDidMount() {
        
        // make status bar white
        StatusBar.setBarStyle('light-content', true);

        if (this.props.gameType === 'join') {
            this.input.focus();
        }

    }


    //////////////////////////////
    // START GAME BUTTON
    //////////////////////////////

    _onStart = () => {
        Actions.push('word', { 
            ip: this.props.ip, 
            game_id: this.props.game_id,
            user_a_name: this.props.user_a_name, 
            user_b_name: this.props.user_b_name,
            is_user_a: this.props.is_user_a,
            round: this.props.round, 
            user_a_score: 0, 
            user_b_score: 0, 
            letterCount: this.props.letterCount,
            _onWordSubmit: this.props._onWordSubmit
        });
    }


    ///// RENDER /////

    render() {

        if (this.props.gameType === 'new') {

            return (
                <View style={styles.container}>
                    <View style={styles.block}>
                        <Text style={[styles.p, styles.p__space]}>Hey, {this.props.user_a_name}</Text>
                    </View>
                    <View style={[styles.block, styles.block__top]}>
                        {/*
                        <Text style={styles.p}>Player 1: {this.props.user_a_score}</Text>
                        <Text style={styles.p}>Player 2: {this.props.user_b_score}</Text>
                        */}
                        <Text style={styles.p}>Game ID</Text>
                        <View style={styles.span}><Text style={styles.p__big}>{this.props.game_id}</Text></View>
                        <Button style={styles.button} onPress={this._onStart} title="Start Game" color="#f9f9f9" />
                    </View>
                </View>
            );

        } else {

            return (
                <View style={styles.container}>
                    <View style={styles.block}>
                        <Text style={[styles.p, styles.p__space]}>Hey, {this.props.user_b_name}</Text>
                    </View>
                    <View style={[styles.block, styles.block__top]}>
                        <View style={styles.form}>
                            <Text style={styles.label}>Join Game</Text>
                            <TextInput 
                                style={styles.input} 
                                keyboardType="default" 
                                returnKeyType="go" 
                                maxLength={4} 
                                autoCorrect={false}
                                ref={(input) => { this.input = input }} 
                                onChangeText={ (text) => this.setState({ game_id: text }) } 
                                onSubmitEditing={ () => this.props._onGameIdSubmit(this.state.game_id, this.props.user_b_name) } 
                                placeholder="Enter a game ID" />
                        </View>
                    </View>
                </View>
            )

        }
    }
}

const styles = StyleSheet.create({

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
    span: {
        padding: 4,
        backgroundColor: '#d1432e',
        marginTop: 4,
        marginBottom: 21,
        shadowOffset: { width: 0, height: 16 },
        shadowColor: '#000000',
        shadowOpacity: 0.155,
        shadowRadius: 10,
        elevation: 3
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
        textAlign: 'center',
        lineHeight: 24
    },
    p__big: {
        fontSize: 36,
        color: '#f9f9f9',
        lineHeight: 48,
        fontFamily: 'Didot',
        fontWeight: 'bold',
        textAlign: 'center'
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
})