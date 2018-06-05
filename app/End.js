import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, StatusBar } from 'react-native';

export default class End extends React.Component {

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

    _newGame = () => {

    }

    render() {

        return (
            <View style={styles.container}>

                <View style={styles.block}>
                    <Text style={styles.heading}>Game Over</Text>
                    <Text style={[styles.p]}>Final Score</Text>
                </View>

                {/* Bottom block, username selection */}
                <View style={[styles.block, styles.block__top]}>
                    <Text style={styles.p}>{this.props.user_a_name}</Text>
                    <Text style={[styles.p, styles.p__big, styles.p__space]}>{this.props.user_a_score}</Text>
                    <Text style={styles.p}>{this.props.user_b_name}</Text>
                    <Text style={[styles.p, styles.p__big, styles.p__space]}>{this.props.user_b_score}</Text>
                    <View style={styles.p__space}></View>
                    <Button title='New game' color='#f9f9f9' onPress={ () => { this._newGame() } } />
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
        backgroundColor: '#126097'
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

    // Typography 

    p: {
        fontSize: 18,
        color: '#f9f9f9',
        textAlign: 'center',
        lineHeight: 24
    },
    p__big: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: 'bold'
    },
    p__space: {
        marginBottom: 16
    },
    heading: {
        color: '#f9f9f9',
        fontFamily: 'Didot',
        // fontWeight: 'bold',
        fontSize: 44,
        shadowOffset: { width: 0, height: 12 },
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    label: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
        color: 'rgba(255,255,255,0.55)'
    }
})