import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Button, ToastAndroid, Text, TouchableNativeFeedback, Alert } from 'react-native';
import { FormInput, FormLabel, Badge } from 'react-native-elements';
import ChecklistSummary from './ChecklistSummary.js';
import LabelBadge from './LabelBadge.js';
import Task from './Task.js';
import { Actions } from 'react-native-router-flux';
import NewTaskModal from './NewTaskModal.js';
import EditTaskModal from './EditTaskModal.js';
import EditLabelsModal from './EditLabelsModal.js';
import * as firebase from 'firebase';

export default class Checklist extends Component {

    state = {
        name: '',
        description: '',
        labelKeys: [],
        taskKeys: [],
        originalTaskKeys: [],
        originalLabelKeys: [],
        displayNewTaskModal: false,
        displayEditTaskModalKey: '',
        displayEditLabelsModal: false
    };

    constructor(props) {
        super(props);
        console.log('checklist constructed with props ', this.props);
        this.render = this.render.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.toggleNewTaskModal = this.toggleNewTaskModal.bind(this);
        this.updateTaskKeys = this.updateTaskKeys.bind(this);
        this.updateLabelKeys = this.updateLabelKeys.bind(this);
        this.toggleEditTaskModal = this.toggleEditTaskModal.bind(this);
        this.toggleEditLabelsModal = this.toggleEditLabelsModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('checklists/' + this.props.clKey).on('value', (snapshot) =>
            {
                checklist = snapshot.val();
                console.log('checklist snapshot', checklist);
                let labelKeys = [];
                let taskKeys = [];
                if(checklist){
                    if(checklist.labelKeys){
                        Object.keys(checklist.labelKeys).forEach((key) => {
                            labelKeys.push(checklist.labelKeys[key]);
                        });
                    }
                    if(checklist.taskKeys){
                        Object.keys(checklist.taskKeys).forEach((key) => {
                            taskKeys.push(checklist.taskKeys[key]);
                        });
                    }
                    console.log("label keys", labelKeys);
                    console.log("task keys", taskKeys);
                    this.setState({
                        name: checklist.name,
                        description: checklist.description,
                        labelKeys: labelKeys,
                        taskKeys: taskKeys,
                        originalTaskKeys: taskKeys,
                        originalLabelKeys: labelKeys
                    });
                }
            });
    }

    toggleEditTaskModal(key) {
        if(this.state.displayEditTaskModalKey !== key) {
            console.log("toggling edit task modal with key ", key);
            this.setState({
                displayEditTaskModalKey: key
            });
        }
    }

    toggleEditLabelsModal(){
        this.setState({
            displayEditLabelsModal: !this.state.displayEditLabelsModal
        });
    }

    render() {
        let labelBadges = this.state.labelKeys.map(lKey => <LabelBadge labelKey={lKey} key={lKey}/>);
        let tasks = this.state.taskKeys.map(tKey =>
            <View key={tKey}>
                <Task taskKey={tKey} clKey={this.props.clKey} key={tKey}/>
                <TouchableNativeFeedback style={{flexDirection: 'row', height: 30, padding: 5, backgroundColor: '#eeeeee'}} onPress={() => this.toggleEditTaskModal(tKey)}>
                    <View style={{height: 20, padding: 5}}>
                        <Text style={{fontSize: 10, textAlign: 'right'}}>^ Edit Task</Text>
                    </View>
                </TouchableNativeFeedback>
                <EditTaskModal display={this.state.displayEditTaskModalKey === tKey} taskKey={tKey} clKey={this.props.clKey} toggleModal={this.toggleEditTaskModal} updateTaskKeys={this.updateTaskKeys} />
            </View>
        );
        let editLabelsModal = (<EditLabelsModal style={{flex: 1}} display = {this.state.displayEditLabelsModal} existingLabels = {this.state.labelKeys} toggleModal = {this.toggleEditLabelsModal} updateLabelKeys={this.updateLabelKeys} />);
        return (
            <View style={clStyles.checklist}>
                <NewTaskModal style={{flex: 1}} display = {this.state.displayNewTaskModal} toggleModal = {this.toggleNewTaskModal} updateTaskKeys = {this.updateTaskKeys} />
                { editLabelsModal }
                <ScrollView style={clStyles.scroll}>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={(name) => this.updateName(name)} value={this.state.name}/>
                    <FormLabel>Description</FormLabel>
                    <FormInput onChangeText={(desc) => this.updateDescription(desc)} value={this.state.description}/>
                    { labelBadges }
                    <View>
                        <TouchableNativeFeedback onPress={() => this.toggleEditLabelsModal()}>
                            <View style={clStyles.badgeView}>
                                <Badge value="+/- Labels" containerStyle={clStyles.badge}/>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    { tasks }
                </ScrollView>
                <View style={clStyles.buttonView}>
                    <View style={clStyles.buttonContainer}>
                        <Button
                            title='New Task'
                            onPress={this.toggleNewTaskModal}
                        />
                    </View>
                    <View style={clStyles.buttonContainer}>
                        <Button
                            title="Delete"
                            onPress={() => this.confirmDelete(this.state.originalTaskKeys, this.state.taskKeys, this.state.originalLabelKeys)}
                        />
                    </View>
                    <View style={clStyles.buttonContainer}>
                        <Button
                            title='Save'
                            onPress={this.saveChanges}
                        />
                    </View>
                </View>
            </View>
        );
    }

    confirmDelete(originalTaskKeys, taskKeys, originalLabelKeys) {
        Alert.alert(
            'CONFIRM',
            'Are you sure you want to delete this checklist?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () =>
                    {
                        console.log("Deleting checklist");
                        // Delete tasks belonging to this checklist - both old and new
                        originalTaskKeys.forEach((ogTaskKey) => {
                            firebase.database().ref('tasks/' + ogTaskKey).remove();
                        });
                        taskKeys.forEach((taskKey) => {
                            if(!this.state.originalTaskKeys.includes(taskKey)) {
                                firebase.database.ref('tasks/' + taskKey).remove();
                            }
                        });
                        // Ensure the label references are deleted
                        originalLabelKeys.forEach((ogLabelKey) => {
                            let checklistRef = '';
                            firebase.database().ref('labels/' + ogLabelKey + '/checklistKeys').once('value', (snapshot) => {
                                let checklistKeys = snapshot.val();
                                if(checklistKeys) {
                                    Object.keys(checklistKeys).forEach((clKey) => {
                                        if(snapshot.val()[clKey] === this.props.clKey) {
                                            checklistRef = clKey;
                                        }
                                    });
                                }
                            }).then((data) => {
                                firebase.database().ref('labels/' + ogLabelKey + '/checklistKeys/' + checklistRef).remove();
                            });
                        });

                        firebase.database().ref('checklists/' + this.props.clKey).remove();

                        ToastAndroid.show('Checklist Successfully Deleted', ToastAndroid.SHORT);
                        Actions.pop();
                    },
                }
            ]
        );
    }

    toggleNewTaskModal() {
        console.log('toggled new task modal');
        this.setState({
            displayNewTaskModal: !this.state.displayNewTaskModal
        });
    }

    updateName(name){
        this.setState({name: name});
    }

    updateDescription(desc){
        this.setState({description: desc});
    }

    updateTaskKeys(taskKey) {
        console.log("updating task keys with ", taskKey);
        let newTaskKeys = this.state.taskKeys;
        if(newTaskKeys.includes(taskKey)) {
            newTaskKeys.splice(newTaskKeys.indexOf(taskKey), 1);
        } else {
            newTaskKeys.push(taskKey);
        }
        this.setState({
            taskKeys: newTaskKeys
        });
    }

    updateLabelKeys(newLabelKeys) {
        console.log("updating label keys with ", newLabelKeys);
        this.setState({
            labelKeys: newLabelKeys
        });
    }

    saveChanges() {
        firebase.database().ref('checklists/' + this.props.clKey).set({
            name: this.state.name,
            description: this.state.description
        });
        this.state.labelKeys.forEach((labelKey) => {
            firebase.database().ref('checklists/' + this.props.clKey + '/labelKeys').push(labelKey);
        });
        this.state.taskKeys.forEach((taskKey) => {
            firebase.database().ref('checklists/' + this.props.clKey + '/taskKeys').push(taskKey);
        });
        // If tasks have been deleted from the checklist, ensure they are deleted from db tasks
        this.state.originalTaskKeys.forEach((ogTaskKey) => {
            if(!this.state.taskKeys.includes(ogTaskKey)) {
                firebase.database().ref('tasks/' + ogTaskKey).remove();
            }
        });
        // If labels have been added removed from the checklist, ensure the references are altered appropriately
        this.state.originalLabelKeys.forEach((ogLabelKey) => {
            if(!this.state.labelKeys.includes(ogLabelKey)) {
                let checklistRef = '';
                firebase.database().ref('labels/' + ogLabelKey + '/checklistKeys').once('value', (snapshot) => {
                    let checklistKeys = snapshot.val();
                    if(checklistKeys) {
                        Object.keys(checklistKeys).forEach((clKey) => {
                            if(snapshot.val()[clKey] === this.props.clKey) {
                                checklistRef = clKey;
                            }
                        });
                    }
                }).then((data) => {
                    firebase.database().ref('labels/' + ogLabelKey + '/checklistKeys/' + checklistRef).remove();
                });
            }
        });
        this.state.labelKeys.forEach((labelKey) => {
            if(!this.state.originalLabelKeys.includes(labelKey)) {
                firebase.database().ref('labels/' + labelKey + '/checklistKeys').push(this.props.clKey);
            }
        });
        ToastAndroid.show('Checklist Successfully Updated', ToastAndroid.SHORT);
        Actions.pop();
    }
}

const clStyles = StyleSheet.create({
    scroll: {
        flex: 1,
        padding: 10,
    },
    checklist: {
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
    },
    badgeView: {
        height: 40,
        padding: 5
    },
    badge: {
        backgroundColor: '#888888'
    }
});