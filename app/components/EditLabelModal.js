import React, { Component } from 'react'
import { Modal, View, StyleSheet, Button, ToastAndroid, Alert } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
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
          return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={labelModalStyles.modal}>
                        <FormLabel>Name</FormLabel>
                        <FormInput onChangeText={(name) => this.updateName(name)} value={this.state.name} />
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <View style={labelModalStyles.buttonView}>
                            <View style={labelModalStyles.buttonContainer}>
                                <Button
                                    title="Back"
                                    onPress={() => this.props.toggleModal('')}
                                />
                            </View>
                            <View style={labelModalStyles.buttonContainer}>
                                <Button
                                    title="Delete"
                                    onPress={this.confirmDelete}
                                />
                            </View>
                            <View style={labelModalStyles.buttonContainer}>
                                <Button
                                    title="Save"
                                    onPress={this.saveLabel}
                                />
                            </View>
                        </View>
                    </View>
              </Modal>
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
                        firebase.database().ref('labels/' + this.props.labelKey).remove();
                        ToastAndroid.show('Label Successfully Deleted', ToastAndroid.SHORT);
                        this.props.toggleModal('');
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

const labelModalStyles = StyleSheet.create({
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
        width: '30%'
    }
});