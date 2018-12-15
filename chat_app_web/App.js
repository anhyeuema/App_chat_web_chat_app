

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ListView, TextInput, RefreshControl, Image, Alert } from 'react-native';
import RNFS from 'react-native-fs'; // yarn add react-native-fs //react-native link react-native-fs
//import RNFU from 'react-native-file-utils'; //yarn add react-native-file-utils //react-native link react-native-file-utils

import Buffer1 from 'buffer';

import RNFetchBlob from 'react-native-fetch-blob'; // yarn add react-native-fetch-blob // react-native link

import readfile from './api/readfile';
import writefile from './api/writefile';

//import {NativeModules} from 'react-native-image-to-base64'; //khong dung dc cai module nay la loi //yarn add react-native-image-to-base64//react-native link react-native-image-to-base64

import convert_base64 from './api/convert_base64';

var imageUri = 'https://scontent.fhph1-2.fna.fbcdn.net/v/t1.0-9/44520843_485296875299720_1912025062567837696_n.jpg?_nc_cat=103&_nc_ht=scontent.fhph1-2.fna&oh=43d6dae7a092ec5ab3391ea038be9e2b&oe=5CA415B6';


import io from 'socket.io-client/dist/socket.io.js';//yarn add react-native-socket.io-client// yarn add socket.io-client


import nhanDulieu from './api/nhanDulieu';
import global from './api/global';
var url = 'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
//var url ='';
var dataJsonImage = new Buffer1.Buffer(url).toJSON(); //tu buffer chuyen toJSON

var mmm = '';


var e;
var DATA = [
  { Ten: 'Mr.hoang', tuoi: '30' },
  { Ten: 'Mr.nhung', tuoi: '58' },
  { Ten: 'Mr.anh', tuoi: '20' },
  { Ten: 'Mr.yen', tuoi: '30' },
];

//import showImage_Picker = from '../api/showImage_Picker.js';
//import uploadToServerNodejs from '../api/uploadToServerNodejs.js';

import ImagePicker from 'react-native-image-picker';//yarn add react-native-image-picker// react-native link react-native-image-picker

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class App extends Component {

  constructor(props) {
    super(props);
    e = this;
    this.socket = io('http://192.168.0.101:2500', { jsonp: false });
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      timePassed: false,
      dataSource: ds.cloneWithRows(DATA),
      resDATA: [],
      maunen: 'bue',
      dataJson: 'red',
      text: 'red',
      send: 'anh yeu em',
      refreshing: false,
      page: 1,

      receivetestbase64: null,
      receiveAvatabase64: null,
      convertJsonToBase64: null, //bien de hung chuyen tu dataImageJson dang BASE64
      testBase64: null,

      imaWebRecivecerNEW: null,

      avatarTestHienThi_react_native: null,
      avatarSource: null,
      avatarBase64: [], //dulieu kieu base64
      data: null,

      textNew: '111111',
      id: '',

      TestdataServer: [],
      noidungemit: [],

      dataImageJson: [], // bien nay co the trung ten voi bien dataImageJson ma ben sever gui sang
      imageNewJson: [],  //bien nay co the khac ten voi bien dataImageJson ma ben sever gui sang

      Message: '',
      username: '',



      // dataClient: [],
      // dataServer: [],
      //  dataJsonC: [],
      //  dataJsonC: [],
      // dataJsonImageC: [],
      // jsonServer: [],

    };

    /*
    global.noidungEmit = this.noidungEmit.bind(this);;
    global.jsonServer = this.dataJsonImageC.bind(this);
    blobal.id = this.id;
 
    global.dataServer = this.dataServer.bind(this);
    global.dataClient = this.dataClient.bind(this);
    global.dataJsonC = this.dataJsonC.bind(this);
    global.dataJsonImageC = this.dataJsonImageC.bind(this);
 
 
    
    this.socket.on('server-send-data', async (data) => {
      nhanDulieu(data)
        .then(response => {
          console.log(response);
        })
        .catch(er => console.log(er));
    });
    */

    this.socket.on('web-send-image', (imaWebRecivecer) => { //imgae base nhan duoc tu web send ve
      console.log('imageWebBase64::::', imaWebRecivecer.imageWebBase64);
      var imaWebRecivecerNEW_A = { uri: 'data:image/jpeg;base64,' + imaWebRecivecer.imageWebBase64 }
      console.log('this.state.receivetestbase64::::', imaWebRecivecerNEW_A);
      e.setState({
        imaWebRecivecerNEW: imaWebRecivecerNEW_A,
      });
      var imaWebRecivecerNEW_AA= this.state.imaWebRecivecerNEW;
      console.log('this.state.receivetestbase64::::', imaWebRecivecerNEW_AA);

      
      var res = {
        imaWebRecivecerNEW_1: imaWebRecivecerNEW_AA,
      };
      console.log('res1::::::', res);
      e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
        //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
        dataSource: ds.cloneWithRows(res),
        resDATA: res, //setState lai resData de trong Component App.js nay goi resData moi 
        // everrywhere cho nao as cau lenh : this.state.resData
      });
      
     
    });

    this.socket.on('server-send-message', async (UserMess) => {
      console.log('UserMess::::', UserMess);
      await e.setState({
        Message: UserMess.ms,
        username: UserMess.un,
      });
    });

    this.socket.on('server-send-baser64', async (datab64) => { //lang nghe testSendBase64
      console.log('datab64::::::', datab64);
      console.log('app nhan base64 len server node:');
      var receivetestbase64_A = await { uri: 'data:image/jpg;base64,' + datab64.data };
      console.log('receivetestbase64_A:::::::', receivetestbase64_A);
      await e.setState({
        receivetestbase64: receivetestbase64_A,
      });
      console.log('this.state.receivetestbase64::::', this.state.receivetestbase64);
      var res = await {
        id1: this.state.id,
        receivetestbase64_1: this.state.receivetestbase64,
      };
      console.log('res1::::::', res);
      await e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
        //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
        dataSource: ds.cloneWithRows(res),
        resDATA: res, //setState lai resData de trong Component App.js nay goi resData moi 
        // everrywhere cho nao as cau lenh : this.state.resData
      });
      console.log('resDATA::::::', this.state.resDATA);
      console.log('dataSource::::::', this.state.dataSource);

    });


    this.socket.on('ImagePicker-server-send-base64', async (avataBas) => { //lang nghe emitBaseImageFromshowImage_image_picker
      console.log('datab64::::::', avataBas);
      var receiveAvatabase64_A = await { uri: 'data:image/jpeg;base64,' + avataBas };
      await e.setState({
        receiveAvatabase64: receiveAvatabase64_A,
      });
      console.log('this.state.receiveAvatabase64', this.state.receiveAvatabase64);

      var res = await {
        id1: this.state.id,
        receiveAvatabase64_1: this.state.receiveAvatabase64,
      };
      console.log('res1::::::', res);
      await e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
        //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
        dataSource: ds.cloneWithRows(res),
        resDATA: res, //setState lai resData de trong Component App.js nay goi resData moi 
        // everrywhere cho nao as cau lenh : this.state.resData
      });
      console.log('resDATA::::::', this.state.resDATA);
      console.log('dataSource::::::', this.state.dataSource);

    });

    this.socket.on('server-send-data', async (data) => { //lang nghe url
      //  console.log('data::::::::::', data);
      const nhanDulieu = async (data) => {
        try {
          await e.setState({
            noidungEmit: data.noidungEmit,
            TestdataServer: data.dataServer,
          });
          await this.state.noidungEmit.map(async (a) => { //jsonServer //jsonServer dang base64 do ta da chuyen 
            const base64Server1 = await Buffer1.Buffer(a.jsonServer).toString('base64'); //json consvert base64
            const convertJsonToBase64_A = await { uri: 'data:image/png;base64,' + a.jsonServer };
            e.setState({
              id: a.id,
              convertJsonToBase64: convertJsonToBase64_A,
            });
          }); //ham map.e de lay phan tutrong mang vi du 


          //   console.log('dataServer:::::', this.state.TestdataServer);
          //   console.log('this.state.TestdataServer.dataJsonC:::::', this.state.TestdataServer.dataJsonC);
          //   console.log('this.state.TestdataServer.dataJsonImageC:::::', this.state.TestdataServer.dataJsonImageC);
          const dataJsonC1 = await this.state.TestdataServer.dataJsonC;
          const buffertext = await Buffer1.Buffer(dataJsonC1); //data nhan duoc la json ta chuyen ve buffer 
          const tostringtext = await buffertext.toString(); // sau chuyen buffer ve chuoi tostring
          //    console.log('tostringtext:::::::::', tostringtext);
          const dataJsonImageC1 = await this.state.TestdataServer.dataJsonImageC; //base64 chuyen duoc ham khong can chuyen json ma tu base64 cung chuyen duoc
          const dataBase64 = await Buffer1.Buffer(dataJsonImageC1).toString('base64'); //json consvert base64
          //      console.log('dataBase64:::::::::', dataBase64);
          var testBase64_A = await { uri: 'data:image/jpeg;base64,' + dataJsonImageC1 };
          await e.setState({
            textNew: tostringtext,
            testBase64: testBase64_A,
          });

          /*
          setInterval(() => {
            console.log('this.state.convertJsonToBase64:::::', this.state.convertJsonToBase64);
          }, 100);
          */

          /*
          setTimeout(() => {
            this.setState({
              timePassed: true
            });
            console.log('this.state.convertJsonToBase64:::::', this.state.convertJsonToBase64);
            console.log('this.state.testBase64:::::', this.state.testBase64);
          }, 10000);
          */
          //      console.log('this.state.convertJsonToBase64:::::', this.state.convertJsonToBase64);


          // var res = await { textNew_1: this.state.textNew, id1: this.state.id, testBase64_1: this.state.testBase64, convertJsonToBase64_1: this.state.convertJsonToBase64 };
          //    console.log('res;:::::', await res);

          var res = await {
            textNew_1: this.state.textNew,
            id1: this.state.id,
            testBase64_1: this.state.testBase64,
            convertJsonToBase64_1: this.state.convertJsonToBase64,
          };
          console.log('res1::::::', res);
          await e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
            //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
            dataSource: ds.cloneWithRows(res),
            resDATA: res, //setState lai resData de trong Component App.js nay goi resData moi 
            // everrywhere cho nao as cau lenh : this.state.resData
          });
          console.log('resDATA::::::', this.state.resDATA);
          console.log('dataSource::::::', this.state.dataSource);

          return res;
        } catch (err) {
          return err;
        }
      };


      nhanDulieu(data)
        .then(response => {
          console.log(response);

        })
        .catch(er => console.log(er));

      writefile('cong.png', '${this.state.convertJsonToBase64}', 'base64');
      readfile('cong.png', 'base64')
        .then(res => {
          console.log('docfile:::', res);
          var stringJSON = new Buffer1.Buffer(res).toJSON(); //buffer convert json
          console.log(stringJSON); //
        })
        .catch(e => console.log(e));



      /*
      setInterval(() => {
       
      }, 5000);
      */
    });

    /*
    var res1 = {
      textNew_1: this.state.textNew,
      id1: this.state.id,
      testBase64_1: this.state.testBase64,
      convertJsonToBase64_1: this.state.convertJsonToBase64,
      receivetestbase64_1: this.state.receivetestbase64,
      receiveAvatabase64_1: this.state.receiveAvatabase64,
    };
    console.log('res1saunay::::::', res1);
    e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
      //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
      dataSource: ds.cloneWithRows(res1),
      resDATA: res1, //setState lai resData de trong Component App.js nay goi resData moi 
      // everrywhere cho nao as cau lenh : this.state.resData
    });
    console.log('resDATA::::::', this.state.resDATA);
    console.log('dataSource::::::', this.state.dataSource);
    */

  }

  test_GUI_HINH_BASE64_TU_APP__LEN_WEB__VE_NODEJS() {
    console.log(' da nhan vao text this.state.receivetestbase64::::');
    console.log('this.state.receivetestbase64::::', this.state.receivetestbase64);

  }

  componentDidMount() {

    fetch('http://192.168.0.101:2500/data', {
      method: 'POST',
      body: JSON.stringify({
        Username: 'teo_em',
        Password: '123456'
      })
    }).then(res => {
      console.log(":::username-paswword");
      console.log(":::username-paswword", res);
    })
      .catch(e => console.log(e));

    fetch('http://192.168.0.101:7777', { //webserver tren nodejs tai file index.js // C:\Users\VS9 X64Bit\AppData\Roaming\npm\Bai_Hoc_a\test\testImage\SERVER1
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    })
      .then(res => {
        console.log('res:::;ho_ten_cua_user_name', res);
        console.log('res.headers:::::', res.headers);
        console.log('res.url:::::', res.url);
        console.log('res._bodyInit:::::', res._bodyInit);
        console.log('res._bodyText:::::', res._bodyText);
        console.log('res._bodyText.username:::::', (JSON.parse(res._bodyText)).username); //ban dau la stringify lay tu webserver node ve thi phai chuyen thanh JSON.parse(..)
        //  var json = JSON.pare(res);
        //  console.log('json::::', json);
        (JSON.parse(res._bodyText)).username.map(e => { console.log('ho;;::::', e.ho); });
      })
      .catch(e => console.log(e));


  }

  testSendBase64() {
    RNFetchBlob.fetch('GET', 'http://192.168.0.101:81/api/images/product/56.jpg', {
      Authorization: 'Bearer access-token...',
      // more headers  ..
    })
      // when response status code is 200
      .then((res) => { //res la du lieu rea ve khi len http://192.168.0.101:81/api/images/product/56.jpg lay du lieu
        // tra ve res thi la nhieu gia tri : res{...,data: 'dulieu-kieu-base64'}
        console.log('res:::::2223333333333333333', res);
        // the conversion is done in native code
        // let base64Str = res.base64()
        // the following conversions are done in js, it's SYNC
        // let text = res.text()
        // let json = res.json()app-client-send-base64
        this.socket.emit('app-client-send-base64', res); //res.data de lay Basee64 trong res
        console.log('dang send base64 len server node:');

      })
      // Status code is not 200
      .catch((errorMessage, statusCode) => {
        // error handling
      });
  }


  sendEmit() {

    var text2 = this.state.send;
    var bytes2 = Buffer1.Buffer(text2);
    var dataJson = bytes2.toJSON();// tu json truyen buffer roi moi chuyen toString duoc
    //this.setState({ send: jsoon});
    //  var dataJsonImage = new Buffer1.Buffer(url).toJSON();
    this.socket.emit('client-send-data', { dataJsonC: dataJson, dataJsonImageC: url });
    console.log('client dang send data');

  }

  /*
    showImage_picker1() {
      showImage_Picker(callback(source_1,dataBase64_1) =>{
          e.setState({
            avatarBase64: dataBase64_1,
            source_1: source
          });
      })
        .then(res => console.log(res))
        .catch(er => console.log(er) );
    }
  */

  showImage_Picker1() {
    ImagePicker.showImagePicker(options, (response) => { //se chuyen image thanh response{..,data: 'base64'} 
      //de lay duoc 
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        const avatarTestHienThi_react_native = { uri: 'data:image/jpeg;base64,' + response.data };
        // You can also display the image using data:
        console.log('response.data', response.data);// response.data la base64
        //const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log('response.uri', response.uri);//response.uri la duong dan file tai 'file://mnt/sdcard/Pictures/images/ten_anh.jpg
        console.log('avatarTestHienThi_react_native::::', avatarTestHienThi_react_native);

        this.setState({ // avatarSource co gia tri moi la source, la nhug gi da duoc chon tu chup hoac thu vien
          avatarSource: source, //const source = { uri: response.uri }; la duong dan y ma
          avatarBase64: response.data, // response.data la base64
          avatarTestHienThi_react_native: avatarTestHienThi_react_native,
        });

        //bay gio ta goi this.state.avatarSource o bat cu cho nao trong componet App.js thi
        // gia tri this.state.avatarSource = gia tri la:response.data gia tri lay 
        //tai this.setSate({ avatarSource1: response.data, })
        //this.socket.enit('app-client-send-data',this.state.avatarSource)
      }
    });
  }

  emitBaseImageFromshowImage_image_picker() {
    this.socket.emit('ImagePicker-app-client-send-base64', this.state.avatarBase64);
    console.log('dang gui BaseImageFromshowImage_image-picker ', this.state.avatarBase64);

  }
  /*
  uploadToServerNodejs1() {
    uploadToServerNodejs([
      // element with property `filename` will be transformed into `file` in form data
      { name: 'avatar', filename: 'avatar.png', data: this.state.avatarBase64 },
      // custom content type
  //    { name: 'avatar-png', filename: 'avatar-png.png', type: 'image/png', data: this.state.avatarBase64 },
      // part file from storage
    //  { name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo', data: RNFetchBlob.wrap(path_to_a_file) },
      // elements without property `filename` will be sent as plain text
      { name: 'name', data: 'user' },
      {
        name: 'info', data: JSON.stringify({
          mail: 'example@example.com',
          tel: '12345678'
        })
      },
    ])
    .then(res => console.log(res))
    .catch(er => console.log(er));
  }
    */

  uploadToServerNodejs1() {
    //socket io  khai bao o port 2500, http://192.168.0.101:5000 ma ta chi
    //upload len server port 5000 chu khong emit len server nen khong ca dung port 5000
    RNFetchBlob.fetch('POST', 'http://192.168.0.101:5000/fetchblob', {//port len servert nodejs toi port 5000
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        // element with property `filename` will be transformed into `file` in form data
        { name: 'avatar', filename: 'avatar.png', data: this.state.avatarBase64 },
        // custom content type
        //    { name: 'avatar-png', filename: 'avatar-png.png', type: 'image/png', data: this.state.avatarBase64 },
        // part file from storage
        //  { name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo', data: RNFetchBlob.wrap(path_to_a_file) },
        // elements without property `filename` will be sent as plain text
        { name: 'name', data: 'user' },
        {
          name: 'info', data: JSON.stringify({
            mail: 'example@example.com',
            tel: '12345678'
          })
        },
      ]).then((resp) => {
        console.log(resp);
      }).catch((err) => {
        console.log('err________loi post upload');
      });
  }

  taoHang(property) { //cung nhu ham map thay property = e trong ham map  va dataSource: ds.cloneWithRows(resData);
    //ma resData : res ,duoc setState in ham lang nghe socket.on 
    // ma res=receiveAvatabase64_1 = { uri: 'data:image/jpeg;base64,' + avataBas}; da chua URI: 'data:image/jpeg;base64,' + avataBas
    this.arr = property;
    var receivetestbase64_1_Icon = property.receivetestbase64_1; //lay duoc o componentDidMount fetch...
    var receiveAvatabase64_1_Icon = property.receiveAvatabase64_1; //;lay o ham showImagePicker
    var base64Icon = property.convertJsonToBase64_1; // lay dulieu tu server nodejs dung readFile(__dirname+..)
    console.log('base64Icon::::::::::::::', base64Icon);

    var testBase64Icon = property.testBase64_1; //
    return (
      <View style={{ flex: 1, backgroundColor: '#40AEE5' }} >
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#3962FB' }} >

          <Image
            style={{ width: 50, height: 50 }}
            source={receiveAvatabase64_1_Icon}
          />
          <Image
            style={{ width: 50, height: 50 }}
            source={receivetestbase64_1_Icon}
          />

          <Image
            style={{ width: 50, height: 50 }}
            source={testBase64Icon}
          />

          <Image
            style={{ width: 50, height: 50 }}
            source={base64Icon}
          />

        </View >
        <View style={{ flex: 2, backgroundColor: '#0A2B55', flexDirection: 'row' }}>
          <Text key={property.id1}>{property.tuoi}</Text>
          <Text key={property.id1}>{property.Ten}</Text>
          <Text key={property.id1}>{property.text1}</Text>
          <Text key={property.id1}>{property.textNew_1}</Text>
          <Text key={property.id1}>{console.log(property.textNew_1)}</Text>
          <Text key={property.id1}>{console.log(property.convertJsonToBase64_1)}</Text>
          <Text key={property.id1}>{console.log(testBase64Icon)}</Text>
          <Text key={property.id1}>{console.log(property.testBase64_1)}</Text>
        </View>
      </View>
    );
  }

  render() {



    const ima = this.state.avatarSource = null ? null :
      <Image source={this.state.avatarSource} style={{ width: 150, height: 150 }} />

    const imageTest_HIEN_THI_IMAGE_REACT_NATIVE = this.state.avatarTestHienThi_react_native = null ? null :
      <Image source={this.state.avatarTestHienThi_react_native} style={{ width: 100, height: 100 }} />


    const receivetestbase64_1_Icon_A = this.state.receivetestbase64 = null ? null :
      <Image source={this.state.receivetestbase64_1_Icon} style={{ width: 100, height: 100 }} />

    const receiveAvatabase64_1_Icon_A = this.state.receiveAvatabase64 = null ? null :
      <Image source={this.state.receiveAvatabase64_1_Icon} style={{ width: 100, height: 100 }} />

    const base64Icon_A = this.state.convertJsonToBase64 = null ? null :
      <Image source={this.state.base64Icon} style={{ width: 100, height: 100 }} />

    const testBase64Icon_A = this.state.testBase64 = null ? null :
      <Image source={this.state.testBase64} style={{ width: 100, height: 100 }} />

    const imaWebRecivecerNEW_A = this.state.imaWebRecivecerNEW = null ? null :
      <Image source={this.state.imaWebRecivecerNEW} style={{ width: 100, height: 100 }} />
    return (
      <View style={{ flex: 1, backgroundColor: '#7C7CA8' }}>

        <View style={{ flex: 1 }}>
          <Text>Component App</Text>
          <TouchableOpacity onPress={() => this.sendEmit()}>
            <Text> send </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.testSendBase64()}>
            <Text> send test base64 to app web </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.uploadToServerNodejs1()}>
            <Text>uploadToServerNodejs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.showImage_Picker1() }}>
            <Text>showImage Picker</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.emitBaseImageFromshowImage_image_picker() }} >
            <Text>emitBaseImageFromshowImage_image_picker</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.test_GUI_HINH_BASE64_TU_APP__LEN_WEB__VE_NODEJS() }} >
            <Text>test_GUI_HINH_BASE64_TU_APP__LEN_WEB__VE_NODEJS</Text>
          </TouchableOpacity>

        </View>

        <View style={{ flex: 6 }}>
          <Text>{this.state.username + ':'} {this.state.Message}</Text>
      
            {receivetestbase64_1_Icon_A}
            {receiveAvatabase64_1_Icon_A}
            {base64Icon_A}
            {testBase64Icon_A}
            {imaWebRecivecerNEW_A}
            <Image
              style={{ width: 50, height: 51, resizeMode: 'contain', }}
              source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==', }}
            />
       

  
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.taoHang}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => {
                    this.setState({ refreshing: true });
                    const newpage = this.state.page + 1;
                    this.taoHang(property, newpage)
                      .then(() => {
                        this.arr = property.concat(this.arr);
                        this.setState({
                          dataSource: ds.cloneWithRows(this.state.resDATA),
                          refreshing: false,
                        })
                      }
                      )
                      .catch(e => console.log(e));
                  }}
                />
              }
            />

            {ima}
            {imageTest_HIEN_THI_IMAGE_REACT_NATIVE}

            { /*<Image source={require('./public/chim.png')} style={{ width: 300, height: 100 }} /> */}


        </View>


      </View>
    );
  }
}
/*
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
    */

/*
  var receivetestbase64_1_Icon = { uri: 'data:image/jpg;base64,' + this.state.receivetestbase64 }; //lay duoc o componentDidMount fetch...
    var receiveAvatabase64_1_Icon = { uri: 'data:image/jpeg;base64,' + this.state.receiveAvatabase64 }; //;lay o ham showImagePicker
    var base64Icon = { uri: 'data:image/jpeg;base64,' + this.state.convertJsonToBase64 }; // lay dulieu tu server nodejs dung readFile(__dirname+..)
    var testBase64Icon = { uri: 'data:image/jpeg;base64,' + this.state.testBase64 }; //
    e.setState({
      receivetestbase64_1_Icon: receivetestbase64_1_Icon,
      receiveAvatabase64_1_Icon: receiveAvatabase64_1_Icon,
      base64Icon: base64Icon,
      testBase64Icon: testBase64Icon,
    });
*/
/*
 console.log('this.state.receivetestbase64::::', this.state.receivetestbase64);
    console.log('this.state.receiveAvatabase64', this.state.receiveAvatabase64);
    
    var res1 = {
      textNew_1: this.state.textNew,
      id1: this.state.id,
      testBase64_1: this.state.testBase64,
      convertJsonToBase64_1: this.state.convertJsonToBase64,
      receivetestbase64_1: this.state.receivetestbase64,
      receiveAvatabase64_1: this.state.receiveAvatabase64,
    };
    console.log('res1::::::', res1);
    e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
      //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
      dataSource: ds.cloneWithRows(res1),
      resDATA: res1, //setState lai resData de trong Component App.js nay goi resData moi 
      // everrywhere cho nao as cau lenh : this.state.resData
    });
    console.log('resDATA::::::', this.state.resDATA);
    console.log('dataSource::::::', this.state.dataSource);
*/

/*

    console.log('this.state.receivetestbase64::::', this.state.receivetestbase64);
    console.log('this.state.receiveAvatabase64', this.state.receiveAvatabase64);
    var res1 = {
      textNew_1: this.state.textNew,
      id1: this.state.id,
      testBase64_1: this.state.testBase64,
      convertJsonToBase64_1: this.state.convertJsonToBase64,
      receivetestbase64_1: this.state.receivetestbase64,
      receiveAvatabase64_1: this.state.receiveAvatabase64,
    };
    e.setState({ //can setState lai mang resDATA trong ds.cloneWithRows(resDATA),  
      //con trong ListView se setState lai : dataSource: ds.cloneWithRows(resDATA),
      resDATA: res1, //setState lai resData de trong Component App.js nay goi resData moi 
      // everrywhere cho nao as cau lenh : this.state.resData
    });
    console.log('resDATA::::::', this.state.resDATA);
*/

/*
 showImage() {
    ImagePicker.showImagePicker(options, (response) => { //se chuyen image thanh response{..,data: 'base64'} 
    //de lay duoc 
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        console.log('response.data', response.data);// response.data la base64
        //const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log('response.uri', response.uri);//response.uri la duong dan file tai 'file://mnt/sdcard/Pictures/images/ten_anh.jpg
        this.setState({ // avatarSource co gia tri moi la source, la nhug gi da duoc chon tu chup hoac thu vien
          avatarSource: source, //const source = { uri: response.uri }; la duong dan y ma
          avatarBase64: response.data, // response.data la base64
        });

        //bay gio ta goi this.state.avatarSource o bat cu cho nao trong componet App.js thi
        // gia tri this.state.avatarSource = gia tri la:response.data gia tri lay 
        //tai this.setSate({ avatarSource1: response.data, })
        //this.socket.enit('app-client-send-data',this.state.avatarSource)
      }
    });
  }

  emitBaseImageFromshowImage_image_picker(){
    this.socket.emit('ImagePicker-app-client-send-base64',this.state.avatarBase64);
    console.log('dang gui BaseImageFromshowImage_image-picker ',this.state.avatarBase64);
    
  }
  uploadToServerNodejs() { 
    //socket io  khai bao o port 2500, http://192.168.0.101:5000 ma ta chi
    //upload len server port 5000 chu khong emit len server nen khong ca dung port 5000
    RNFetchBlob.fetch('POST', 'http://192.168.0.101:5000', {//port len servert nodejs toi port 5000
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        // element with property `filename` will be transformed into `file` in form data
    //    { name: 'avatar', filename: 'avatar.png', data: this.state.avatarBase64 },
        // custom content type
    //    { name: 'avatar-png', filename: 'avatar-png.png', type: 'image/png', data: this.state.avatarBase64 },
        // part file from storage
      //  { name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo', data: RNFetchBlob.wrap(path_to_a_file) },
        // elements without property `filename` will be sent as plain text
        { name: 'name', data: 'user' },
        {
          name: 'info', data: JSON.stringify({
            mail: 'example@example.com',
            tel: '12345678'
          })
        },
      ]).then((resp) => {
        console.log(resp);
      }).catch((err) => {
        console.log('err________loi post upload');
      });
  }
*/
/*
  componentDidMount() {

    const logoutJSX = (
      <View>
        <Image source={{ uri: 'data:image/png,base64' + data }} />

      </View>
    );

  
  }
*/

/*

  sendEmit() {
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
    var text2 = this.state.send;
    var bytes2 = Buffer1.Buffer(text2);
    var dataJson = bytes2.toJSON();// tu json truyen buffer roi moi chuyen toString duoc
    //this.setState({ send: jsoon});
    //  var dataJsonImage = new Buffer1.Buffer(url).toJSON();
   this.socket.emit('client-send-data', { dataJsonC: dataJson, dataJsonImageC: url });


{
    var stream = ss.createStream();
    var filename = '1.jpg';

    ss(this.socket).emit('client-send-data', stream, { name: filename });
    //  RNFetchBlob.fs.readStream(filename).pipe(stream);
}

    
    {
        // var writeStream = RNFetchBlob.fs.writeStream('1.jpg');
        //   var readStream = RNFetchBlob.fs.readStream('1.jpg');
        readStream.on('data', function (chunk) {
          var buffer = writeStream.write(chunk); // return false nếu buffer full.
          if (!buffer) readStream.pause();
        });
    
        writeStream.on('drain', function () {
          readStream.resume();
        });
      } 

    // readStream.pipe(writeStream);
    //  RNFetchBlob.fs.readStream(filename).pipe(stream);
    // this.socket.emit('client-send-data', { dataJsonC: dataJson, dataJsonImageC: url });


  }
*/

/*
  RNFetchBlob.fs.writeStream(
    './files/a.png',
    // encoding, should be one of `base64`, `utf8`, `ascii`
    'base64',
    // should data append to existing content ?
    true)
    .then((ofstream) => {
      ofstream.write('foo');
      ofstream.write('bar');
      ofstream.close();
    });

  let data = '';
  RNFetchBlob.fs.readStream(
    // file path
    RNFetchBlob.wrap( '/files/1.jpg'),
    // encoding, should be one of `base64`, `utf8`, `ascii`
    'base64',
    // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
    // when reading file in BASE64 encoding, buffer size must be multiples of 3.
    4095)
    .then((ifstream) => {
      ifstream.open();
      ifstream.onData((chunk) => {
        // when encoding is `ascii`, chunk will be an array contains numbers
        // otherwise it will be a string
        data += chunk;
        console.log(chunk);
      });
      ifstream.onError((err) => {
        console.log('oops', err)
      });
      ifstream.onEnd(() => {
        <Image source={{ uri: 'data:image/png,base64' + data }} />
      });
    });
    */

/*
 componentDidMount() {
   RNFetchBlob.fetch('GET', 'http://192.168.0.101:81/api/images/product/56.jpg', {
     Authorization: 'Bearer access-token...',
     // more headers  ..
   })
     // when response status code is 200
     .then((res) => {
       console.log(res);
       // the conversion is done in native code
       let base64Str = res.base64()
       // the following conversions are done in js, it's SYNC
       console.log(base64Str);
       /*
       let text = res.text()
       let json = res.json()
       */

/*
})
// Status code is not 200
.catch((errorMessage, statusCode) => {
// error handling
})
}
*/

{/*

  componentDidMount() {



    convert_base64();


    

    /* khong duoc
  //  file: ///Users/VS9 X64Bit/AppData/Roaming/npm/Bai_Hoc_a/test/testImage/bufferImage1/1.jpg
  //file:///storage/emulated/0/DCIM/IMG_20171206_104414.jpg
  //  RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + 'test.text', 'base64')
  RNFS.readFile(RNFS.DocumentDirectoryPath + './files/1.jpg', 'base64')
    .then(res => {
      console.log('ressssss:::::', res);
    })
    .catch(e => {
      console.log('eeeeeee:::::');
      console.log(e);
    });
    */



  /*duoc
  var url = 'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
  writefile('cong.png',url,'base64' );
  readfile('cong.png','base64')
  .then(res => {
    console.log('docfile:::',res);
    var stringJSON = new Buffer1.Buffer(res).toJSON();
    console.log(stringJSON);
  })
  .catch(e => console.log(e));
  */


  /* duoc
  writefile('TIM_MAI_KHONG_THAY_FILE_NAY_O_DAU.text','Lorem ipsum dolor sit amet','utf8' );
  readfile('TIM_MAI_KHONG_THAY_FILE_NAY_O_DAU.text','utf8')
  .then(res => console.log('docfile:::',res))
  .catch(e => console.log(e));
  */

}

{/*


      /* dung duco bat xampp len de dung
    RNFetchBlob.fetch('POST', 'http://192.168.0.101:81/api/images/product/56.jpg', {
      Authorization: "Bearer access-token...",
      'Dropbox-API-Arg': JSON.stringify({
        path: '/img-from-react-native.png',
        mode: 'add',
        autorename: true,
        mute: false
      }),
      'Content-Type': 'application/octet-stream',
      // here's the body you're going to send, should be a BASE64 encoded string
      // (you can use "base64"(refer to the library 'mathiasbynens/base64') APIs to make one).
      // The data will be converted to "byte array"(say, blob) before request sent.  
    }, base64ImageString)
      .then((res) => {
        console.log(res.text());
      })
      .catch((err) => {
        // error handling ..
      });
*/

  /* dung duoc ban goc convert base64
      // create a path you want to write to
      var path = RNFS.DocumentDirectoryPath + '/Tim_Xem_No_O_Thu_muc_nao.txt';
      // write the file
      RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
          console.log('path::',path);
        })
        .catch((err) => {
          console.log(err.message);
        });
  
      RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + 'Tim_Xem_No_O_Thu_muc_nao.txt', 'utf8')
        .then(res => {
          console.log('ressssss:::::', res);
        })
        .catch(e => {
          console.log('eeeeeee:::::');
          console.log(e);
        });
      */
}
    /* khong dung dc
    RNFU.getRealPathFromURI(imageUri)
    .then(path => {
      RNFS.readFile(path, 'base64');
    })
    .then(imageBase64 => {
      console.log('imageBase64::::::', imageBase64);
    })
    .catch(e => console.log(e));
    */

     /* chet tiet cai cai nay la loi lien //
    NativeModules.RNImageToBase64.getBase64String(imageUri, (err, base64) => {
      // Do something with the base64 string
      console.log(base64);
    })
    */