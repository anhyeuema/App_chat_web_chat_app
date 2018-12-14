import Buffer1 from 'buffer';
import global from './global';


  
const nhanDulieu = async (data) => {
  
   // var data = await { noidungEmit: [{ id: global.id, jsonServer: global.jsonServer }],dataServer: {dataClient: [{ dataJsonC: global.dataJsonC,dataJsonImageC: global.dataJsonImageC }]}} };
        
    try {
       
        const x = await data.global.noidungEmit.map(async (e2) => {
            try {
                const base64Server1 = await Buffer1.Buffer(global.e2.jsonServer).toString('base64'); //json consvert base64
                const id = global.e2.id;
                const convertJsonToBase64 = base64Server1;
                return (id,convertJsonToBase64);
            }
            catch (e) {
               return e;
            }
        });
        const y = await data.global.dataServer.dataClient.map(async (e1) => { //de lay phan tu trong mang dataClient tu DATAS ta lay duoc tu DATAS.dataServer.dataClient.map(....)
            try {
                const dataJsonC = await e1.global.dataJsonC;
                const buffertext = await Buffer1.Buffer(dataJsonC); //data nhan duoc la json ta chuyen ve buffer 
                const tostringtext = await buffertext.toString(); // sau chuyen buffer ve chuoi tostring
                console.log('tostringtext:::::::::', tostringtext);
                
                const dataJsonImageC1 = await e1.global.dataJsonImageC;
                const dataBase64 = await Buffer1.Buffer(dataJsonImageC1).toString('base64'); //json consvert base64
                console.log('dataBase64:::::::::', dataBase64);
            
                const textNew = await tostringtext;
                const testBase64 = await dataBase64;
               
                return (textNew, testBase64);
                //   console.log('this.state.testBase64:::::::::', testBase64);
                //  console.log('this.state.textNew:::::::::', textNew);
            } catch (err) {
                return console.log(err);
            }
        });
        x()
        .then((i,conver) => {
            console.log('this.state.testBase64aaaaaaa:::::::::',i);
            console.log('this.state.textNewaaaaaaa:::::::::',conver);
        });
        y()
        .then((txtN, tstB) => {
            console.log('this.state.testBase64aaaaaaa:::::::::',txtN);
            console.log('this.state.textNewaaaaaaa:::::::::',tstB);
        })
        var res = await (x, y);
        console.log('res;:::::', res);
        return res;
    } catch (err) {
        return err;
    }
};

export default nhanDulieu;