import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, Button, ToastAndroid, TouchableNativeFeedback, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import NewFilterModal from './NewFilterModal.js';
import EditLabelModal from './EditLabelModal.js';
import * as firebase from 'firebase';

export default class ModalView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
         return (
              <Modal transparent={true} visible={ this.props.visible } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={modalStyles.extView}>
                        <View style={modalStyles.modal}>
                            <ScrollView style={{flex: 1}}>
                                {this.props.children}
                            </ScrollView>
                            <View style={modalStyles.buttonView}>
                                {
                                    this.props.buttons.map(button => {
                                        return (
                                           <View style={modalStyles.buttonContainer}>
                                                <Button
                                                    title={button.name}
                                                    onPress={button.callback}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
              </Modal>
         )
    }
}

const modalStyles = StyleSheet.create({
    modal: {
        padding: 20,
        flexDirection: 'column',
        flex: 8,
        alignItems: 'stretch',
        width: '80%',
        backgroundColor: 'rgba(70, 70, 70, 0.95)'
    },
    extView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white'
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
    },
    buttonContainer: {
        flex: 1
    },
});