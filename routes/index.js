// Get all of our friend data
var data = require('../data.json');

exports.view = function(req, res) {
	res.render('index');
}

exports.display = function(req, res) {
	res.render('display', data);
}