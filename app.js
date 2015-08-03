config = require('./config/nconf');
log4js = require('log4js');
log4js.configure(config.get('logs'));
var logger = log4js.getLogger('default');

var Telegram = require('telegram-bot-api');
var mongoose = require('mongoose');
var mongodb = require('./config/mongodb');

var telegramBot = new Telegram({
	token: process.env.TOKEN,
	updates: {
		enabled: true
	}
});

var BotService = require('./services/BotService');
var botService = new BotService(telegramBot);

var BetController = require('./controllers/BetController');
var betController = new BetController(botService);

botService.listen();