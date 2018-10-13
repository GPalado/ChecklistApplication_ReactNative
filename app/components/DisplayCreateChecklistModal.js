import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import * as firebase from 'firebase';

export default class DisplayCreateChecklistModal extends Component {

    state = {
        name: '',
        description: '',
        errorMessage: 'This field is required',
        labels: [],
        checked: []
    }

    constructor(props) {
        super(props);
        this.saveChecklist = this.saveChecklist.bind(this);
        this.render = this.render.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
                {
                    labels = snapshot.val();
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
          return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={modalStyles.modal}>
                        <FormLabel>Name</FormLabel>
                        <FormInput onChangeText={(name) => this.updateName(name)}/>
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <FormLabel>Description</FormLabel>
                        <FormInput onChangeText={(description) => this.updateDescription(description)}/>
                        <FormLabel>Choose your labels</FormLabel>
                        <ScrollView style={{flex: 1}}>
                        {
                            this.state.labels.map(l => <FilterCheckbox name={l.name}
                                                                      checked={this.state.checked.includes(l.key)}
                                                                      labelKey={l.key}
                                                                      pressed={() => this.updateChecked(l.key)}
                                                                      key={l.key} />
                                                  )
                        }
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
                                    title="Save"
                                    onPress={this.saveChecklist}
                                />
                            </View>
                        </View>
                    </View>
              </Modal>
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
    modal: {
        padding: 20,
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