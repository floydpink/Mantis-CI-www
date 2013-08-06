// start a local server for development
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000 /*,
    serveroot = function (req, res) {
      return res.sendfile('index.html');
    } */;

app.use(express.logger('dev'));
app.use(express.static(__dirname));
/*
app.use(app.router);
app.get('*', serveroot);
app.head('*', serveroot);
*/

app.listen(port, function () {
  console.log('Listening to port %s. Open \'http://localhost:%s\'', port, port);
});

