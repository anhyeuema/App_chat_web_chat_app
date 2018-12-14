import ImagePicker from 'react-native-image-picker';//yarn add react-native-image-picker// react-native-link react-native-image-picker

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const showImage_Picker = (callback) => {

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
            // response.data ket qua base64
            const  source = { uri: 'data:image/jpeg;base64,' + response.data }; // response.data tra ve ket qua la link duong dan trong anhdroid cai file chon trong image picker
        const dataBase64 = response.data;
        callback(source,dataBase64);
        }
        return callback;
    })
}

module.exports = showImage_Picker;

/* ImagePicker.showImagePicker(options, (response) => { //se chuyen image thanh response{..,data: 'base64'} 
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
    })
    */