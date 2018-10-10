import React, { Component } from 'react';
import { View, Text, StyleSheet, CheckBox } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import * as firebase from 'firebase';

export default class FilterCheckbox extends Component {

    constructor(props) {
        super(props);
        console.log('filter constructed with props ', this.props);
    }

    render() {
        console.log('checkbox is checked: ', this.props.checked);
        return (
            <View styles={fcStyles.checkboxView}>
                <CheckBox
                    value={this.props.checked}
                    onValueChange={() => this.props.pressed(this.props.labelKey)}
                />
                <Text style={{marginTop: 5}}>{this.props.name}</Text>
            </View>
        );
    }
}

const fcStyles = StyleSheet.create({
    checkboxView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});