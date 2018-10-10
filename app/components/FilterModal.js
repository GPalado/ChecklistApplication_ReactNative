import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, Button, ToastAndroid, TouchableNativeFeedback } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import FilterCheckbox from './FilterCheckbox.js';
import * as firebase from 'firebase';

export default class FilterModal extends Component {

    state = {
        labels: [],
        isAll: false
    }

    constructor(props) {
        super(props);
        console.log('filter modal constructed');
        this.saveFilters = this.saveFilters.bind(this);
        this.render = this.render.bind(this);
        this.checkAll = this.checkAll.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('labels/').on('value', (snapshot) =>
             {
                 labels = snapshot.val();
                 console.log('labels snapshot', labels);
                 let labelArray = [];
                 let isAll = true;
                 Object.keys(labels).forEach((key) => {
                     if(!labels[key].active) {
                         isAll = false;
                     }
                     labelArray.push({
                         key: key,
                         name: labels[key].name,
                         active: labels[key].active
                     });
                 });

                 this.setState({
                     labels: labelArray.map(l => <FilterCheckbox name={l.name} checked={l.active} labelKey={l.key} pressed={this.checkAll} key={l.key} />),
                     isAll: isAll
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
                        <FilterCheckbox name='Check All' checked={this.state.isAll} labelKey='n/a' pressed={this.toggleAll} key='all' />
                        {
                            this.state.labels
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
        console.log("Toggle all");
//        this.setState({isAll: !this.state.isAll})
//        // TODO is this the right way to change state? Or does a new list need to be created then set...
//        this.state.labels.forEach((filterCheckbox) => {
//            filterCheckbox.setChecked(this.state.isAll);
//        });
    }

    checkAll() {
        // state is undefined?
        console.log("Checking if all");
//        let isAll = true;
//        this.state.labels.forEach((filterCheckbox) => {
//            console.log('type ', typeof(filterCheckbox));
//            if(!filterCheckbox.isChecked()) {
//                isAll = false;
//            }
//        });
//        this.setState({
//            isAll: isAll
//        });
    }

    saveFilters() {
        this.state.labels.forEach((filterCheckbox) => {
            console.log("Setting label " + filterCheckbox.getLabelKey() + " to " + filterCheckbox.isChecked());
            firebase.database().ref('labels/' + filterCheckbox.getLabelKey()).set({
                checked: filterCheckbox.isChecked()
            });
        });
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