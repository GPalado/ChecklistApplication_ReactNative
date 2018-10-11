import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header.js';
import ChecklistsView from './ChecklistsView.js';

export default class Home extends Component {

    constructor(props) {
        super(props);
        console.log('home constructed');
    }

    render() {
        return (
            <View style={homeStyles.vertContainer}>
                <Header title='Home' />
                <ChecklistsView />
            </View>
        );
    }
}

const homeStyles = StyleSheet.create({
    vertContainer: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
});