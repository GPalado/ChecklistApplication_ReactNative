import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import * as firebase from 'firebase';

export default class FilterCheckbox extends Component {

    state = {
        checked: false
    }

    constructor(props) {
        super(props);
        console.log('filter constructed with props ', this.props);
        this.state = {checked: this.props.checked};
        this.pressed = this.pressed.bind(this);
    }

    render() {
        return (
            <View styles={fcStyles.checkboxView}>
                <CheckBox
                    center
                    title={this.props.name}
                    checked={this.state.checked}
                    onPress={this.pressed}
                    containerStyle={fcStyles.containerView}
                />
            </View>
        );
    }

    pressed() {
        console.log("Filter pressed");
        this.props.pressed();
        this.setState({
            checked: !this.state.checked
        });
    }

    setChecked(newChecked) {
        this.setState({checked: newChecked});
    }

    isChecked() {
        return this.state.checked;
    }

    getLabelKey() {
        return this.props.labelKey;
    }
}

const fcStyles = StyleSheet.create({
    checkboxView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});