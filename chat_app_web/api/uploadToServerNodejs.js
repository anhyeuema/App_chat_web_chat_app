import RNFetchBlob from 'react-native-fetch-blob';

const uploadToServerNodejs = (DATA) => {
      //socket io  khai bao o port 2500, http://192.168.0.101:5000 ma ta chi
    //upload len server port 5000 chu khong emit len server nen khong ca dung port 5000
    return RNFetchBlob.fetch('POST', 'http://192.168.0.101:5000/fetchblob', {//port len servert nodejs toi port 5000
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    },DATA)
}
module.exports = uploadToServerNodejs;