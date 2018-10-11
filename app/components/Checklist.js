import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, ToastAndroid } from 'react-native';
import { FormInput, FormLabel } from 'react-native-elements';
import ChecklistSummary from './ChecklistSummary.js';
import LabelBadge from './LabelBadge.js';
import Task from './Task.js';
import { Actions } from 'react-native-router-flux';
import NewTaskModal from './NewTaskModal.js';
import * as firebase from 'firebase';

export default class Checklist extends Component {

    state = {
        name: '',
        description: '',
        labelKeys: [],
        taskKeys: [],
        loading: true,
        displayNewTaskModal: false
    };

    constructor(props) {
        super(props);
        console.log('checklist constructed with props ', this.props);
        this.render = this.render.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.toggleNewTaskModal = this.toggleNewTaskModal.bind(this);
        this.updateTaskKeys = this.updateTaskKeys.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('checklists/' + this.props.clKey).on('value', (snapshot) =>
            {
                checklist = snapshot.val();
                console.log('checklist snapshot', checklist);
                let labelKeys = [];
                let taskKeys = [];
                if(checklist.labelKeys){
                    Object.keys(checklist.labelKeys).forEach((key) => {
                        labelKeys.push({
                            key: checklist.labelKeys[key]
                        });
                    });
                }
                if(checklist.taskKeys){
                    Object.keys(checklist.taskKeys).forEach((key) => {
                        taskKeys.push({
                            key: checklist.taskKeys[key]
                        });
                    });
                }
                this.setState({
                    name: checklist.name,
                    description: checklist.description,
                    labelKeys: labelKeys,
                    taskKeys: taskKeys,
                    loading: false
                });
            });
    }

    render() {
        var labelBadges = this.state.labelKeys.map(lKey => <LabelBadge labelKey={lKey.key} key={lKey.key}/>);
        var tasks = this.state.taskKeys.map(tKey => <Task taskKey={tKey.key} key={tKey.key}/>);
        var labelsAndTasks = labelBadges.concat(tasks);
        return (
            <View style={clStyles.checklist}>
                <NewTaskModal style={{flex: 1}} display = {this.state.displayNewTaskModal} toggleModal = {this.toggleNewTaskModal} updateTaskKeys = {this.updateTaskKeys} />
                <ScrollView style={clStyles.scroll}>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={(name) => this.updateName(name)} value={this.state.name}/>
                    <FormLabel>Description</FormLabel>
                    <FormInput onChangeText={(desc) => this.updateDescription(desc)} value={this.state.description}/>
                    {
                        (this.state.loading) ?
                            <ActivityIndicator size='large' color='#cc0000' animating={this.state.loading}/>
                        :
                            labelsAndTasks
                    }
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
                            title='Save Changes'
                            onPress={this.saveChanges}
                        />
                    </View>
                </View>
            </View>
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
        let newTaskKeys = this.state.taskKeys;
        if(newTaskKeys.includes(taskKey)) {
            newTaskKeys.splice(newTaskKeys.indexOf(taskKey), 1);
        } else {
            newTaskKeys.push({
                key: taskKey
            });
        }
        this.setState({
            taskKeys: newTaskKeys
        });
        console.log("new task keys", newTaskKeys);
    }

    saveChanges() {
        firebase.database().ref('checklists/' + this.props.clKey).set({
            name: this.state.name,
            description: this.state.description
        });
        this.state.labelKeys.forEach((labelKey) => {
            firebase.database().ref('checklists/' + this.props.clKey + '/labelKeys').push(labelKey['key']);
        });
        this.state.taskKeys.forEach((taskKey) => {
            firebase.database().ref('checklists/' + this.props.clKey + '/taskKeys').push(taskKey['key']);
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
        width: '45%'
    }
});