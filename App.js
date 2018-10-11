import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import Home from './app/components/Home.js';
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
        <View style={appStyles.mainView}>
            <Home />
        </View>
    );
  }
}

const appStyles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
});