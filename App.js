import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Home from './app/components/Home.js';
import Header from './app/components/Header.js';
import firebase from 'firebase';

type Props = {};
export default class App extends Component<Props> {

  constructor() {
      super();
      var config = {
          apiKey: "AIzaSyBEQtlLjIY5vndcNOl-k4P0DGJQ5Ex8Wfs",
          authDomain: "checklist-app-react.firebaseapp.com",
          databaseURL: "https://checklist-app-react.firebaseio.com",
          projectId: "checklist-app-react",
          storageBucket: "checklist-app-react.appspot.com",
          messagingSenderId: "676100704101"
       };
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
  }

  render() {
    return (
      <View style={styles.vertContainer}>
        <Header title='Home' />
        <Home />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  vertContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
