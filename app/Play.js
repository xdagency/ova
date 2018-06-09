import { Expo, LinearGradient } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, StatusBar } from 'react-native';
import CountdownCircle from 'react-native-countdown-circle';

export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            guess: '',
            user: '',
            containerClasses: [styles.container],
            overlayClasses: [styles.overlay]
        }
    }

    componentDidMount() {

        // make status bar white
        StatusBar.setBarStyle('light-content', true);

        // set which user is guessing
        this.setState({
            user: this.props.is_user_a ? 'a' : 'b'
        })

    }

    render() {

        return (
            <View style={this.state.containerClasses}>

                <LinearGradient colors={['#6a018d', 'rgba(106,1,141,0)']} start={[1,1]} end={[0.15,0.15]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

                <LinearGradient colors={['#5679f7', 'rgba(86,121,247,0)']} start={[1,0]} end={[0.2,0.88]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

                {/* Top block, game state */}
                <View style={styles.block}>
                    <Text>{this.props.winner !== '' ? this.props.winner : null}</Text>
                    <Text style={styles.p__small}>WORD</Text>
                    <Text style={[styles.p, styles.p__spread]}>
                        {this.props.is_user_a ? this.props.user_b_word.toUpperCase() : this.props.user_a_word.toUpperCase()}
                    </Text>
                </View>

                {/* Bottom block, word guessing */}
                <View style={[styles.block, styles.block__top]}>
                    <View style={styles.form}>
                        <Text style={styles.label}>Guess</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="default" 
                            maxLength={this.props.letterCount} 
                            ref={(input) => { this.input = input }} 
                            onChangeText={(text) => this.setState({ guess: text })}  
                            autoCorrect={false} 
                            placeholder={'Guess a ' + this.props.letterCount + '-letter word'} 
                            onSubmitEditing={ () => this.props._onGuessSubmit(this.props.game_id, this.state.guess, this.state.user) } 
                            returnKeyType='done' />
                    </View>
                </View>

                {/* Da scores */}
                <View style={styles.round}>
                    <Text style={styles.round__text}>ROUND {this.props.round}</Text>
                </View>
                <View style={styles.scores}>
                    <View style={styles.scoreDetails}>
                        <Text style={styles.scoreDetails__heading}>{this.props.user_a_name.toUpperCase()}</Text>
                        <Text style={styles.scoreDetails__score}>{this.props.user_a_score}</Text>
                    </View>
                    <View style={styles.scoreDetails}>
                        <Text style={[styles.scoreDetails__heading, styles.scoreDetails__right]}>{this.props.user_b_name.toUpperCase()}</Text>
                        <Text style={[styles.scoreDetails__score, styles.scoreDetails__right]}>{this.props.user_b_score}</Text>
                    </View>
                </View>

                {/* Countdown overlay */}
                <View style={this.state.overlayClasses}>
                    
                    <CountdownCircle
                        seconds={5}
                        radius={100}
                        borderWidth={0}
                        color="rgba(0,0,0,0)"
                        bgColor="#f5c13c"
                        textStyle={{ fontSize: 88, color: '#fff', fontFamily: 'Helvetica', fontWeight: 'bold' }}
                        onTimeElapsed={() => this.setState({ overlayClasses: [styles.overlay__hidden] }) }
                    />
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
        // backgroundColor: '#7e1c54',
        backgroundColor: '#44caa2'
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
    overlay: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: '#f5c13c',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        padding: 24
    },
    overlay__hidden: {
        display: 'none'
    },

    // Scores 

    round: {
        padding: 6,
        backgroundColor: '#c9c9c9',
        opacity: 0.7
    },
    round__text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    scores: {
        paddingTop: 16, paddingBottom: 32, paddingLeft: 32, paddingRight: 32,
        backgroundColor: '#dddddd',
        flexDirection: 'row',
        opacity: 0.7
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
    p__small: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 14
    },
    p__spread: {
        letterSpacing: 5,
        marginTop: 4,
        fontWeight: 'bold'
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