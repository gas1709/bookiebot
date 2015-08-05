config = require('./config/nconf');
log4js = require('log4js');
log4js.configure(config.get('logs'));
var logger = log4js.getLogger('default');

var Telegram = require('node-telegram-bot');
var mongoose = require('mongoose');
var mongodb = require('./config/mongodb');

var BookieBot = new Telegram({token: process.env.TOKEN});

var BotService = require('./services/BotService');
var botService = new BotService(BookieBot);

var BetController = require('./controllers/BetController');
var betController = new BetController(botService);

botService.listen();