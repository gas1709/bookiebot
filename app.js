config = require('./config/nconf');
log4js = require('log4js');
log4js.configure(config.get('logs'));
var logger = log4js.getLogger('default');

var Telegram = require('telegram-bot-api');
var mongoose = require('mongoose');

console.log(process.env.TOKEN);

var API = new Telegram({
	token: process.env.TOKEN,
	updates: {
		enabled: true
	}
});

API.on('message', function (message) {
	logger.info(message);
});