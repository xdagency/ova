import { Expo, BlurView } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, StatusBar } from 'react-native';
import { Action } from 'react-native-router-flux';
import CountdownCircle from 'react-native-countdown-circle';

export default class Word extends React.Component {

    constructor() {
        super();
        this.state = {
            word: '',
            overlayClasses: [styles.overlay]
        }
    }


    //////////////////////////////
    // COMPONENT DID UPDATE
    //////////////////////////////

    componentDidUpdate() {

        // make status bar black
        StatusBar.setBarStyle('dark-content', true);

    }


    //////////////////////////////
    // GENERATE A RANDOM WORD
    //////////////////////////////

    _onButtonPress = () => {

        // Get a pre-defined word
        fetch(this.props.ip + '/word?round=' + this.props.round, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then (responsejson => {
            //console.log(responsejson);
            // Replace what's in the text box with the word that we got back from server
            this.input.setNativeProps({ text: responsejson });
            this.setState({
                word: responsejson
            })

            // focus the input so user can press 'Done'
            this.input.focus();
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
                    <Text style={styles.p__small}>Game ID: {this.props.game_id.toUpperCase()}</Text>
                    {this.props.round > 1 ? (
                        <Text style={[styles.p, styles.p__bold]}>Point {this.props.winner === 'a' ? this.props.user_a_name : this.props.user_b_name}!</Text>
                    ) : (
                        null
                    )}
                </View>

                {/* Bottom block, word selection */}
                <View style={[styles.block, styles.block__top]}>
                    <View style={styles.form}>
                        <Text style={styles.label}>Your word</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType="default" 
                            maxLength={this.props.letterCount} 
                            ref={(w_input) => { this.input = w_input }} 
                            onChangeText={(text) => this.setState({ word: text })}  
                            placeholder={'Enter a ' + this.props.letterCount + '-letter word'} 
                            onSubmitEditing={ () => this.props._onWordSubmit(this.props.game_id, this.state.word) } 
                            showDoneButton={true} 
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
                        <Text style={styles.scoreDetails__heading}>{this.props.user_a_name.toUpperCase()}</Text>
                        <Text style={styles.scoreDetails__score}>{this.props.user_a_score}</Text>
                    </View>
                    <View style={styles.scoreDetails}>
                        <Text style={[styles.scoreDetails__heading, styles.scoreDetails__right]}>{this.props.user_b_name ? this.props.user_b_name.toUpperCase() : 'OPPONENT'}</Text>
                        <Text style={[styles.scoreDetails__score, styles.scoreDetails__right]}>{this.props.user_b_score}</Text>
                    </View>
                </View>
                
                
                {/* Word entered overlay */}
                <View style={[styles.overlay, { display: this.props.displayOverlay }]}>
                    <View style={styles.overlay__bg}></View>
                    <View style={styles.overlay__text}>
                        <Text style={[styles.p, styles.p__dark]}>{this.props.word} LOCKED IN</Text>
                        <Text style={styles.p__small}>Waiting for other players</Text>
                    </View>
                </View>

                {/*<BlurView tint="dark" intensity={80} style={[StyleSheet.absoluteFill, { display: this.props.displayOverlay }]}>
                    <View style={styles.overlay__text}>
                        <Text style={[styles.p, styles.p__dark]}>{this.props.word} LOCKED IN</Text>
                        <Text style={styles.p__small}>Waiting for other players</Text>
                    </View>
                </BlurView>*/}

            </View>

        );
    }
}

const styles = StyleSheet.create({
    
    // Layout

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
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
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        padding: 24,
    },
    overlay__bg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: '#111111',
        opacity: 0.5
    },
    overlay__hidden: {
        display: 'none'
    },
    overlay__text: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        paddingLeft: 16,
        paddingRight: 16,
        opacity: 1,
        shadowOffset: { width: 0, height: 16 },
        shadowColor: '#000000',
        shadowOpacity: 0.155,
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 4
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
    p__bold: {
        fontWeight: 'bold'
    },
    p__dark: {
        color: '#202020',
        textAlign: 'center'
    },
    p__small: {
        fontSize: 12,
        color: '#AAAAAA',
        lineHeight: 14,
        textAlign: 'center'
    }

});