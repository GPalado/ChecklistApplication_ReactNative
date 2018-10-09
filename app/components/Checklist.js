import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import ChecklistSummary from './ChecklistSummary.js';
import LabelBadge from './LabelBadge.js';
import Task from './Task.js';
import * as firebase from 'firebase';

export default class Checklist extends Component {

    state = {
        name: '',
        description: '',
        labelKeys: [],
        taskKeys: []
        loading: true
    };

    constructor(props) {
        super(props);
        console.log('checklist constructed');
    }

    componentDidMount() {
        firebase.database().ref('checklists/' + this.props.key).on('value', (snapshot) =>
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
                console.log('state', this.state);
            });
    }

    render() {
        return (
            <View style={clStyles.checklist}>
                <ScrollView style={clStyles.scroll}>
                    <Text style={clStyles.title}>{this.state.name}</Text>
                    <Text style={clStyles.description}>{this.state.description}</Text>
                    {
                        (this.state.loading)
                        ?
                        <ActivityIndicator size='large' color='#cc0000' animating={this.state.loading}/>
                        :
                        this.state.labelKeys.map(lKey => <LabelBadge key={lKey}/>)

                    }
                </ScrollView>
                <Button
                    title='Create New Task'
                    buttonStyle={clStyles.addTaskButton}
                    onPress={this.createNewTask}
                />
            </View>
        );
    }
//                        this.state.taskKeys.map(tKey => <Task key={tKey}/>)
    createNewTask() {
        // TODO: creating new task
    }
}

const clStyles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    checklist: {
        flexDirection: 'column',
        flex: 8,
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
     },
    title: {
        color: '#cc0000',
        fontSize: 30,
    },
    description: {
        fontSize: 15,
        color: '#000000',
    },
    addTaskButton: {
        backgroundColor: '#cccccc',
        padding: 10,
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 300,
    }
});