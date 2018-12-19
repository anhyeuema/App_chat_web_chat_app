
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, AsyncStorage } from 'react-native';

import saveToken from './api/saveToken';
import getToken from './api/getToken';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hoten: 'nguyenti',
      username: 'ti',
      password: '123',
      email: 'nguyenti@gmail.com',
      id: '',
      result: '',
      token: '',
      tokenNew: '',
    };
  }

  register() {
    fetch("http://192.168.0.105:81/CHAT/chatPHP/chatPHP1/DangKy.php", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        /*
        "USERNAME": this.state.username,
        "PASSWORD": this.state.password,
        */
       "USERNAME": "nhung",
       "PASSWORD": "123456",
        "HOTEN": "tran",
        "EMAIL": "nguyenhung@gmail.com",

      })
    })
      .then(res => {
        // console.log("res_____________",res._bodyInit);
        // console.log("res.json();;;;;;",res.json());
        console.log("JSON.parse(res._bodyInit)::::::", JSON.parse(res._bodyInit));
        var id1 = (JSON.parse(res._bodyInit)).id;
        this.setState({
          result: id1
        })
      })
      .catch(e => console.log(e));
  }

  dangnhapNew() { //http://192.168.0.105:81/CHAT/chatDemo/chat2/dangnhap.php //tao ra token   //Chat1/taoToken.php
    fetch("http://192.168.0.105:81/Chat1/taoToken.php", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        /*
        "USERNAME": this.state.username,
        "PASSWORD": this.state.password,
        */
       "USERNAME": "nhung",
       "PASSWORD": "123456",
      })
    })
      .then(res => {

     
        console.log('res:::::', res);
      //  console.log("res.json():::::", res._bodyText);
       // console.log("JSON.parse(res._bodyInit):::::", JSON.parse(res._bodyText));
      
       /*
       var token1New = JSON.parse(res._bodyText).tokenNew;
        var token1 = JSON.parse(res._bodyText).token;
        var id1 = JSON.parse(res._bodyText).id;
        //  console.log("JSON.parse(res._bodyInit).token:::::", (JSON.parse(res._bodyText)).token);
        this.setState({
          token: token1,
          id: id1,
          tokenNew: token1New

        });
         const token11 = this.state.token;
         const tokenNew1 = this.state.tokenNew; //token chua thoi gian o thoi han
            console.log('this.state.token dangnhapNew:::', this.state.token);
            console.log('this.state.tokenNew dangnhapNew:::', this.state.tokenNew);
          saveToken('@token',token11);
          saveToken('@tokenNew',tokenNew1);
        */
      })
      .catch(e => console.log(e));



  }

  dangnhap() { //tao ra token
    fetch("http://192.168.0.105:81/khoapham/DemoJWT/taoToken.php", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        /*
        "USERNAME": this.state.username,
        "PASSWORD": this.state.password,
        */
       "USERNAME": "nhung",
       "PASSWORD": "123456",
      })
    })
      .then(res => {
        // console.log("res.():::::", res);
        // console.log("res.json():::::", res._bodyText);
        //  console.log("JSON.parse(res._bodyInit):::::", JSON.parse(res._bodyText));
        var token1 = JSON.parse(res._bodyText).token;
        //  console.log("JSON.parse(res._bodyInit).token:::::", (JSON.parse(res._bodyText)).token);
        this.setState({
          token: token1
        });
        const token11 = this.state.token;
        //  console.log('this.state.token:::', this.state.token);
        saveToken(token11);
      })
      .catch(e => console.log(e));

   
    getToken()
      .then(tokena => console.log('token_trong_saveToken():', tokena));
  }

  checkLogin() { //dua token len de lay username ve CHAT/chatDemo/chat2/checkToken.php
    const checkTK = (token_save,TOKEN) => {
      fetch('http://192.168.0.105:81/CHAT/chatDemo/chat2/checkToken.php', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          //TOKEN tham so "TOKEN" hoac "TOKEN_NEW"
          TOKEN: token_save //this.state.token
        })
      })
        .then(user => {
          console.log(user);

        })
        .catch(e => console.log(e))
    }
    
    getToken('@token')
    .then(token_s => {
      checkTK(token_s,"TOKEN");
      console.log('token_s:::',token_s);
    })
    .catch( err => console.log(err));
    
    getToken('@tokenNew')   //checktoken co gioi han thoi gian
    .then(tokenNew_s => {
      checkTK(tokenNew_s,"TOKEN_NEW");
      console.log('tokenNEW_sSSSSS:::',tokenNew_s);
    })
    .catch( err => console.log(err));

  }

  refreshToken() { //dua token len de lay lay token moi ve
    fetch('', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "TOKEN": this.state.token,
        "TOKEN_NEW": this.state.token
      })
    })
      .then(tokenNew => {
        console.log(tokenNew);

      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    var a = JSON.stringify({
      /*
      "USERNAME": this.state.username,
      "PASSWORD": this.state.password,
      */
      "HOTEN": "nguyenteo",
      "USERNAME": "teo1",
      "PASSWORD": "1234",
      "EMAIL": "nguyenteo@gmail.com",
    });
    console.log(a);
    console.log(JSON.parse(a));
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Component app e!</Text>
        <TextInput
          onChangeText={text => this.setState({ hoten: text })}
          value={this.state.hoten}
          placeholder={'enter  your name'}
        />
        <TextInput
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
          placeholder={'you want  your username'}
        />
        <TextInput
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          placeholder={'enter your password'}
        />
        <TextInput
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
          placeholder={'enter your email'}
        />
        <TouchableOpacity onPress={() => this.register()}>
          <Text>REGISTER</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.dangnhap()}>
          <Text>DANGNHAP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.dangnhapNew()}>
          <Text>dangnhapNew</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.checkLogin()}>
          <Text>checkLogin</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.refreshToken()}>
          <Text>refreshToken</Text>
        </TouchableOpacity>



        <Text>{this.state.result}</Text>
        <Text>{this.state.token}</Text>
        <Text>{this.state.id}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
