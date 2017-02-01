config = require('./config/nconf');
log4js = require('log4js');
log4js.configure(config.get('logs'));
var logger = log4js.getLogger('default');

var Telegram = require('node-telegram-bot');
var mongoose = require('mongoose');
var mongodb = require('./config/mongodb');

var BotService = require('./services/BotService');
var BetController = require('./controllers/BetController');
var HelpController = require('./controllers/HelpController');

var BookieBot = new Telegram({token: process.env.TOKEN});
var botService = new BotService(BookieBot);
var betController = new BetController(botService);
var helpController = new HelpController(botService);

botService.listen();
