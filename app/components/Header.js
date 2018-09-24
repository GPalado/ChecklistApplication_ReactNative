import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Header extends Component {

    constructor(props){
        super(props);
        console.log('header constructed');
    }

    render() {
        return (
            <View style={headerStyles.header}>
                <Text style={headerStyles.headerText}>{this.props.title}</Text>
            </View>
        );
    }
}

const headerStyles = StyleSheet.create({
    header: {
        backgroundColor: '#cc0000',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
    },
    headerText: {
        fontSize: 50,
        textAlign: 'center',
        color: '#ffffff',
    }
});