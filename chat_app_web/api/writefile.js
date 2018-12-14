import RNFS from 'react-native-fs'; // yarn add react-native-fs //react-native link react-native-fs

const writefile = async(filename, content, type) => {
    const path = RNFS.DocumentDirectoryPath + '/' + filename;
    return await RNFS.writeFile(path,content, type)
    .then( () => {
        console.log('FILE WRITTEN ten file la: ', filename);
        console.log('path:::', path);
        return true;
    })
    .catch( e => {
        console.log(e);
        return false;
    })
}

export default writefile;