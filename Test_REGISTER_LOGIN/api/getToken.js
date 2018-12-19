import { AsyncStorage } from 'react-native';

const getToken = async (key) => { //'@token'// ten key = '@token goi gia tri khi can get len
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        //  console.log(value);
        return value;
      }
      return [];
    } catch (e) {
      return e;
    }
  }

module.exports = getToken; 