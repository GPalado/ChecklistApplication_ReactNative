import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid, Alert } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import ModalView from './ModalView.js';
import * as firebase from 'firebase';

export default class EditLabelModal extends Component {

    state = {
        name: '',
        checked: false,
        errorMessage: ''
    }

    constructor(props) {
        super(props);
        this.saveLabel = this.saveLabel.bind(this);
        this.render = this.render.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        console.log("Edit filter modal created with props ", props);
    }

    componentDidMount() {
        firebase.database().ref('labels/' + this.props.labelKey).once('value', (snapshot) =>
            {
                label = snapshot.val();
                console.log('label snapshot', label);

                this.setState({
                    name: label.name,
                    checked: label.checked
                });
                console.log('state', this.state);
            });
    }

    render() {
        let buttons = [{name: 'Back', callback:this.props.toggleModal('')},{name: 'Delete', callback: this.confirmDelete},{name: 'Save', callback: this.saveLabel}];
        return (
              <ModalView buttons={buttons} visible={this.props.display}>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={(name) => this.updateName(name)} value={this.state.name} />
                    <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
              </ModalView>
        )
    }

    confirmDelete() {
        Alert.alert(
            'CONFIRM',
            'Are you sure you want to delete this label?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () =>
                    {
                        console.log("Deleting label");
                        firebase.database().ref('labels/' + this.props.labelKey + '/checklistKeys').once('value', (snapshot) => {
                            console.log("Removing from checklists", snapshot.val());
                            if(snapshot.val()){
                                Object.keys(snapshot.val()).forEach((clKey) => {
                                    let checklistKey = snapshot.val()[clKey];
                                    let labelRef = '';
                                    firebase.database().ref('checklists/' + checklistKey + '/labelKeys').once('value', (snapshot) => {
                                        Object.keys(snapshot.val()).forEach((lKey) => {
                                            if(snapshot.val()[lKey] === this.props.labelKey) {
                                                labelRef = lKey;
                                            }
                                        });
                                    }).then((data) => {
                                        firebase.database().ref('checklists/' + checklistKey + '/labelKeys/' + labelRef).remove();
                                    });
                                });
                            }
                        }).then((data) => {
                            ToastAndroid.show('Label Successfully Deleted', ToastAndroid.SHORT);
                            this.props.toggleModal('');
                            this.props.updateLabelsToDelete(this.props.labelKey);
                        });
                    },
                }
            ]
        );
    }

    saveLabel() {
        if (this.state.name !== '') {
            console.log('label data', this.state);
            let ref = firebase.database().ref('labels/' + this.props.labelKey).set({
                name: this.state.name,
                checked: this.state.checked
            });
            ToastAndroid.show('Label Successfully Updated', ToastAndroid.SHORT);
            this.props.toggleModal('');
        }
    }

    updateName(name) {
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
    }
}