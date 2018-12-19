var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(2500, console.log('start_server port 2500'));

app.use(express.static('public'));//thu vien cho thu luc nao co duoi .js thu vien anh cho  $("#img2").attr("src", "data:image/png;base64," + b64(buff.buffer));
app.use(express.static(path.join(__dirname, 'upload'))); //thu muc de chua thu vien cho anh trong file ejs hoac html
app.use(express.static('public')); //su dung thuvien cho ejs
app.set('view engine', 'ejs');
app.set('views', './views');

var fs = require('fs');
var Buffer = require('buffer/').Buffer;



app.get('/chitiet/:a/:b', (req, res) => {
  var n = req.params.a;
  var m = req.params.b;
  //  res.send("username: " + n + " password:" + m);
  res.sendFile(__dirname + '/data.html');
  //  res.render('chitiet');
});

app.get('/chat', (req, res) => {
  res.render('chatSocketIO');
});

var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  // doc noi dung o data.html roi moi tra ve file html( res.end(data))
  // res.writeHead(200, { "Content-Type": "text/html" });
  // var data = fs.readFileSync(__dirname + '/data.html', 'utf-8');
  //data = replace({NAME}, {khoapham: 1009});
  //res.end(data);
  //fs.createReadStream(__dirname + '/data.html').pipe(res);
  res.writeHead(200, { "Content-Type": "application/json" });
  var data = {
    username: [{ //sau nay tay ke noi vao database de do du lieu ra cho khach hanh len web server lay du lieu json
      ho: 'nguyen',
      ten: 'hung',
      namsinh: '1998'
    }]
  };
  data = JSON.stringify(data);
  res.end(data);
}).listen(7777, console.log('connected server 7777'));

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/data', urlencodedParser, (req, res) => {
  var u = req.body.username;
  var p = req.body.password;
  //  res.writeHead({" Content-Type": "application/json"});
  //  var data = [{u = '', p = '',}];
  // res.end(data);
  res.send("Username:" + u + " Password:" + p);
});


//upload file tu web sang server nodejs
var bodyParser = require('body-parser');
//var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer = require('multer');


/*
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/my_upload') //noi luu file
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
        //cb(null, file.originalname); //ten file duoc luu
    }
});
*/
var storage = multer.memoryStorage(); //
//single('avatar') chon 1  file duy nhat
var upload = multer({ storage: storage }).single('file'); // cau hinh upload

app.post('/chat', urlencodedParser, (req, res) => {

  //console.log('req::::::',req.file);
  upload(req, res, function (err) {
    if (err !== null) {
      // An unknown error occurred when uploading.
      // res.send('oke- da upload file');
      console.log('req.file::::::', req.file);
      console.log('req.file.filename:::', req.file.filename);
      console.log('req.file.buffer::::::', req.file.buffer);
      //  console.log('req.file.buffer.toStringbase64::', req.file.buffer.toString('base64'));
      io.sockets.emit('web-send-image', { imageWebBase64: req.file.buffer.toString('base64') });
      res.render('chatSocketIO'); // load lai ejs chatSocketIO thi ben nay se k hen anh nhung doi tuong App va ng khac se nhan duoc base64
    } else {

      // A Multer error occurred when uploading.
      res.send('loi');
    }
    // Everything went fine.
  })
});

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session'); //khai bao session tren Passport
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

var fs = require('fs');
//var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); //khai bao session tren Passport

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(Passport.initialize());
app.use(Passport.session()); // su dung session de ghi du lieu ra ngoai

app.get('/', (req, res) => {
  res.render('trangchu');
});

app.route('/login')
  .get((req, res) => {
    console.log('dangvao-login');
    res.render('login');
  })
  .post(Passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/loginOK'
  })); //phung thuc local sai dieu huong ve trang '/login'

app.get('/loginOK', (req, res) => {
  res.send('login_succeffully');
});

Passport.use(new LocalStrategy(
  (username, password, done) => {
    fs.readFile('./userDatabay.json', (err, data) => {
      //data dang la buffer nen chua thao tac voi no duoc nen can JSON.parse no ve  object
      const db = JSON.parse(data);
      //db la object nen ta can dung ham find tim username khop voi username nguoi dung 
      const userRecord = db.find(user => user.usr == username); //tao bien userRecord huong no
      //sau do so sanh tiep voi password 
      //neu user co trong userDattabay cua minh thi va userRecord.pwd bang password trog databay thi
      if (userRecord && userRecord.pwd == password) {
        //goi ham done loi la null , userRecord
        return done(null, userRecord);
        //neu ma username nhap sai hay pass sai thi nhay toi else{}
      } else {
        return done(null, false);
      }
    })
  }
))
//chung thuc thanh cong thi goi ham serialaizeUser()
//(user,done) la return done(null, userRecord); ket qua o tren ham Passport.use tra ve
Passport.serializeUser((user, done) => {
  //dai dien cho nguoi dung luu ra cooki, chon truong lau usr (username o databaydo)
  done(null, user.usr);
});

// app.listen(2500, () => console.log('server tao port 2500 tren app'));

var express = require('express');
var app1 = express();
var server1 = require('http').createServer(app1); // dung createServer hay Server cung duoc
app1.set('view engine', 'ejs');
app1.set('views', './views');
server1.listen(2700, console.log('ket noi server app1  kiemtra port 2700'));
app1.get('/', function (req, res) {
  //res.send("<font color=red>hello</font>");
  // res.sendFile(__dirname + '/data.html');
  res.render('chitiet');
});


var express = require('express');
var app2 = express();
var formidable = require('express-formidable');
app2.use(formidable({ //khi fetch-blob ma post du lieu len thi se dinh nghia huong luu file uploadDir
  uploadDir: './public/upload',
  encoding: 'utf-8',
}));
app2.listen(5000, console.log('start port 5000 test fetch blob'));

app2.get('/xinchao', (req, res) => {
  res.send('xinchao');
})

app2.post('/fetchblob', (req, res) => { //phai la post vi fetch-blob len theo phuong thuc post
  // console.log('req::::',req);
  console.log('req.fields::::', req.fields);
  // console.log(req.fields); //log ra truong k phai file
  console.log('req.files.avatar::::', req.files.avatar); // log ra truong file nhan duoc tu react-native fetch-blob gui cho server nodejs
  console.log('req.files.avatar.file.path::::', req.files.avatar.path); // log ra truong file nhan duoc tu react-native fetch-blob gui cho server nodejs


  //  fs.rename(req.files.avatar); //name gui xuong la avata
  //  fs.rename(req.files.avatar.path); //lay duong dan da luu tren server nodejs
  fs.rename(req.files.avatar.path, req.files.avatar.path + '.jpg', (err) => {
    if (err != null) {
      console.log('upload file tu react-native-in-server-nodejs-succeffully');
    } else {
      console.log(err);
    }

  }); //lay duong dan da luu tren server nodejs

  res.send('xinchao');
});


var mangUserName = [];
io.on('connection', async (socket) => {
  console.log('client-connected port 2500 :' + socket.id);
  console.log('socket.adapter.rooms::::', socket.adapter.rooms);

  socket.on('server-send-chat-room', (message_room) => {
    //emit ve cai thang tao-room do
    io.sockets.in(socket.phong).emit('server-send-message-room', message_room);
  });
  socket.on('tao-room', (data) => {
    console.log('tao duoc room' + data);
    socket.join(data);
    socket.phong = data; // gan cai thang vau ket noi do = data

    var mang = [];
    for (r in socket.adapter.rooms) {
      console.log(r);
      mang.push(r); //push danh sach rooms vao mang

    }
    io.sockets.emit('server-send-rooms', mang);
    console.log('mang:::', mang);
    socket.emit('server-send-room-socket', socket.phong)

  });

  socket.on('web-send-text', (message) => {
    console.log('socket.Usename::', socket.Usename);
    console.log('socket.Usename::', message);
    io.sockets.emit('server-send-message', { un: socket.Usename, ms: message })
  });

  socket.on('web-dk-username', (user) => {
    console.log('have wonam register username: ' + user);
    if (mangUserName.indexOf(user) >= 0) {
      socket.emit('web-dang-ky-username-thatbai');
    } else {
      mangUserName.push(user);
      socket.Usename = user
      socket.emit('sever-send-username-thanhcong', user);
      io.sockets.emit('server-send-danhsach-username', mangUserName);
    }

  });

  socket.on('web-client-send-base64', () => {

  });

  socket.on('ImagePicker-app-client-send-base64', (avataBase64) => {
    io.emit('ImagePicker-server-send-base64', avataBase64)
  });
  socket.on('app-client-send-base64', (database64) => {
    console.log('database64', database64);
    console.log('data dulieu base64::::', database64.data);
    io.sockets.emit('server-send-baser64', database64);
    /*
    writeFileSync(__dirname + '/public/upload/' + 'new_huong.jpg', '%database64.data%','base64', (err) => {
      if( err != null) {
        console.log('da luu file::');
        io.sockets.emit('server-send-baser64', database64);
      } else {
        console.log('dhi phai sayr ra loi');
      }
    });
    */

  });

  await socket.on('client-send-data', async (data) => {
    console.log('lang nghe dc client-send-data ');
    console.log('app vua gui massage: ' + (data));
    fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
      var DATA = { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data }; //chuyen dulieu tu buffer sang json
      var base64_A = dulieu.toString('base64');
      //gui emit truc tiep du lieu dulieu la buffer k dc trong react-native
      await io.sockets.emit('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });

      /*
      console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
      await DATA.noidungEmit.map(async (e0) => {
        console.log('jsonServer::::::', e0.jsonServer);
        // console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
      });
      */

    });
  });

});


//base64 convert image
var fs = require('fs');
let data = 'iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAYAAABlcqYFAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAA' +
  'CA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0' +
  'YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly' +
  '93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAg' +
  'ICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZm' +
  'Y6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAADuUlEQVQ4EbVU' +
  'TUtcZxR+7ufkXp1SZ4iZRE1EDVQRnTAhowsZMFm40I2rNqUIIev8hvoPQroQXBTqwiAWcd0EglEhiZNajVZrQGXAWAzaZpzMnZn7lXPeeIe5Da' +
  'Wb9Ax33vOec8/znI/3vVI6nfbxP4v8b/iSJIGfzyGfkPi+D13XUalUBL6qqmIvy5+8WuX/r2RCkUzAoIuLi2hqaoLrutjb28P6+josyxJkiqJA' +
  '07SQXiqVwHaOZYx/itLc3Px9YIxEIlheXsbExATGxsYwMjIiwEdHRwXA/Pw8EokEcrkcDg4OYJomVlZWMDU1JSqfmZlBR0cHbNsOtVoNCHjlTF' +
  'iSySQMwxAVxONxQbi0tIRMJoPe3l5MT0+jtbUVg4ODYGImY18qlcL4+DhisZjoggCjv1C7uOyenh7Mzs5iY2ND6FQpdnd3sba2JloSjUYxPDyM' +
  '/v5+TE5OYn9/X9jZtrOzg+3t7WqyAUmoEu419/+HBw9E+eVymbJqAJP39fWBCR3HEU+hUMDQ0JCYGc8um81iYGAAjY2N8DwvwBdraCY8tHhDA1' +
  'Y3N9Hd3S2yvH37O7RcbsF7AuUsD9+8wdOFBTx/8QJtbW1C5/nMzc3R0D2UyxXk83lRXcAk1V5GCT5sSUGDbeHxy9/EO98M9OOXzT9wfHISxKC1' +
  'vR0GHfOtrS2g/SouWwU0Xkggu7qO9PUkJFULnbIQyTm6ewu2hF+vnOIIUQwdGlg8f4QF6wvMWBq+pAkaskSnx4FFVUf0CNpcC797KizXQ4oAHh' +
  'VdXJJ81F7j6kwUynPHlXDPdFB2fRj+KVK0KvT2rbp3uKYryJU11Cke8qqMuOoioeeJ1MPDYxM36m1cNSq4GdFx58RAWvbx8TrXnK4IgR16Em5G' +
  'K4iqHi5GHHxLgcSDn97WgZPoND+GGZRpPYH85cgiiRQl1ltXxmFFQ5PuopP8TrW5ZyRcWp7AbmkeZefg5+N6PPnbRJdpw/YlfB0vQiPQZwVdZN' +
  'tFZEVK6D1VTnccJlXzuqTjvOZiq6Rhj2KqLSJsofOHgIl8+t0/qsfDioxmSUWGjrRFzhYi/5Oynrdl3KXHIZDXtF6hil8R6I9FBV/RvDLnXKxS' +
  'bAdVYhNeINXBMwmXWCTQGG2Y+Jj+dFrfEmiMAtmeowpo9ojTvkD+A/L1UJUMmiVfkuz6WTyZhFRJAgP33j3bsM5k/Fng68UP21hYJyyxZwLWuS' +
  '2cKMfUSm3rhD0g4E2g197fwMZ+Bgt8rNe2iP2BhL5dgfFzrx8AfECEDdx45a0AAAAASUVORK5CYII=';

fs.writeFile(__dirname + '/public/upload/' + 'logo.png', data, 'base64', (er) => {
  if (er != null) {
    console.log('file-da_duoc-ghi:');
  } else {
    console.log('da co error say ra nen khong ghi duoc file');
  }
});




/*
var base64Img = require('base64-img');//thu vien convert base64

base64Img.base64('public/1.jpg', (err, dulieu) => { //convert base64
  console.log(err);
  console.log(dulieu);
});
*/

/*

var noidung = fs.readFileSync(__dirname + '/public/1.jpg');

var jsonDulieu = noidung.toJSON(); //bufer convert json
console.log('jsonDulieu:::::', jsonDulieu);

var base64Dulieu = noidung.toString('base64'); //tu buffer convert base64
console.log('buffferConvert_base64Dulieu:::::', base64Dulieu);

var base64Dulieu1 = Buffer(jsonDulieu).toString('base64'); //json convert base64
console.log('jsonConvert_base64Dulieu:::::', base64Dulieu1);
*/


/*
var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  // This opens up the writeable stream to `output`
  var writeStream = fs.createWriteStream('./output');
  // This pipes the POST data to the file
  req.pipe(writeStream);
  // After all the data is saved, respond with a simple html form so they can post more data
  req.on('end', function () {
    res.writeHead(200, { "content-type": "text/html" });
    res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
  });
  // This is here incase any errors occur
  writeStream.on('error', function (err) {
    console.log(err);
  });
}).listen(8080);
*/

/*
fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
    console.log(dulieu);
    console.log(dulieu.toString('base64'));
});
*/

/*
var express = require('express');
var app2 = express();
var formidable = require('express-formidable');
app2.use(formidable({ //khi fetch-blob ma post du lieu len thi se dinh nghia huong luu file uploadDir
  uploadDir: './public/upload',
 // encoding: 'utf-8',
}));
app2.listen(5000, console.log('start port 5000 test fetch blob'));

app2.post('/fetchblob',( req,res) => { //phai la post vi fetch-blob len theo phuong thuc post
  console.log(req.fields); //log ra truong k phai file
  console.log(req.files) // log ra truong file nhan duoc tu react-native fetch-blob gui cho server nodejs
  fs.rename(req.files.avata); //name gui xuong la avata
  fs.rename(req.files.avata.path); //lay duong dan da luu tren server nodejs
  fs.rename(req.files.avata.path, req.files.avata.path + '.jpg', err =>{
    console.log(err);
  }); //lay duong dan da luu tren server nodejs

  res.send('xinchao');
});
*/


/*
//dat ten duoi  file mage la cham .png hay .jpg.
var guess = dulieu.base64.match(/^data:image\/(png|jpeg);base64,/)[1];
var ext = '';
switch (guess) {
  case 'png': ext = '.png'; break;
  case 'jpeg': ext = '.jpg'; break;
  default: ext = '.bin'; break;
}
function randomString(length) { //random ten file image phan text
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  for (var i = 0; i < length; i++)
    text = possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

var savefilename = randomString(10) + ext; //ten phan phan text + phan doi duoi

function lua_chon_duoi_phu_hop_voi_base64_de_chuyen_ve_image(dulieuBase64) {
  dulieuBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""); //trong dau "" chasc la dataBsae64
}

fs.writeFile(__dirname + '/publi/upload' + savefilename, lua_chon_duoi_phu_hop_voi_base64_de_chuyen_ve_image(data), 'base64', (er) => { });

*/












/*
let buff =  Buffer(data, 'base64');
fs.writeFileSync('stack-abuse-logo-out.png', buff);
console.log('Base64 image data converted to file: stack-abuse-logo-out.png');
*/

/*
io.on('connection', async (socket) => {
  console.log('client-connected port 2500 :' + socket.id);
  await socket.on('client-send-data', async (data) => {
    console.log('lang nghe dc client-send-data ');
    console.log('app vua gui massage: ' + (data));
    fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
      var DATA = { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data }; //chuyen dulieu tu buffer sang json
      var base64_A = dulieu.toString('base64');
      await io.sockets.emit('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
      console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
      await DATA.noidungEmit.map(async (e0) => {
        console.log('jsonServer::::::', e0.jsonServer);
        // console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
      });
    });
  });
});
*/

/*
io.on('connection', async (socket) => {
    console.log('client-connected:' + socket.id);
    await socket.on('client-send-data', async (data) => {
        console.log('lang nghe dc client-send-data ');
        console.log('app vua gui massage: ' + (data));
        fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
            var DATA = { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data }; //chuyen dulieu tu buffer sang json
            var base64_A = dulieu.toString('base64');
         //   io.sockets.emit.pause('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });

            if (!base64_A && !err) {
                fs.readFile.pause();
                io.sockets.emit.pause('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
            }
        });
        fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
            fs.readFile.resume();
            io.sockets.emit.resume('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
        });

        console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
        await DATA.noidungEmit.map(async (e0) => {
            console.log('jsonServer::::::', e0.jsonServer);
            // console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
        });

    });
});

*/
/*
io.on('connection', async (socket) => {
  console.log('client-connect:' + socket.id);
  await socket.on('client-send-data', async (data) => {
    console.log('app vua gui massage: ' + (data));
    var dulieu = ''; // Tao mot Readable Stream
    var readerStream = fs.createReadStream(__dirname + '/public/Reader/1.jpg'); // Thiet lap encoding la utf8.
    readerStream.setEncoding('base64'); // Xu ly cac su kien lien quan toi Stream --> data, end, va error
    readerStream.on('data', (chunk) => {
      //data += chunk;
   //   console.log('chunk::::',chunk);
      console.log('dulieu0000000', dulieu);
      dulieu = dulieu + chunk;
    //  io.sockets.emit('server-send-data', { noidungEmit: [{ id: socket.id, jsonServer: dulieu }], dataServer: data });
     console.log('dulieu11111', dulieu);
      if (!dulieu) {
        console.log('dulieu_nhayvao iffffff');
       readerStream.pause();
        console.log('dulieu_nhayvao eeeeeeiffffff', dulieu);
        io.sockets.emit.pause('server-send-data', { noidungEmit: [{ id: socket.id, jsonServer: dulieu }], dataServer: data });
      }
    });

    writeStream.on('data', (chunk) => {
      readStream.resume();
    });
    readerStream.on('end', () => {
    //  console.log('dulieu:::::::', dulieu);
     io.sockets.emit('server-send-data', { noidungEmit: [{ id: socket.id, jsonServer: dulieu }], dataServer: data });
    });
    readerStream.on('error', (err) => {
      console.log('err.stack::::::', err.stack);
    });
    var DATA = { noidungEmit: [{ id: socket.id, jsonServer: dulieu }], dataServer: data }; //chuyen dulieu tu buffer sang json

    console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
    await DATA.noidungEmit.map(async (e0) => {
       console.log('jsonServer::::::', e0.jsonServer);
     // console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
    });

  });
});
*/

/*
fs.createReadStream("input/people.json").pipe(fs.createWriteStream("output/people.json"));
var writeStream = fs.createWriteStream('./output');
var readStream = fs.createReadStream('./output');
readStream.on('data', function (chunk) {
  var buffer = writeStream.write(chunk); // return false nếu buffer full.
  if (!buffer) readStream.pause();
});

writeStream.on('drain', function () {
  readStream.resume();
});
*/

/*

 /*
    readStream.emit('server-send-data', (DATA) => {
      var buffer = writeStream.write(data);
      if (!buffer) readStream.pause();
    });
    writeStream.emit('server-send-data', (DATA) => {
      readStream.resume();
    });
var fs = require("fs");
var data = ''; // Tao mot Readable Stream
var readerStream = fs.createReadStream(__dirname + '/public/Reader/1.jpg'); // Thiet lap encoding la utf8.
readerStream.setEncoding('base64'); // Xu ly cac su kien lien quan toi Stream --> data, end, va error
readerStream.on('data', (chunk) => {
  //data += chunk;
  data = data + chunk;
});
readerStream.on('end', () => {
  console.log('data:::::::', data);
});
readerStream.on('error', (err) => {
  console.log('err.stack::::::', err.stack);
});
console.log("Ket thuc chuong trinh reader");
*/



//Xem nội dung đầy đủ tại:https://123doc.org/document/4645845-stream-trong-node-js-pdf-stream-trong-nodejs.htm


/*
var fs = require("fs");
var data = 'VietNamVoDoi_saa_anh_lai_di_di'; // Tao mot Writable Stream
var writerStream = fs.createWriteStream(__dirname + '/public/Write/output.txt'); // Ghi du lieu toi Stream theo ma hoa utf8
writerStream.write(data,'UTF8'); // Danh dau diem cuoi cua file (end of file)
writerStream.end(); // Xu ly cac su kien lien quan toi Stream --> finish, va error
writerStream.on('finish', function() {
  console.log("Ket thuc hoat dong ghi.");
});
writerStream.on('error', function(err){
  console.log(err.stack);
});
console.log("Ket thuc chuong trinh");

// Xem nội dung đầy đủ tại:https://123doc.org/document/4645845-stream-trong-node-js-pdf-stream-trong-nodejs.htm
*/




/*
var readStream = fs.createReadStream('1.jpg', {encoding: "utf16le"});
var writeStream = fs.createWriteStream('1.jpg', {encoding: "utf16le"});
console.log('writeStream::::',writeStream);

var a1  = writeStream.write('aef35ghhjdk74hja83ksnfjk888sfsf', 'base64');
console.log('a1::::::',a1);
//var buffera = writeStream.write(data.toString(), "utf16le");
//console.log('buffera::::',buffera);
var aaaaa = readStream.pipe(writeStream);
console.log('aaaaa::::',aaaaa);




var readStream = fs.createReadStream('./output');
io.on('connection', async (socket) => {
  console.log('client-connect:' + socket.id);
  await socket.on('client-send-data', async (data) => {
    console.log('app vua gui massage: ' + (data));
    var DATA = await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data }; //chuyen dulieu tu buffer sang json
    fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
      var base64_A = dulieu.toString('base64');
      if (!base64_A && !err) {
        fs.readFile.pause();
        io.sockets.emit.pause('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
      }
    });
    fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
      fs.readFile.resume();
      io.sockets.emit.resume('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
    });
    console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
    await DATA.noidungEmit.map(async (e0) => {
      // console.log('dataImageJson1::::::', e0.jsonServer);
      console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
    });
  });
});
*/


/*

var writeStream = fs.createWriteStream('/public/1.jpg');
var readStream = fs.createReadStream('/public/1.jpg');
io.on('connection', async (socket) => {
  console.log('client-connect:' + socket.id);
  await socket.on('client-send-data', async (data) => {
    console.log('app vua gui massage: ' + (data));
    await fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => { //duleiu dang o buffer
      var DATA = await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data }; //chuyen dulieu tu buffer sang json
      if (!err) {

        //await io.sockets.emit('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toJSON() }], dataServer: data });

        //  await io.sockets.emit('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });

        fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
          var base64_A = dulieu.toString('base64');
          if (!base64_A) {
            fs.readFile.pause();
            io.sockets.emit.pause('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
          }
        });
        fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => {
          fs.readFile.resume();
          io.sockets.emit.resume('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
        });

        /*
        readStream.emit('server-send-data', (DATA) => {
          var buffer = writeStream.write(data);
          if (!buffer) readStream.pause();
        });
        writeStream.emit('server-send-data', (DATA) => {
          readStream.resume();
        });
        */

        /*
      }
      console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
      await DATA.noidungEmit.map(async (e0) => {
        // console.log('dataImageJson1::::::', e0.jsonServer);
        console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
      });
    });
  });
});
*/

/*
io.on('connection', async (socket) => {
  console.log('client-connect:' + socket.id);
  await socket.on('client-send-data', async (data) => {
    //  console.log(data);
    console.log('app vua gui massage: ' + (data));

    var dataJsonC = await data.dataJsonC;
    var dataJsonImageC = await data.dataJsonImageC;
    console.log('dataJsonImageC:::::::::', dataJsonImageC);

    console.log('dataJsonC:::::::::', dataJsonC);
    console.log('app vua gui massage: ' + Buffer(dataJsonC));
    console.log('dataJsonImageC:::::::::', dataJsonImageC);
    console.log('dataJsonImageC:::::::::', Buffer(dataJsonImageC).toString('base64')); // tu json chuyen bSE64

    await fs.readFile(__dirname + '/public' + '/1.jpg', async (err, dulieu) => { //duleiu dang o buffer
      var DATA = await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data }; //chuyen dulieu tu buffer sang json
      // console.log('DATA:::::', DATA);
      if (!err) {
        await io.sockets.emit('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu.toString('base64') }], dataServer: data });
      }
      console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
      await DATA.noidungEmit.map(async (e0) => {
        // console.log('dataImageJson1::::::', e0.jsonServer);
        //   console.log('baseServer:::::::', await Buffer(e0.jsonServer).toString('base64'));
      });
    });

  });
});
*/

  /* tuogn duong voi ham  await fs.readFile(__dirname...)
    setInterval(async () => { //cu sau 5000 ms se thuc hien cau lenh tron ngoac,imet chang hang

    }, 5000);

    await base64Img.base64('public/1.jpg', async (err, dulieu) => { //o day dulieu dang la base64
      var DATA = await { noidungEmit: [{ id: socket.id, jsonServer: dulieu }], dataServer: data }; //
      if (!err) {
        await io.sockets.emit('server-send-data', await { noidungEmit: [{ id: socket.id, jsonServer: dulieu }], dataServer: data });// du lieu dng la base 64 nen ta se chuyen thang sang client
      }
      console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
      await DATA.noidungEmit.map(async (e0) => {
        console.log('dataImageJson1::::::', e0.jsonServer);
        //  console.log('baseServer:::::::',await Buffer(e0.jsonServer).toString('base64'));
      });
    });
    */



 /*
           console.log('DATA.jsonServer::::::',DATA.noidungEmit);
            await DATA.noidungEmit.map(async (e0) => {
                var dataImageJson1 = await e0.jsonServer;

              //  console.log('jsonServer:::::',dataImageJson1);
                console.log('----baseServer======----');
                console.log('----baseServer=======----');
                console.log('baseServer:::::::',await Buffer(dataImageJson1).toString('base64'));
            });
          */

            /*
            console.log('--------------=====emit:::::::::');
           // DATA.dataServer.map(async (e1) => { //de lay phan tu trong mang dataClient tu DATAS ta lay duoc tu DATAS.dataServer.dataClient.map(....)
                const dataJsonC = await DATA.dataServer.dataJsonC;
                const dataJsonImageC = await DATA.dataServer.dataJsonImageC;
             //   console.log('dataJsonCemit:::::::::', dataJsonC);
             console.log('dataJsonImageCemit:::::::::', DATA.dataServer.dataJsonImageC);
             //   console.log('dataJsonImageCemit:::::::::', Buffer(dataJsonImageC).toString('base64'));
           // });
            */

/*
io.on('connection', async (socket) => {
    console.log('co nguoi vua ket noi: ' + socket.id);
    await socket.on('client-send-color', async (data) => {
      console.log(data);
      // console.log('app vua gui massage: ' + Buffer(data));
      data.dataClient.map(async (e1) => {
        var dataJsonC = await e1.dataJsonC;
        var dataJsonImageC = await e1.dataJsonImageC;


        console.log('dataJsonC:::::::::', dataJsonC);
        console.log('app vua gui massage: ' + Buffer(dataJsonC));
        console.log('dataJsonImageC:::::::::', dataJsonImageC);
        console.log('dataJsonImageC:::::::::', Buffer(dataJsonImageC).toString('base64')); // tu json chuyen bSE64

      });
      var dataServer = data; // nhu data do data la mang nen t chuyen luon data ha dataServer va DATAS la duoc
     // console.log('dataServer:::::', dataServer);
      //var DATAS = (await { typedata: [{ anh: noidung, id: socket.id, text: textJson }], type: [{ ba: '3', hai: '2' }], noidungemit: await [{ dataImageJson: await fileanh }], fileBase: [{ fileImgaBase: base64str, bufferImage: bitmap1 }], dataServer });

      //await io.sockets.emit('server-send-client', await DATAS); //emit duoc
      //await socket.to(socket.id).emit('server-send-client', await DATAS); //cung emit duoc da thu// gửi đến cá nhân socketid (tin nhắn riêng)

      await fs.readFile(__dirname + "/public" + "/1.jpg", async(err, dulieu) => {
       // console.log('dulieu:::',dulieu); //buffer
       // var fileanh = dulieu.toJSON(); //chuyen dang toJSON
       // console.log('fileanh:::', fileanh);
        var DATAS = { typedata: [{ anh: noidung, id: socket.id, text: textJson }], type: [{ ba: '3', hai: '2' }], noidungemit: [{ dataImageJson: dulieu.toJSON() }], fileBase: [{ fileImgaBase: base64str, bufferImage: bitmap1 }], dataServer };
       // console.log('DATAS:::', DATAS);
        if(!err){
           await io.sockets.emit('server-send-client', await DATAS); //emit duoc
            //socket.to(socket.id).emit('server-send-client', DATAS); //cung emit duoc da thu// gửi đến cá nhân socketid (tin nhắn riêng)
        } else {
          console.log('that bai');
        }


        DATAS.noidungemit.map(async (e0) => {
          var dataImageJson1 = await e0.dataImageJson;
          console.log('----dataImageJson----');
          console.log(dataImageJson1);
          console.log('----dataImageJson111======----');
          console.log('----dataImageJson1111=======----');
          console.log(await Buffer(dataImageJson1).toString('base64'));
        });
        console.log('--------------=====emit:::::::::');
        DATAS.dataServer.dataClient.map(async (e1) => { //de lay phan tu trong mang dataClient tu DATAS ta lay duoc tu DATAS.dataServer.dataClient.map(....)
          const dataJsonC = await e1.dataJsonC;
          const dataJsonImageC = await e1.dataJsonImageC;
          console.log('dataJsonCemit:::::::::', dataJsonC);
          console.log('dataJsonImageCemit:::::::::', dataJsonImageC);
        });


      });

      //await socket.compress ( false ).emit('server-send-client', await DATAS);
      // chỉ định liệu dữ liệu có gửi có dữ liệu nhị phân
     //socket.binary( false ).emit('server-send-client', await DATAS);

    });
  });
*/

/*
io.on('connection', async (socket) => {
  console.log('co nguoi vua ket noi: ' + socket.id);
  await socket.on('client-send-color', async (data) => {
    console.log(data);
    // console.log('app vua gui massage: ' + Buffer(data));
    data.dataClient.map(async (e1) => {
      var dataJsonC = await e1.dataJsonC;
      var dataJsonImageC = await e1.dataJsonImageC;


      console.log('dataJsonC:::::::::', dataJsonC);
      console.log('app vua gui massage: ' + Buffer(dataJsonC));
      console.log('dataJsonImageC:::::::::', dataJsonImageC);
      console.log('dataJsonImageC:::::::::', Buffer(dataJsonImageC).toString('base64')); // tu json chuyen bSE64

    });
    var dataServer = data; // nhu data do data la mang nen t chuyen luon data ha dataServer va DATAS la duoc
   // console.log('dataServer:::::', dataServer);
    //var DATAS = (await { typedata: [{ anh: noidung, id: socket.id, text: textJson }], type: [{ ba: '3', hai: '2' }], noidungemit: await [{ dataImageJson: await fileanh }], fileBase: [{ fileImgaBase: base64str, bufferImage: bitmap1 }], dataServer });

    //await io.sockets.emit('server-send-client', await DATAS); //emit duoc
    //await socket.to(socket.id).emit('server-send-client', await DATAS); //cung emit duoc da thu// gửi đến cá nhân socketid (tin nhắn riêng)

    await fs.readFile(__dirname + "/public" + "/1.jpg", async(err, dulieu) => {
     // console.log('dulieu:::',dulieu); //buffer
     // var fileanh = dulieu.toJSON(); //chuyen dang toJSON
     // console.log('fileanh:::', fileanh);
      var DATAS = { typedata: [{ anh: noidung, id: socket.id, text: textJson }], type: [{ ba: '3', hai: '2' }], noidungemit: [{ dataImageJson: dulieu.toJSON() }], fileBase: [{ fileImgaBase: base64str, bufferImage: bitmap1 }], dataServer };
     // console.log('DATAS:::', DATAS);
      if(!err){
         await io.sockets.emit('server-send-client', await DATAS); //emit duoc
          //socket.to(socket.id).emit('server-send-client', DATAS); //cung emit duoc da thu// gửi đến cá nhân socketid (tin nhắn riêng)
      } else {
        console.log('that bai');
      }


      DATAS.noidungemit.map(async (e0) => {
        var dataImageJson1 = await e0.dataImageJson;
        console.log('----dataImageJson----');
        console.log(dataImageJson1);
        console.log('----dataImageJson111======----');
        console.log('----dataImageJson1111=======----');
        console.log(await Buffer(dataImageJson1).toString('base64'));
      });
      console.log('--------------=====emit:::::::::');
      DATAS.dataServer.dataClient.map(async (e1) => { //de lay phan tu trong mang dataClient tu DATAS ta lay duoc tu DATAS.dataServer.dataClient.map(....)
        const dataJsonC = await e1.dataJsonC;
        const dataJsonImageC = await e1.dataJsonImageC;
        console.log('dataJsonCemit:::::::::', dataJsonC);
        console.log('dataJsonImageCemit:::::::::', dataJsonImageC);
      });


    });
*/
