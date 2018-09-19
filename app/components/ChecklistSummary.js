import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { Card } from 'react-native-elements';
import styles from '../../App.js';

export default class ChecklistSummary extends Component {

    constructor(props) {
        super(props);
        console.log('checklist summary constructed');
    }

    render() {
        return (
            <Card title={this.props.name} style={csStyles.card}>
                <Text style={csStyles.description}>{this.props.description}</Text>
            </Card>
        );
    }
}

const csStyles = StyleSheet.create({
    card: {
        backgroundColor: '#cccccc',
        color: '#cc0000',
        fontSize: 40,
        // todo check border style
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    description: {
        fontSize: 30,
        color: '#000000',
    },
});