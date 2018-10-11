import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import { CheckBox } from 'react-native-elements';

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
                    title={this.props.name}
                    checked={this.props.checked}
                    onPress={() => this.props.pressed(this.props.labelKey)}
                />
            </View>
        );
    }
}

const fcStyles = StyleSheet.create({
    checkboxView: {
        flexDirection: 'row',
    },
});