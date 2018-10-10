import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import ChecklistSummary from './ChecklistSummary.js';
import DisplayCreateChecklistModal from './DisplayCreateChecklistModal.js';
import FilterModal from './FilterModal.js';
import * as firebase from 'firebase';

export default class Home extends Component {

    state = {
        checklists: [],
        displayAdd: false,
        displayFilters: false,
        loading: true
    };

    constructor(props) {
        super(props);
        console.log('home constructed');
        this.toggleNewChecklistModal = this.toggleNewChecklistModal.bind(this);
        this.toggleFilterModal = this.toggleFilterModal.bind(this);
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
                    clLabelKeys = [];
                    if(checklistKVs[key].labelKeys){
                        Object.keys(checklistKVs[key].labelKeys).forEach((lKey) => {
                            clLabelKeys.push({
                                key: checklistKVs[key].labelKeys[lKey]
                            });
                        });
                    }
                    checklists.push({
                        name: checklistKVs[key].name,
                        description: checklistKVs[key].description,
                        labelKeys: clLabelKeys,
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

    toggleNewChecklistModal() {
        console.log('toggled cl modal');
        this.setState({
             displayAdd: !this.state.displayAdd
        });
    }

    toggleFilterModal() {
        console.log('toggled filter modal');
        this.setState({
            displayFilters: !this.state.displayFilters
        });
    }

    render() {
        console.log('loading', this.state.loading);
        return (
            <View style={homeStyles.home}>
                <ScrollView style={homeStyles.scroll}>
                    <DisplayCreateChecklistModal style={{flex: 1}} display = {this.state.displayAdd} toggleModal = {this.toggleNewChecklistModal} />
                    <FilterModal style={{flex: 1}} display = {this.state.displayFilters} toggleModal = {this.toggleFilterModal} />
                    {
                        (this.state.loading)
                        ?
                        <ActivityIndicator size='large' color='#cc0000' animating={this.state.loading}/>
                        : (this.state.checklists.length > 0)
                         ?
                                this.state.checklists.map(cs => <ChecklistSummary name = {cs.name} description = {cs.description} labelKeys = {cs.labelKeys} clKey={cs.key} key = {cs.key}/>)
                             : <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}>You have no checklists!</Text>
                    }
                </ScrollView>
                <View style={homeStyles.buttonView}>
                    <View style={homeStyles.buttonContainer}>
                        <Button
                            title='Filter Checklists'
                            onPress={this.toggleFilterModal}
                        />
                    </View>
                    <View style={homeStyles.buttonContainer}>
                        <Button
                            title='New Checklist'
                            onPress={this.toggleNewChecklistModal}
                        />
                    </View>
                </View>
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
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
    },
    buttonContainer: {
        width: '45%'
    }
});