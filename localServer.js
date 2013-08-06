// start a local server for development
var connect = require('connect'),
    app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(__dirname));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening to port %s. Open \'http://localhost:%s\'', port, port);
});

