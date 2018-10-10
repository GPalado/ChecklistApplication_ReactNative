import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
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
                    center
                    title={this.props.name}
                    checked={this.props.checked}
                    onPress={this.props.pressed}
                />
            </View>
        );
    }
}

const fcStyles = StyleSheet.create({
    checkboxView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});