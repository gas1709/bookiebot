var config = require('../config/nconf');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

mongoose.connect(
	config.get('mongodb:uri'),
	config.get('mongodb:options')
);

mongoose.connection.on('error', function (error) {
	logger.error(error.message);
});

module.exports = mongoose;