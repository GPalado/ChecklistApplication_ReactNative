import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';
import * as firebase from 'firebase';

export default class LabelBadge extends Component {

    state = {
        name: ''
    };

    constructor(props) {
        super(props);
        console.log('label badge constructed with props ', this.props);
    }

    componentDidMount() {
        firebase.database().ref('labels/' + this.props.labelKey).on('value', (snapshot) =>
            {
                label = snapshot.val();
                console.log('label snapshot', label);
                if(label) {
                    this.setState({
                        name: label.name
                    });
                }
            });
    }

    render() {
        return (
            <View style={lbStyles.badgeView}>
                <Badge value={this.state.name}/>
            </View>
        );
    }
}

const lbStyles = StyleSheet.create({
    badgeView: {
        height: 30,
        padding: 3
    }
});