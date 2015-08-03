var EventEmitter = require('events').EventEmitter;

var BotService = function (telegramBot) {
	this.telegramBot = telegramBot;
	this.routes = [];
	this.listener;
};

BotService.prototype = new EventEmitter;

BotService.prototype.use = function(command, callback) {
	this.routes.push(command);
	this.on(command, function (data) {
		callback(data);
	});
};

BotService.prototype.listen = function() {
	var self = this;

	this.telegramBot.on('message', function (data) {
		var split = data.text.split(" ");

		if (/[@\w]+/.test(split[0]) && self.routes.indexOf(split[1]) !== -1) {
			data.command = split[1];
			split.shift();
			split.shift();
			data.text = split.join(" ");

			self.emit(data.command, data);
		} else if (self.routes.indexOf(split[0]) !== -1) {
			data.command = split[0];
			split.shift();
			data.text = split.join(" ");

			self.emit(data.command, data);
		}
	});
};

module.exports = BotService;