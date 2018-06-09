import { Expo, LinearGradient } from 'expo';
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
        StatusBar.setBarStyle('dark-content', true);

        if (this.props.gameType === 'join') {
            this.input.focus();
        }

    }

    ///// RENDER /////

    render() {

        return (
            <View style={styles.container}>

                <LinearGradient colors={['#ec8f3f', 'rgba(236,143,63,0)']} start={[1,0]} end={[0,0]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

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
        opacity: 0.75,
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