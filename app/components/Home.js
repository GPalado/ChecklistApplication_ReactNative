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
        console.log('loading', this.state.loading);
        return (
            <View style={homeStyles.home}>
                <ScrollView style={homeStyles.scroll}>
                    <DisplayCreateChecklistModal style={{flex: 1}} display = {this.state.displayAdd} toggleModal = {this.toggleModal} />
                        {
                            (this.state.loading)
                            ?
                            <ActivityIndicator size='large' color='#cc0000' animating={this.state.loading}/>
                            : (this.state.checklists.length > 0)
                             ?
                                    this.state.checklists.map(cs => <ChecklistSummary name = {cs.name} description = {cs.description} key = {cs.key}/>)
                                 : <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}>You have no checklists!</Text>
                        }
                </ScrollView>
                <Button
                    title='Create New Checklist'
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
    },
    home: {
        flexDirection: 'column',
        flex: 8,
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
     },
    addButton: {
        backgroundColor: '#cccccc',
        padding: 10,
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 300,
    }
});