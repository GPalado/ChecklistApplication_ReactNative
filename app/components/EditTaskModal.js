import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid, Alert } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import ModalView from './ModalView.js';
import * as firebase from 'firebase';

export default class EditTaskModal extends Component {

    state = {
        content: '',
        checked: false,
        errorMessage: ''
    }

    constructor(props) {
        super(props);
        this.saveTask = this.saveTask.bind(this);
        this.render = this.render.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        console.log("Edit task modal created with props ", props);
    }

    componentDidMount() {
        firebase.database().ref('tasks/' + this.props.taskKey).once('value', (snapshot) =>
            {
                task = snapshot.val();
                console.log('task snapshot', task);

                this.setState({
                    content: task.content,
                    checked: task.checked
                });
                console.log('state', this.state);
            });
    }

    render() {
        let buttons = [{name: 'Back', callback:this.props.toggleModal('')},{name: 'Delete', callback: this.confirmDelete},{name: 'Save', callback: this.saveTask}];
        return (
              <ModalView buttons={buttons} display={this.props.display}>
                    <FormLabel labelStyle={modalStyles.text}>Content</FormLabel>
                    <FormInput inputStyle={modalStyles.text} onChangeText={(content) => this.updateContent(content)} value={this.state.content} />
                    <FormValidationMessage labelStyle={modalStyles.errorTextContainer}>{this.state.errorMessage}</FormValidationMessage>
              </ModalView>
        );
    }

    confirmDelete() {
        Alert.alert(
            'CONFIRM',
            'Are you sure you want to delete this task?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () =>
                    {
                        console.log("Deleting task");
                        ToastAndroid.show('Task Successfully Deleted', ToastAndroid.SHORT);
                        this.props.updateTaskKeys(this.props.taskKey);
                        this.props.toggleModal('');
                    },
                }
            ]
        );
    }

    saveTask() {
        if (this.state.content !== '') {
            console.log('task data', this.state);
            let ref = firebase.database().ref('tasks/' + this.props.taskKey).set({
                content: this.state.content,
                checked: this.state.checked
            });
            ToastAndroid.show('Task Successfully Updated', ToastAndroid.SHORT);
            this.props.toggleModal('');
        }
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