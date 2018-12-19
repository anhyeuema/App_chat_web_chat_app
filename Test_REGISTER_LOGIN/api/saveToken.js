import { AsyncStorage } from 'react-native';

 const saveToken = async (key,token2) => { //key la ten can luu o day key = '@key' khi goi thi goi yen key nay ra
    try {
      await AsyncStorage.setItem(key, token2);
      return 'save_token_thanh_cong';
    } catch (e) {
      return e;
    }
  };

  module.exports = saveToken;