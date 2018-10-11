import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import * as firebase from 'firebase';

export default class LabelBadge extends Component {

    state = {
        content: '',
        deadline: '',
        checked: false
    };

    constructor(props) {
        super(props);
        console.log('task constructed with props ', this.props);
    }

    componentDidMount() {
        firebase.database().ref('tasks/' + this.props.taskKey).on('value', (snapshot) =>
            {
                task = snapshot.val();
                console.log('task snapshot', task);

                this.setState({
                    content: task.content,
                    deadline: task.deadline,
                    checked: task.checked
                });
                console.log('state', this.state);
            });
    }

    render() {
        return (
            <View styles={tStyles.checkboxView}>
                <CheckBox
                    title={this.state.content}
                    checked={this.state.checked}
                    onPress={() => this.handleChecked}
                />
            </View>
        );
    }

    handleChecked() {

    }
}

const tStyles = StyleSheet.create({
    checkboxView: {
        flexDirection: 'row',
    }
});