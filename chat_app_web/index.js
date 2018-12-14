/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Chat);

import React, {Component} from 'react';



export default class Chat extends Component {
  render() {
    return (
        <App />
    );
  }
}