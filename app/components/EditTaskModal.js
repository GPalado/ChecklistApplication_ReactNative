import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid, Alert } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';

export default class EditTaskModal extends Component {

    state = {
        content: '',
        deadline: '',
        checked: false,
        errorMessage: 'This field is required'
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
                    deadline: task.deadline,
                    checked: task.checked
                });
                console.log('state', this.state);
            });
    }

    render() {
          return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={taskModalStyles.modal}>
                        <FormLabel>Content</FormLabel>
                        <FormInput onChangeText={(content) => this.updateContent(content)} value={this.state.content} />
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <FormLabel>Deadline</FormLabel>
                        <FormInput onChangeText={(deadline) => this.updateDeadline(deadline)} value={this.state.deadline} />
                        <View style={taskModalStyles.buttonView}>
                            <View style={taskModalStyles.buttonContainer}>
                                <Button
                                    title="Back"
                                    onPress={() => this.props.toggleModal('')}
                                />
                            </View>
                            <View style={taskModalStyles.buttonContainer}>
                                <Button
                                    title="Delete"
                                    onPress={this.confirmDelete}
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
//
//    deleteTask() {
//
//    }

    saveTask() {
        if (this.state.content !== '') {
            console.log('task data', this.state);
            let ref = firebase.database().ref('tasks/' + this.props.taskKey).set({
                content: this.state.content,
                deadline: this.state.deadline,
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
        width: '30%'
    }
});