import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';

export default class DisplayCreateChecklistModal extends Component {

    state = {
        name: '',
        description: '',
        errorMessage: 'This field is required'
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
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <FormLabel>Description</FormLabel>
                        <FormInput onChangeText={(description) => this.updateDescription(description)}/>
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
        padding: 20
    },
    buttonView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: '40%',
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    }
});