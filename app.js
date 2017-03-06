/**
 * Created by pmcc on 16/10/8.
 */
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));


var server = app.listen(4500,function(){
   var host = server.address().address;
   var port = server.address().port;

   console.log(' app listening at http://%s:%s', host, port);

});
