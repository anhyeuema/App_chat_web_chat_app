import RNFetchBlob from 'react-native-fetch-blob'; // yarn add react-native-fetch-blob // react-native link

const convert_base64 = async () => {
    try {
        const fetchBase = await  // send http request in a new thread (using native code)
        RNFetchBlob.fetch('GET', 'http://192.168.0.101:81/api/images/product/56.jpg', {
            Authorization: 'Bearer access-token...',
            // more headers  ..
        })
            .then(async (res) => {
            console.log('res::::::', res);
            // the following conversions are done in js, it's SYNC
            let base64Str = await res.base64();
            console.log('base64Str:::::', base64Str);

            let text = await res.text();
            console.log('text::::', text);



            /*
                let json = res.json();
                console.log('json::::',json);
                var stringbase64 = await new Buffer1.Buffer(res).toString('base64');
                console.log('stringbase64:::', stringbase64);
                var stringJSON = await new Buffer1.Buffer(stringbase64).toJSON();
                console.log('json::::::',stringJSON);
            */

            /*
            let status = await res.info().status;
            console.log('status::::',status);
            */

            /*
            if (status == 200) {
                // the conversion is done in native code
                let base64Str = res.base64();
                // the following conversions are done in js, it's SYNC
                let text = res.text();
                let json = res.json();
    
                
            } else {
                // handle other status codes
                console.log('khong_fetch_duoc');
            }
            */



            })
            // Something went wrong:
            .catch((errorMessage, statusCode) => {
            // error handling
            console.log('errorMessage:::', errorMessage);
            console.log('statusCode:::', statusCode);
            });

        return fetchBase;

    } catch (e) {
        return e;
    }
}

export default convert_base64;