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

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

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

//routes
app.get('/', index.view);
app.get('/display', index.display);

app.post('/getFbData', function(req, res) {
  console.log(req.body.query);

  var searchOptions = {
          q:     req.body.query,
          type:  "post",
          limit: 20
  }; 

  graph.search(searchOptions, function(err, fbRes) {
    console.log(fbRes);
    res.render('fbData', fbRes);
  });
});

app.post('/getTwitterData', function(req, res) {

  T.get('search/tweets', {q: req.body.query, count: 20}, function(err, twitRes) {
    if(err) {
      console.dir(err);
    } else {
      console.log(twitRes);
      res.render('tweets', twitRes);
    }
  });
});

var conf = {
    client_id:      '519903591442854'
  , client_secret:  '52b53b73220f6fe48a3b30166f7ceaef'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
  , redirect_uri:   'http://cogs121-plzrespond.herokuapp.com/auth/facebook'
};

app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }
  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/display');
  });
});
