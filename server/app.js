var cluster = require('cluster');

if (cluster.isMaster) {
    var os = require('os');

    var cpuCount = os.cpus().length;
    for (var i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('worker %d exited, restarting',
            worker.id);
        cluster.fork();
    });
}
else {
    var express = require('express');
    var path = require('path');
    var cors = require('cors');
    var bodyParser = require('body-parser');

    var routes = require('./routes/index');

    var app = express();

    // view engine setup
    app.set('view engine', 'jade');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);

    console.log('server %d running', cluster.worker.id);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    
    app.listen(3000);
    
    module.exports = app;
}


