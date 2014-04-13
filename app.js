//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
var Twit = require('twit');
var graph = require('fbgraph');

//route files to load
var index = require('./routes/index');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//routes
app.get('/', index.view);
//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var T = new Twit({
	consumer_key: '92YlXn49CPpbZ0iLROm5F1yPf',
	consumer_secret: 'exexjdtuuNbbLW7XZ7Ms0MIBuEDfBoXQHE7EzGNnCsLwB8YU33',
	access_token: '357766764-M2TZahHaw0jww8MGNiTO5N06TDHb17CBdblDWdsa',
	access_token_secret: '0tuo8SeCA95HKcdoKetlKRNmyb2rrHttbhLQPYrz5fsCC'
});

T.get('search/tweets', { q: '#tech', count: 20 }, function(err, reply) {
    if (err) {
        console.dir(err);
    } else {
        for (var i = 0; i < reply.statuses.length; i++) {
            var status = reply.statuses[i];
            console.log('*************************');
            console.log('  username: ' + status.user.name);
            console.log('   ' + status.text);
            console.log('  time/date: ' + status.created_at);
            console.log('*************************');
        }
    }
})