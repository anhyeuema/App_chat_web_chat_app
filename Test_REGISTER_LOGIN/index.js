/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => login);


import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


export default class login extends Component {
  render() {
    return (
      <App />
    );
  }
}
