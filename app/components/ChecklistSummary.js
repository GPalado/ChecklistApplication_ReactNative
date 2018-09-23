import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { Card, CardContent } from 'react-native-elements';

export default class ChecklistSummary extends Component {

    constructor(props) {
        super(props);
        console.log('checklist summary constructed with props ', props);
    }

    render() {
        return (
            <View>
                <Card title={this.props.name} style={csStyles.card} titleStyle={csStyles.title}>
                    <Text style={csStyles.description}>{this.props.description}</Text>
                </Card>
            </View>
        );
    }
}

const csStyles = StyleSheet.create({
    card: {
        backgroundColor: '#cccccc',
        // todo check border style
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        height: 70,
        padding: 5,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#cc0000',
        fontSize: 30,
    },
    description: {
        fontSize: 15,
        color: '#000000',
    },
});