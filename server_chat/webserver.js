var http = require('http');
var fs = require('fs');
http.createServer(function(req, res) {
  // doc noi dung o data.html roi moi tra ve file html( res.end(data))
  res.writeHead(200, { "Content-Type": "text/html" });
  var data = fs.readFileSync(__dirname + '/data.html', 'utf-8');
  res.end(data);
}).listen(7777, console.log('connected server 7777'));
