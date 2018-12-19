
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session'); //khai bao session tren Passport
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

//var find = require('find');

var fs = require('fs');
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })) //khai bao session tren Passport

app.use(session({
    secret: 'keyboard cat',
    cookie: 1000*60*10,
    resave: false,
    saveUninitialized: true
}))

fs.readFile('./userDatabay.json', (err, data) => {
    
    console.log(data);
    const db = JSON.parse(data);
    console.log(db);
    const userRecord = data.find(user => {
        user.usr == 'user2'
       // console.log('userRecord:::',user.usr)
    }) //tao bien userRecord huong no
    //sau do so sanh tiep voi password 
    //neu user co trong userDattabay cua minh thi va userRecord.pwd bang password trog databay thi
    const passRecord = data.find(pass => {
        pass.pwd == 'myuser2'
       // console.log('userRecord:::',user.usr)
    })
    
    if (userRecord && passRecord ) {
        //goi ham done loi la null , userRecord
        console.log('login thanh cong');
        
       // return done(null, userRecord)
        //neu ma username nhap sai hay pass sai thi nhay toi else{}
    } else {
        console.log('dang ky that bai')
      //  return done(null, false)
    }
    
})

Passport.use(new LocalStrategy(
    (username, password, done) => {
        fs.readFile('./userDatabay.json', (err, data1) => {
            console('data;;;;;;',data1)
            //data dang la buffer nen chua thao tac voi no duoc nen can JSON.parse no ve  object
            const data = JSON.parse(data1)
            //db la object nen ta can dung ham find tim username khop voi username nguoi dung 
            const userRecord = data.find(user => {
                user.usr == username
            }) //tao bien userRecord huong no
            //sau do so sanh tiep voi password 
            //neu user co trong userDattabay cua minh thi va userRecord.pwd bang password trog databay thi
            if (userRecord && (userRecord.pwd == password)) {
                //goi ham done loi la null , userRecord
                console.log('login thanh cong')
                return done(null, userRecord)
                //neu ma username nhap sai hay pass sai thi nhay toi else{}
            } else {
                console.log('dang ky that bai')
                return done(null, false)
            }
        })
    }
))
app.use(Passport.initialize())
app.use(Passport.session()) // su dung session de ghi du lieu ra ngoai

app.get('/', (req, res) => {
    res.render('trangchu');
});




app.route('/login')
    .get((req, res) => {
        console.log('dangvao-login');
        res.render('login');
    })
    .post(Passport.authenticate('local', {
        failureRedirect: '/logintest',
        successRedirect: '/loginOK'}),
        
        function(req, res) {
            res.redirect('/');
        }
        
        ) //phung thuc local sai dieu huong ve trang '/login'

app.get('/private', (req, res) => {
    if(req.isAuthenticated()) {
        res.send('vao tang private page');
    } else {
        res.send('ban chua login')
    }
});
app.get('/logintest', (req, res)  => {
    res.send('login_sai');
})  
app.get('/loginOK', (req, res) => {
    res.send('login_succeffully');
})

/*
Passport.use(new LocalStrategy(
    (username, password, done) => {
        fs.readFile('./userDatabay.json', (err, data1) => {
            console('data;;;;;;',data1)
            //data dang la buffer nen chua thao tac voi no duoc nen can JSON.parse no ve  object
            const data = JSON.parse(data1)
            //db la object nen ta can dung ham find tim username khop voi username nguoi dung 
            const userRecord = data.find(user => user.usr == username) //tao bien userRecord huong no
            //sau do so sanh tiep voi password 
            //neu user co trong userDattabay cua minh thi va userRecord.pwd bang password trog databay thi
            if (userRecord && userRecord.pwd == password) {
                //goi ham done loi la null , userRecord
                console.log('login thanh cong')
                return done(null, userRecord)
                //neu ma username nhap sai hay pass sai thi nhay toi else{}
            } else {
                console.log('dang ky that bai')
                return done(null, false)
            }
        })
    }
))
*/

//chung thuc thanh cong thi goi ham serialaizeUser()
//(user,done) la return done(null, userRecord); ket qua o tren ham Passport.use tra ve
Passport.serializeUser((user, done) => {
    //dai dien cho nguoi dung luu ra cooki, chon truong lau usr (username o databaydo)
    done(null, user.usr);
})





app.listen(3000, console.log('server tao port 3000 tren app'));