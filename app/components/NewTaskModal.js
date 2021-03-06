import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import ModalView from './ModalView.js';
import * as firebase from 'firebase';

export default class NewTaskModal extends Component {

    state = {
        content: '',
        errorMessage: 'This field is required'
    }

    constructor(props) {
        super(props);
        this.saveTask = this.saveTask.bind(this);
        this.render = this.render.bind(this);
    }

    render() {
        let buttons = [{name: 'Back', callback: this.props.toggleModal},{name: 'Save', callback: this.saveTask}];
        return (
              <ModalView buttons={buttons} display={this.props.display}>
                    <FormLabel labelStyle={modalStyles.text}>Content</FormLabel>
                    <FormInput inputStyle={modalStyles.text} onChangeText={(content) => this.updateContent(content)}/>
                    <FormValidationMessage labelStyle={modalStyles.errorTextContainer}>{this.state.errorMessage}</FormValidationMessage>
              </ModalView>
        )
    }

    saveTask() {
        if (this.state.content !== '') {
            console.log('task data', this.state);
            let newTask = {
                content: this.state.content,
                checked: false
            };
            let ref = firebase.database().ref('tasks/').push(newTask);
            ToastAndroid.show('Task Successfully Created', ToastAndroid.SHORT);
            this.resetState();
            this.props.updateTaskKeys(ref['key']);
            this.props.toggleModal();
        }
    }

    resetState() {
        this.setState({
            content: '',
            errorMessage: 'This field is required'
        });
    }

    updateContent(content) {
        this.setState({content});
        if(content == '') {
            this.setState({
                errorMessage: 'This field is required'
            });
        } else {
            this.setState({
                errorMessage: ''
            });
        }
    }
}

const modalStyles = StyleSheet.create({
    text: {
        color: 'white'
    },
    errorTextContainer: {
        color: '#eeeeee'
    }
});