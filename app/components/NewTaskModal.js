import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';

export default class NewTaskModal extends Component {

    state = {
        content: '',
        deadline: '',
        errorMessage: 'This field is required'
    }

    constructor(props) {
        super(props);
        this.saveTask = this.saveTask.bind(this);
        this.render = this.render.bind(this);
    }

    render() {
          return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={taskModalStyles.modal}>
                        <FormLabel>Content</FormLabel>
                        <FormInput onChangeText={(content) => this.updateContent(content)}/>
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <FormLabel>Deadline</FormLabel>
                        <FormInput onChangeText={(deadline) => this.updateDeadline(deadline)}/>
                        <View style={taskModalStyles.buttonView}>
                            <View style={taskModalStyles.buttonContainer}>
                                <Button
                                    title="Back"
                                    onPress={this.props.toggleModal}
                                />
                            </View>
                            <View style={taskModalStyles.buttonContainer}>
                                <Button
                                    title="Save"
                                    onPress={this.saveTask}
                                />
                            </View>
                        </View>
                    </View>
              </Modal>
        )
    }

    saveTask() {
        if (this.state.content !== '') {
            console.log('task data', this.state);
            let newTask = {
                content: this.state.content,
                deadline: this.state.deadline,
                checked: false
            };
            let ref = firebase.database().ref('tasks/').push(newTask);
            ToastAndroid.show('Checklist Successfully Created', ToastAndroid.SHORT);
            this.resetState();
            this.props.updateTaskKeys(ref['key']);
            this.props.toggleModal();
        }
    }

    resetState() {
        this.setState({
            content: '',
            deadline: ''
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

    updateDeadline(deadline) {
        this.setState({deadline});
    }
}

const taskModalStyles = StyleSheet.create({
    modal: {
        padding: 20,
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
    },
    buttonContainer: {
        width: '45%'
    }
});