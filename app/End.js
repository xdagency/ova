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

    render() {

        return (
            <View style={styles.container}>

                {/* Bottom block, username selection */}
                <View style={[styles.block]}>
                    <View style={styles.form}>
                        <Text style={styles.p}>Final Score</Text>
                        <Text style={styles.p}>{this.props.user_a_name}</Text>
                        <Text style={[styles.p, styles.p__big]}>{this.props.user_a_score}</Text>
                        <Text style={styles.p}>{this.props.user_a_name}</Text>
                        <Text style={[styles.p, styles.p__big]}>{this.props.user_a_score}</Text>
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

    p: {
        fontSize: 18,
        color: '#f9f9f9',
        textAlign: 'center',
        lineHeight: 24
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