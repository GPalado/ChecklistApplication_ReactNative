import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid, ScrollView, TouchableNativeFeedback, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import NewFilterModal from './NewFilterModal.js';
import ModalView from './ModalView.js';
import * as firebase from 'firebase';

export default class DisplayCreateChecklistModal extends Component {

    state = {
        name: '',
        description: '',
        errorMessage: 'This field is required',
        labels: [],
        checked: [],
        displayNewFilterModal: false
    }

    constructor(props) {
        super(props);
        this.saveChecklist = this.saveChecklist.bind(this);
        this.render = this.render.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.toggleNewFilterModal = this.toggleNewFilterModal.bind(this);
    }

    toggleNewFilterModal() {
        console.log('toggled new filter modal');
        this.setState({
            displayNewFilterModal: !this.state.displayNewFilterModal
        });
    }

    componentDidMount() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
                {
                    labels = snapshot.val();
                    if(labels) {
                        console.log('labels snapshot', labels);
                        let labelArray = [];
                        Object.keys(labels).forEach((key) => {
                            if(key !== "isAll") {
                                 labelArray.push({
                                     key: key,
                                     name: labels[key].name
                                 });
                            }
                        });

                        this.setState({
                            labels: labelArray,
                        });
                        console.log('filter modal state', this.state);
                    }
                });
    }

    updateChecked(labelKey) {
        console.log("updating with label key ", labelKey);
        let newChecked = this.state.checked;
        if(newChecked.includes(labelKey)) {
            newChecked.splice(newChecked.indexOf(labelKey), 1);
        } else {
            newChecked.push(labelKey);
        }
        this.setState({
            checked: newChecked
        });
    }

    render() {
        let buttons = [{name: 'Back', callback:this.props.toggleModal},{name: 'Save', callback: this.saveChecklist}];
        return (
              <ModalView buttons={buttons} display={this.props.display}>
                    <FormLabel labelStyle={modalStyles.text}>Name</FormLabel>
                    <FormInput inputStyle={modalStyles.text} onChangeText={(name) => this.updateName(name)}/>
                    <FormValidationMessage labelStyle={modalStyles.errorTextContainer}>{this.state.errorMessage}</FormValidationMessage>
                    <FormLabel labelStyle={modalStyles.text}>Description</FormLabel>
                    <FormInput inputStyle={modalStyles.text} onChangeText={(description) => this.updateDescription(description)}/>
                    <FormLabel labelStyle={modalStyles.text}>Choose your labels</FormLabel>
                    <ScrollView style={{flex: 1}}>
                    <NewFilterModal display={this.state.displayNewFilterModal} toggleModal={this.toggleNewFilterModal}/>
                    {
                        this.state.labels.map(l => <FilterCheckbox name={l.name}
                                                                  checked={this.state.checked.includes(l.key)}
                                                                  labelKey={l.key}
                                                                  pressed={() => this.updateChecked(l.key)}
                                                                  key={l.key} />
                                              )
                    }
                        <TouchableNativeFeedback style={{padding: 10}} onPress={() => this.toggleNewFilterModal()}>
                            <View style={{height: 35, backgroundColor: '#eeeeee', padding: 5}}>
                                <Text style={{fontSize: 15}}>+ Create New Label</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </ScrollView>
              </ModalView>
        )
    }

    saveChecklist() {
        if (this.state.name !== '') {
            console.log('checklist data', this.state);
            let newChecklist = {
                name: this.state.name,
                description: this.state.description
            };
            let ref = firebase.database().ref('checklists/').push(newChecklist);
            this.state.checked.forEach((label) => {
                firebase.database().ref('checklists/' + ref['key'] + '/labelKeys').push(label);
                firebase.database().ref('labels/' + label + '/checklistKeys').push(ref['key']);
            });
            ToastAndroid.show('Checklist Successfully Created', ToastAndroid.SHORT);
            this.resetState();
            this.props.toggleModal();
        }
    }

    resetState() {
        this.setState({
            name: '',
            description: ''
        });
    }

    updateName(name) {
        console.log('name', name);
        this.setState({name});
        if(name == '') {
            this.setState({
                errorMessage: 'This field is required'
            });
        } else {
            this.setState({
                errorMessage: ''
            });
        }
        console.log('Updated state ', this.state);
    }

    updateDescription(description) {
            this.setState({description});
            console.log('Updated state ', this.state);
        }
}

const modalStyles = StyleSheet.create({
    text: {
        color: 'white'
    },
    errorTextContainer: {
        color: '#eeeeee'
    }
});