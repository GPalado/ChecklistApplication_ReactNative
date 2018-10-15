import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import ModalView from './ModalView.js';
import * as firebase from 'firebase';

export default class NewFilterModal extends Component {

    state = {
        name: '',
        errorMessage: 'This field is required'
    }

    constructor(props) {
        super(props);
        this.saveFilter = this.saveFilter.bind(this);
        this.render = this.render.bind(this);
    }

    render() {
        let buttons = [{name: 'Back', callback:this.props.toggleModal},{name: 'Save', callback: this.saveFilter}];
          return (
              <ModalView buttons={buttons} display={this.props.display}>
                    <FormLabel labelStyle={modalStyles.text}>Name</FormLabel>
                    <FormInput inputStyle={modalStyles.text} onChangeText={(name) => this.updateName(name)}/>
                    <FormValidationMessage containerStyle={modalStyles.errorTextContainer}>{this.state.errorMessage}</FormValidationMessage>
              </ModalView>
        )
    }

    saveFilter() {
        if (this.state.name !== '') {
            console.log('filter data', this.state);
            firebase.database().ref('labels/').once('value', (snapshot) => {
                let labelsData = snapshot.val();
                let isAll = true;
                if(labelsData && labelsData.isAll) {
                    isAll = labelsData.isAll;
                } else {
                    firebase.database().ref('labels/isAll').set(true);
                }
                let newFilter = {
                    name: this.state.name,
                    checked: isAll
                };
                let ref = firebase.database().ref('labels/').push(newFilter);
                ToastAndroid.show('Filter Successfully Created', ToastAndroid.SHORT);
                this.resetState();
                this.props.toggleModal();
            });
        }
    }

    resetState() {
        this.setState({
            name: '',
            errorMessage: 'This field is required'
        });
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

const modalStyles = StyleSheet.create({
    text: {
        color: 'white'
    },
    errorTextContainer: {
        color: '#eeeeee'
    }
});