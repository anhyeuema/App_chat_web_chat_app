import RNFS from 'react-native-fs'; // yarn add react-native-fs //react-native link react-native-fs


const readfile = async (filename, type) => {
    try {
        const path = RNFS.DocumentDirectoryPath + '/' + filename;
        const content = await RNFS.readFile(path, type);
        if( content !== null ) {
            return content;
        }
        return 'Convert is not to Base64 ';
    } catch (e) {
        return e;
    }
}

export default readfile;