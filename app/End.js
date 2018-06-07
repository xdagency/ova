import { Expo, LinearGradient } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, StatusBar, Actions } from 'react-native';

export default class End extends React.Component {

    componentDidMount() {

        // make status bar white
        StatusBar.setBarStyle('light-content', true);

    }

    render() {

        return (
            <View style={styles.container}>

                <LinearGradient colors={['#3a87d4', 'rgba(58,135,212,0)']} start={[0,0]} end={[0.1,0.95]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

                <View style={styles.block}>
                    <Text style={styles.heading}>Game Over</Text>
                    <Text style={[styles.p]}>Final Score</Text>
                </View>

                {/* Bottom block, username selection */}
                <View style={[styles.block, styles.grid]}>

                    <View style={styles.card}>
                        <Text style={[styles.p, styles.black]}>{this.props.user_a_name.toUpperCase()}</Text>
                        <Text style={[styles.p, styles.p__big]}>{this.props.user_a_score}</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={[styles.p, styles.black]}>{this.props.user_b_name.toUpperCase()}</Text>
                        <Text style={[styles.p, styles.p__big]}>{this.props.user_b_score}</Text>
                    </View>
                    
                </View>

                <View style={[styles.block, styles.block__top]}>
                    <Button title='New game' color='#f9f9f9' onPress={() => { this.props._onNewGame()}} />
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
        backgroundColor: '#a3f77f'
    },
    block: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 36,
        borderWidth: 0, borderColor: 'red'
    },
    block__top: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        width: '40%',
        borderRadius: 3,
        shadowOffset: { width: 0, height: 16 },
        shadowColor: '#000000',
        shadowOpacity: 0.155,
        shadowRadius: 10,
        elevation: 3
    },

    // Typography 

    p: {
        fontSize: 18,
        color: '#f9f9f9',
        textAlign: 'center',
        lineHeight: 24
    },
    p__big: {
        color: '#202020',
        fontSize: 32,
        lineHeight: 38,
        fontWeight: 'bold'
    },
    p__space: {
        marginBottom: 16
    },
    black: {
        color: '#202020',
        fontSize: 12,
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