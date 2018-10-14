import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, Button, ToastAndroid, TouchableNativeFeedback, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import NewFilterModal from './NewFilterModal.js';
import * as firebase from 'firebase';

export default class EditLabelsModal extends Component {

    constructor(props) {
        super(props);
        console.log('edit labels modal constructed with props', props);
        this.state = {
            labels: [],
            checked: [],
            displayNewFilterModal: false,
            existingLabels: props.existingLabels
        }
        this.saveLabels = this.saveLabels.bind(this);
        this.render = this.render.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.toggleNewFilterModal = this.toggleNewFilterModal.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log("next props ", nextProps, "prev state", prevState);
        if(nextProps.existingLabels !== prevState.existingLabels) {
            return {existingLabels: nextProps.existingLabels};
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("prev props ", prevProps, "prev state", prevState);
        console.log("current state", this.state);
        if(prevState.existingLabels !== this.state.existingLabels){
            let newChecked = this.state.checked;
            this.state.existingLabels.forEach((label) => {
                if(!newChecked.includes(label)) {
                   newChecked.push(label);
                }
            });
            console.log("Updating existing labels with ", newChecked);
            this.setState({
                existingLabels: this.state.existingLabels,
                checked: newChecked
            });
        }
    }

    componentDidMount() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
             {
                 labels = snapshot.val();
                 let labelArray = [];
                 let checked = [];
                 if(labels){
                     console.log('labels snapshot', labels);
                     Object.keys(labels).forEach((key) => {
                        if(key !== "isAll") {
                             if(this.state.existingLabels.includes(labels[key])) {
                                checked.push(key);
                             }
                             labelArray.push({
                                 key: key,
                                 name: labels[key].name
                             });
                         }
                     });
                 }
                 this.setState({
                     labels: labelArray,
                     checked: checked
                 });
             });
    }

    render() {
         return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={modalStyles.modal}>
                        <ScrollView style={{flex: 1}}>
                            <NewFilterModal display={this.state.displayNewFilterModal} toggleModal={this.toggleNewFilterModal}/>
                            <Text>Choose your labels:</Text>
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
                                    onPress={this.saveLabels}
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
            displayNewFilterModal: !this.state.displayNewFilterModal,
            checked: this.state.checked
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

    saveLabels() {
        ToastAndroid.show('Labels Successfully Updated', ToastAndroid.SHORT);
        this.props.updateLabelKeys(this.state.checked);
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