import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import ChecklistSummary from './ChecklistSummary.js';
import DisplayCreateChecklistModal from './DisplayCreateChecklistModal.js';
import * as firebase from 'firebase';

export default class Home extends Component {

    state = {
        checklists: [],
        displayAdd: false,
        loading: true
    };

    constructor(props) {
        super(props);
        console.log('home constructed');
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('checklists/').on('value', (snapshot) =>
            {
                this.setState({
                    loading: true
                });
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
                this.setState({
                    loading: false
                });
                console.log('kvs', this.state.checklists);
            });
    }

    toggleModal() {
        this.setState({
             displayAdd: !this.state.displayAdd
        });
    }

    render() {
        /* TODO fix scroll view and loading */
        return (
            <View style={homeStyles.home}>
                <ActivityIndicator size='large' color='#cc0000' visible={this.state.loading}/>
                <DisplayCreateChecklistModal style={{flex: 1}} display = {this.state.displayAdd} toggleModal = {this.toggleModal} />
                <ScrollView contentContainerStyle={homeStyles.scroll} visible={!this.state.loading}>
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
                    onPress={this.toggleModal}
                />
            </View>
        );
    }
}

const homeStyles = StyleSheet.create({
    scroll: {
        flex: 1,
        justifyContent: 'space-between'
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
     },
     noChecklist: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
     }
});