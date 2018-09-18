import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { Card } from 'react-native-elements'
import styles from '../../App.js';

export default class ChecklistSummary extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card title={this.props.name}>
                <View key={this.props.key/>
                    <Text>{this.props.description}</Text>
                </View>
            </Card>
        );
    }
}