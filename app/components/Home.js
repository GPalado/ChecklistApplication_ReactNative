import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import ChecklistSummary from './ChecklistSummary.js';

export default class Home extends Component {

    state = {
        checklists: []
    };

    constructor(props) {
        super(props);
        console.log('home constructed');
    }

    componentDidMount() {
        firebase.database().ref('checklists/').on('value', (snapshot) =>
            {
                console.log('checklists snapshot', snapshot.val());
                let checklists = [];
                let checklistKVs = snapshot.val();
                Object.keys(checklistKVs).forEach((key) => {
                    checklists.push({
                        name: checklistKVs[key].name,
                        description: checklistKVs[key].description,
                        key: key
                    });
                });
                this.setState({checklists});
                console.log('kvs', this.state.checklists);
            });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={homeStyles.scroll}>
                {
                    this.state.checklists.length > 0
                    ? this.state.checklists.map(cs => <ChecklistSummary name = {cs.name} description = {cs.description} key = {cs.key}/>)
                    : <Text>No checklists</Text>
                }
            </ScrollView>
        );
    }
}

const homeStyles = StyleSheet.create({
    home: {
        backgroundColor: '#F5FCFF',
        position: 'absolute',
//        flex: 4
    },
    scroll: {
//        paddingVertical: 20,
        flex: 1,
    },
});