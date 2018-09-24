import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';

export default class DisplayCreateChecklistModal extends Component {

    state = {
        name: '',
        description: ''
    }

    constructor(props) {
        super(props);
        this.saveChecklist = this.saveChecklist.bind(this);
        this.render = this.render.bind(this);
    }

    render() {
          return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={modalStyles.modal}>
                        <FormLabel>Name</FormLabel>
                        <FormInput onChangeText={(name) => this.updateName(name)}/>
                        <FormValidationMessage visible={this.state.name === ''}>{'This field is required'}</FormValidationMessage>
                        <FormLabel>Description</FormLabel>
                        <FormInput onChangeText={(description) => this.updateDescription(description)}/>
                        <Button
                            title="Save"
                            onPress={this.saveChecklist}
                        />
                    </View>
              </Modal>
        )
    }

    saveChecklist() {
        if (this.state.name !== '') {
            console.log('checklist data', this.state);
            let newChecklist = this.state;
            firebase.database().ref('checklists/').push(newChecklist)
            .then((data)=> {
                ToastAndroid.show('Checklist Successfully Created', ToastAndroid.SHORT);
                this.resetState();
                this.props.toggleModal();
            });
        }
    }

    resetState() {
        this.setState({
            name: '',
            description: ''
        });
    }

    updateName(name) {
        this.setState({name});
        console.log('Updated state ', this.state);
    }

    updateDescription(description) {
            this.setState({description});
            console.log('Updated state ', this.state);
        }
}

const modalStyles = StyleSheet.create({
    modal: {
        padding: 20
    },
});