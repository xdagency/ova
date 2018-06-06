import { Expo, LinearGradient } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, StatusBar } from 'react-native';

export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            username: ''
        }
    }

    componentDidMount() {

        // make status bar white
        StatusBar.setBarStyle('light-content', true);

    }

    render() {

        return (
            <View style={styles.container}>

                <LinearGradient colors={['#f760ab', 'rgba(240,210,110, 0)']} start={[1,1]} end={[0.15,0.15]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

                <LinearGradient colors={['#fdbb2d', 'rgba(253, 187, 45, 0)']} start={[1,0]} end={[0.2,0.88]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

                {/* Top block, app title */}
                <View style={styles.block}>
                    <Text style={styles.heading}>Ova</Text>
                </View>

                {/* Bottom block, username selection */}
                <View style={[styles.block, styles.block__top]}>
                    <View style={styles.form}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="default" 
                            maxLength={10} 
                            returnKeyType="done" 
                            onChangeText={ (text) => this.setState({ username: text }) } 
                            // onSubmitEditing={ () => this.props._onUsernameSubmit(this.state.username) } 
                            placeholder="Enter a username" />
                    </View>
                    <View style={styles.form}>
                        <Button onPress={ () => { this.props._onJoinGame(this.state.username) }} title="Join Game" color="#f9f9f9" />
                        <Button onPress={ () => { this.props._onCreateGame(this.state.username) }} title="Create New Game" color="#f9f9f9" />
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
        backgroundColor: '#22c1c3'
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
        backgroundColor: '#dddddd',
        flexDirection: 'row'
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

    // Typography 

    heading: {
        color: '#f9f9f9',
        fontFamily: 'Didot',
        // fontWeight: 'bold',
        fontSize: 44,
        shadowOffset: { width: 0, height: 12 },
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 7
    },
    label: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
        color: 'rgba(255,255,255,0.55)'
    }
})


/* GRADIENTS 

Light and summery: #4eaaeb, #f760ab, fdbb2d

*/