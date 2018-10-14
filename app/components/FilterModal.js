import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, Button, ToastAndroid, TouchableNativeFeedback, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import NewFilterModal from './NewFilterModal.js';
import EditLabelModal from './EditLabelModal.js';
import * as firebase from 'firebase';

export default class FilterModal extends Component {

    constructor(props) {
        super(props);
        console.log('filter modal constructed');
        this.state = {
            labels: [],
            isAll: false,
            checked: [],
            displayNewFilterModal: false,
            displayEditModalKey: '',
            labelsToDelete: []
        }
        this.saveFilters = this.saveFilters.bind(this);
        this.render = this.render.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.toggleNewFilterModal = this.toggleNewFilterModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.updateLabelsToDelete = this.updateLabelsToDelete.bind(this);
    }

    toggleEditModal(key) {
        if(this.state.displayEditModalKey !== key) {
            console.log("toggling edit modal with key ", key);
            this.setState({
                displayEditModalKey: key
            });
        }
    }

    updateLabelsToDelete(labelKey) {
        let newLabelsToDelete = this.state.labelsToDelete;
        let newLabels = this.state.labels;
        if(!newLabelsToDelete.includes(labelKey)) {
            newLabelsToDelete.push(labelKey);
            let labelsKey;
            Object.keys(newLabels).forEach((key) => {
                if(newLabels[key]['key'] === labelKey) {
                    console.log('match found', key);
                    newLabels.splice(key, 1);
                    this.setState({
                        labelsToDelete: newLabelsToDelete,
                        labels: newLabels
                    });
                }
            });
        }
    }

    componentDidMount() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
             {
                 labels = snapshot.val();
                 let labelArray = [];
                 let checked = [];
                 let isAll = true;
                 if(labels){
                     console.log('labels snapshot', labels);
                     Object.keys(labels).forEach((key) => {
                        if(key !== "isAll") {
                             if(labels[key].checked) {
                                checked.push(key);
                             }
                             labelArray.push({
                                 key: key,
                                 name: labels[key].name
                             });
                         }
                     });
                     if(labels.isAll) {
                         isAll = labels.isAll;
                     }
                 }

                 this.setState({
                     labels: labelArray,
                     isAll: isAll,
                     checked: checked
                 });
                 console.log('filter modal state', this.state);
             });
    }

    render() {
         return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={modalStyles.modal}>
                        <ScrollView style={{flex: 1}}>
                            <NewFilterModal display={this.state.displayNewFilterModal} toggleModal={this.toggleNewFilterModal}/>
                            <Text>Choose the labels to filter by:</Text>
                            <View style={{borderWidth: 2, borderColor: '#888888'}}>
                                <FilterCheckbox
                                    name='Show All'
                                    checked={this.state.isAll}
                                    labelKey='n/a'
                                    pressed={this.toggleAll}
                                    key='all'
                                />
                            </View>
                            {
                                this.state.labels.map(l =>
                                    <View>
                                        <FilterCheckbox
                                            name={l.name}
                                            checked={this.state.checked.includes(l.key)}
                                            labelKey={l.key}
                                            pressed={() => this.updateChecked(l.key)}
                                            key={l.key}
                                        />
                                        <TouchableNativeFeedback style={{flexDirection: 'row', height: 30, padding: 5, backgroundColor: '#eeeeee'}} onPress={() => this.toggleEditModal(l.key)}>
                                            <View style={{height: 20, padding: 5}}>
                                                <Text style={{fontSize: 10, textAlign: 'right'}}>^ Edit Label</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                        <EditLabelModal display={this.state.displayEditModalKey === l.key} labelKey={l.key} toggleModal={this.toggleEditModal} updateLabelsToDelete={this.updateLabelsToDelete} />
                                    </View>
                                )
                            }
                            <TouchableNativeFeedback style={{padding: 10}} onPress={() => this.toggleNewFilterModal()}>
                                <View style={{height: 35, backgroundColor: '#eeeeee', padding: 5}}>
                                    <Text style={{fontSize: 20}}>+ Create New Label</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </ScrollView>
                        <View style={modalStyles.buttonView}>
                            <View style={modalStyles.buttonContainer}>
                                <Button
                                    title="Back"
                                    onPress={this.props.toggleModal}
                                />
                            </View>
                            <View style={modalStyles.buttonContainer}>
                                <Button
                                    title="Done"
                                    onPress={this.saveFilters}
                                />
                            </View>
                        </View>
                    </View>
              </Modal>
         )
    }

    toggleNewFilterModal() {
        console.log('toggled new filter modal');
        this.setState({
            displayNewFilterModal: !this.state.displayNewFilterModal
        });
    }

    toggleAll() {
        console.log("Toggle all from ", this.state.isAll);
        let newChecked = [];
        let newIsAll = false;
        if(!this.state.isAll) { // new isAll = true therefore everything is checked
            newChecked = Object.keys(this.state.labels).map(key => this.state.labels[key].key);
            newIsAll = true;
        }
        this.setState({
            isAll: newIsAll,
            checked: newChecked
        });
    }

    updateChecked(labelKey) {
        console.log("Updating checked with ", labelKey);
        let checkedLabels = this.state.checked;
        if(checkedLabels.includes(labelKey)) {
            checkedLabels.splice(checkedLabels.indexOf(labelKey), 1);
        } else {
            checkedLabels.push(labelKey);
        }
        this.setState({
            checked: checkedLabels
        });
    }

    saveFilters() {
        this.state.labels.forEach((label) => {
            console.log("Setting label ", label, " to ",this.state.checked.includes(label.key));
            firebase.database().ref('labels/' + label.key + '/checked').set(this.state.checked.includes(label.key));
        });
        this.state.labelsToDelete.forEach((label) => {
            console.log("Deleting label ", label);
            firebase.database().ref('labels/' + label).remove();
        });
        firebase.database().ref('labels/isAll').set(this.state.isAll);
        ToastAndroid.show('Filters Successfully Updated', ToastAndroid.SHORT);
        this.props.toggleModal();
    }
}

const modalStyles = StyleSheet.create({
    modal: {
        padding: 20,
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