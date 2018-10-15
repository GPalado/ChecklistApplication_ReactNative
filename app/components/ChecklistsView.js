import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import ChecklistSummary from './ChecklistSummary.js';
import FilterModal from './FilterModal.js';
import DisplayCreateChecklistModal from './DisplayCreateChecklistModal.js';
import * as firebase from 'firebase';

export default class ChecklistsView extends Component {

    state = {
        checklists: [],
        displayAdd: false,
        displayFilters: false,
        loading: true,
        activeFilters: [],
        isAll: false
    };

    constructor(props) {
        super(props);
        console.log('checklist view constructed');
        this.toggleNewChecklistModal = this.toggleNewChecklistModal.bind(this);
        this.toggleFilterModal = this.toggleFilterModal.bind(this);
    }

    componentDidMount() {
        this.loadFilters();
    }

    loadFilters() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
            {
                this.setState({
                    loading: true
                });
                console.log('labels snapshot', snapshot.val());
                let newActiveFilters = [];
                let labels = snapshot.val();
                let newIsAll = true;
                if(labels){
                    Object.keys(labels).forEach((key) => {
                        if(key !== "isAll") {
                            if(labels[key].checked){
                                newActiveFilters.push(key);
                            }
                        }
                    });
                    if(labels.isAll !== undefined){
                        newIsAll = labels.isAll;
                    }
                }
                this.setState({
                    activeFilters: newActiveFilters,
                    isAll: newIsAll
                });
                this.loadChecklists(newActiveFilters, newIsAll);
            });
    }

    loadChecklists(activeFilters, isAll) {
        console.log("Loading new checklists with filters ", activeFilters, " and isAll value of ", isAll);
        firebase.database().ref('checklists/').on('value', (snapshot) =>
            {
                this.setState({
                    loading: true
                });
                console.log('checklists snapshot', snapshot.val());
                let checklists = [];
                let checklistKVs = snapshot.val();
                if(checklistKVs){
                    Object.keys(checklistKVs).forEach((key) => {
                        let clLabelKeys = [];
                        let shouldShow = false;
                        if(checklistKVs[key].labelKeys){
                            Object.keys(checklistKVs[key].labelKeys).forEach((lKey) => {
                                if(activeFilters.includes(checklistKVs[key].labelKeys[lKey])) {
                                    shouldShow = true;
                                }
                                clLabelKeys.push({
                                    key: checklistKVs[key].labelKeys[lKey]
                                });
                            });
                        }
                        if(shouldShow || isAll) { // Only show the checklists that match the filter.
                            checklists.push({
                                name: checklistKVs[key].name,
                                description: checklistKVs[key].description,
                                labelKeys: clLabelKeys,
                                key: key
                            });
                        }
                    });
                }
                this.setState({checklists});
                this.setState({
                    loading: false
                });
                console.log('updated checklists', checklists);
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
        return (
            <View style={cvStyles.home}>
                <ScrollView style={cvStyles.scroll}>
                    <DisplayCreateChecklistModal style={{flex: 1}} display = {this.state.displayAdd} toggleModal = {this.toggleNewChecklistModal} />
                    <FilterModal style={{flex: 1}} display = {this.state.displayFilters} toggleModal = {this.toggleFilterModal} />
                    {
                        (this.state.loading)
                        ?
                        <ActivityIndicator size='large' color='#cc0000' animating={this.state.loading}/>
                        : (this.state.checklists.length > 0)
                         ?
                                this.state.checklists.map(cs => <ChecklistSummary name = {cs.name} description = {cs.description} labelKeys = {cs.labelKeys} clKey={cs.key} key = {cs.key}/>)
                             : <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}>You have no checklists (check your filters)!</Text>
                    }
                </ScrollView>
                <View style={cvStyles.buttonView}>
                    <View style={cvStyles.buttonContainer}>
                        <Button
                            title='Filter Checklists'
                            onPress={this.toggleFilterModal}
                        />
                    </View>
                    <View style={cvStyles.buttonContainer}>
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

const cvStyles = StyleSheet.create({
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