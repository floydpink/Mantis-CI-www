// start a local server for development
var connect = require('connect'),
    app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(__dirname));

app.listen(3000);
console.log('Listening to port 3000. Open \'http://localhost:3000\'');
