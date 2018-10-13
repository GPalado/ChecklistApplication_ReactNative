import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
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
          return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={newFilterModalStyles.modal}>
                        <FormLabel>Name</FormLabel>
                        <FormInput onChangeText={(name) => this.updateName(name)}/>
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <View style={newFilterModalStyles.buttonView}>
                            <View style={newFilterModalStyles.buttonContainer}>
                                <Button
                                    title="Back"
                                    onPress={this.props.toggleModal}
                                />
                            </View>
                            <View style={newFilterModalStyles.buttonContainer}>
                                <Button
                                    title="Save"
                                    onPress={this.saveFilter}
                                />
                            </View>
                        </View>
                    </View>
              </Modal>
        )
    }

    saveFilter() {
        if (this.state.name !== '') {
            console.log('filter data', this.state);
            firebase.database().ref('labels/isAll').once('value', (snapshot) => {
                let newFilter = {
                    name: this.state.name,
                    checked: snapshot.val()
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

const newFilterModalStyles = StyleSheet.create({
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