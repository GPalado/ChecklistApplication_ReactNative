import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';

export default class Home extends Component {

    state = {
        checklistKVs: []
    };

    constructor(props) {
        super(props);
        console.log('home constructed');
    }

    componentDidMount() {
        firebase.database().ref('checklists/').on('value', (snapshot) =>
            {
                console.log('checklists snapshot', snapshot.val());
                let data = snapshot.val();
//                let checklists = Object.values(data);
                this.setState({data});
    //            snapshot.forEach((child) => {
    //                console.log('pushing child', child);
    //                this.state.checklists.push({
    //                    name: child.val().name,
    //                    description: child.val().description,
    //                    _key: child.key
    //                });
    //            });
            });
    }

    render() {
        return (
            <View style={styles.home}>
                {
                    this.state.checklistKVs.length > 0
                    ? this.state.checklistKVs.map(cs => <ChecklistSummary name = {cs.val().name} description = {cs.val().description} key = {cs.key}/>)
                    : <Text>No checklists</Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    home: {
        backgroundColor: '#F5FCFF',
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        bottom: 0,
    }
});