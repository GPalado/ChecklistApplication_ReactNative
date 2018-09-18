import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Header extends Component {

    constructor(props){
        super(props);
        console.log('header constructed');
    }

    render() {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#cc0000',
        height: 55,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerText: {
        fontSize: 40,
        textAlign: 'center',
        color: '#000000',
    }
});