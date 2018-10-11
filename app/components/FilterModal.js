import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, Button, ToastAndroid, TouchableNativeFeedback } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import * as firebase from 'firebase';

export default class FilterModal extends Component {

    constructor(props) {
        super(props);
        console.log('filter modal constructed');
        this.state = {
            labels: [],
            isAll: false,
            checked: []
        }
        this.saveFilters = this.saveFilters.bind(this);
        this.render = this.render.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
             {
                 labels = snapshot.val();
                 console.log('labels snapshot', labels);
                 let labelArray = [];
                 let checked = [];
                 Object.keys(labels).forEach((key) => {
                    if(key !== "isAll") {
                         if(labels[key].active) {
                            checked.push(key);
                         }
                         labelArray.push({
                             key: key,
                             name: labels[key].name
                         });
                     }
                 });

                 this.setState({
                     labels: labelArray,
                     isAll: labelArray.length === checked.length,
                     checked: checked
                 });
                 console.log('filter modal state', this.state);
             });
    }

    render() {
         return (
              <Modal visible={ this.props.display } animationType = "slide"
                    onRequestClose={ () => console.log('closed add')}>
                    <View style={modalStyles.modal}>
                        <Text>Choose the labels to filter by:</Text>
                        <FilterCheckbox
                            name='Show All'
                            checked={this.state.isAll}
                            labelKey='n/a'
                            pressed={this.toggleAll}
                            key='all'
                        />
                        {
                            this.state.labels.map(l =>
                                <FilterCheckbox
                                    name={l.name}
                                    checked={this.state.checked.includes(l.key)}
                                    labelKey={l.key}
                                    pressed={() => this.updateChecked(l.key)}
                                    key={l.key}
                                />
                            )
                        }
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
                                    onPress={this.saveFilters}
                                />
                            </View>
                        </View>
                    </View>
              </Modal>
         )
    }

    toggleAll() {
        console.log("Toggle all from ", this.state.isAll);
        let newChecked = [];
        let newIsAll = false;
        if(!this.state.isAll) { // new isAll = true therefore everything is checked
            newChecked = Object.keys(this.state.labels).map(key => this.state.labels[key].key);
            newIsAll = true;
        }
        this.setState({
            isAll: newIsAll,
            checked: newChecked
        });
    }

    updateChecked(labelKey) {
        console.log("Updating checked with ", labelKey);
        let checkedLabels = this.state.checked;
        if(checkedLabels.includes(labelKey)) {
            checkedLabels.splice(checkedLabels.indexOf(labelKey, 1));
        } else {
            checkedLabels.push(labelKey);
        }
        this.setState({
            checked: checkedLabels
        });
    }

    saveFilters() {
        this.state.labels.forEach((label) => {
            console.log("Setting label ", label, " to ",this.state.checked.includes(label.key));
            firebase.database().ref('labels/' + label.key).set({
                name: label.name,
                checked: this.state.checked.includes(label.key)
            });
        });
        firebase.database().ref('labels/isAll').set(this.state.isAll);
        ToastAndroid.show('Filters Successfully Updated', ToastAndroid.SHORT);
        this.props.toggleModal();
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