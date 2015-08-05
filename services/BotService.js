var EventEmitter = require('events').EventEmitter;

var BotService = function (bookieBot) {
	this.bookieBot = bookieBot;
	this.routes = [];
	this.listener;
};

BotService.prototype = new EventEmitter;

BotService.prototype.use = function(command, callback) {
	this.routes.push(command);
	this.on(command, function (message) {
		callback(message);
	});
};

BotService.prototype.listen = function() {
	var self = this;

	this.bookieBot.on('message', function (message) {
		var split = message.text.split(" ");
		
		if (/[@\w]+/.test(split[0]) && self.routes.indexOf(split[1]) !== -1) {
			message.command = split[1];
			split.shift();
			split.shift();
			message.text = split.join(" ");

			self.emit(message.command, message);
		} else if (self.routes.indexOf(split[0]) !== -1) {
			message.command = split[0];
			split.shift();
			message.text = split.join(" ");

			self.emit(message.command, message);
		}
	})
	.start();
};

module.exports = BotService;