var express = require('express');
var app1 = express();
var server1 = require('http').createServer(app1);
app1.set('view engine', 'ejs');
app1.set('views', './views');
server1.listen(2700, console.log('ket noi server app1  kiemtra port 2700'));
app1.get('/', function(req, res){
  //res.send("<font color=red>hello</font>");
 // res.sendFile(__dirname + '/data.html');
 res.render('chitiet');
});