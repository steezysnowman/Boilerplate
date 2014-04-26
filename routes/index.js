// Get all of our friend data
var data = require('../data.json');

exports.view = function(req, res) {
	res.render('index');
}

exports.display = function(req, res) {
	res.render('display');
}

exports.fbData = function(req, res) {
	res.render('fbData');
}

exports.twitterData = function(req, res) {
	res.render('twitterData');
}

exports.errorMessage = function(req, res) {
	res.render('index', {'errorMessage': true});
}