import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import ChecklistSummary from './ChecklistSummary.js';
import DisplayCreateChecklistModal from './DisplayCreateChecklistModal.js';
import * as firebase from 'firebase';

export default class Home extends Component {

    state = {
        checklists: [],
        displayAdd: false
    };

    constructor(props) {
        super(props);
        console.log('home constructed');
        this.triggerModal = this.triggerModal.bind(this);
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

    triggerModal() {
        this.setState({
             displayAdd: true
        });
    }

    render() {
        console.log('viewing modal', this.state.displayAdd);
        return (
            <View style={homeStyles.home}>
                <DisplayCreateChecklistModal style={{flex: 1}} display = {this.state.displayAdd}/>
                <ScrollView contentContainerStyle={homeStyles.scroll}>
                    {
                        (this.state.checklists.length > 0)
                        ? this.state.checklists.map(cs => <ChecklistSummary name = {cs.name} description = {cs.description} key = {cs.key}/>)
                        : <Text>No checklists</Text>
                    }
                </ScrollView>
                <Button
                    title='Add Button'
                    icon={<Icon name='circle-with-plus'/>}
                    style={homeStyles.addButton}
                    onPress={this.triggerModal}
                />
            </View>
        );
    }
}

const homeStyles = StyleSheet.create({
    scroll: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
    },
    home: {
        flexDirection: 'column',
        flex: 8,
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
     },
     addButton: {
        position: 'relative',
        backgroundColor: '#cc0000',
        right: 10,
        bottom: 10
     }
});