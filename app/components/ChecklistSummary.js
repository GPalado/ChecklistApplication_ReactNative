import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Card, CardContent, Badge } from 'react-native-elements';
import LabelBadge from './LabelBadge.js';

export default class ChecklistSummary extends Component {

    constructor(props) {
        super(props);
        console.log('checklist summary constructed with props ', props);
    }

    render() {
        return (
            <View>
                <TouchableNativeFeedback onPress={this.viewChecklist}>
                    <Card title={this.props.name} style={csStyles.card} titleStyle={csStyles.title}>
                        <Text style={csStyles.description}>{this.props.description}</Text>
                        {
                            (this.props.labelKeys.length > 0)
                             ?
                                this.props.labelKeys.map(l => <LabelBadge labelKey={l.key} key={l.key}/>)
                                : null
                        }
                    </Card>
                </TouchableNativeFeedback>
            </View>
        );
    }

    viewChecklist() {
        // TODO: Use this.props.key to load checklist in a new view?
    }
}

const csStyles = StyleSheet.create({
    card: {
        backgroundColor: '#cccccc',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        height: 70,
        padding: 5,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'stretch',
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