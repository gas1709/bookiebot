var EventEmitter = require('events').EventEmitter;
var Q = require('q');

var BotService = function (bookieBot) {
	this.bookieBot = bookieBot;
	this.commands = [];
	this.listener;
};

BotService.prototype = new EventEmitter;

/**
 * Adds commands to listen to
 * @param  {String}   command  The given command, make sure to use a /
 * @param  {Function} callback The callback function
 * @return {Callback}          Returns a callback with the message
 */
BotService.prototype.use = function(command, callback) {
	this.commands.push(command);
	this.on(command, function (message) {
		callback(message);
	});
};

/**
 * Listens to the in this.use() given commands
 * Emits to the command's event on success
 */
BotService.prototype.listen = function() {
	var self = this;

	this.bookieBot.on('message', function (message) {

		var originalMessage = message;

		if (message.chat.title && /@BookieBot/.test(message.text)) {
			self.commands.forEach(function (command) {
				if (message.text && message.text.replace('@BookieBot', '').trim() === command)
					self.emit(command, originalMessage);
			});
		} else {
			self.commands.forEach(function (command) {
				if (message.text && message.text.trim() === command)
					self.emit(command, originalMessage);
			});
		}

	})
	.start();
};

/**
 * Wait for a specific reply
 * @param  {String} message_id            The message which is waiting for a reply
 * @param  {String} user_id               The user id of the reply we are waiting for
 * @param  {Number} timeoutInMilliseconds A timeout in milliseconds
 * @return {Promise -> message}			  Returns a promise with the reply message
 */
BotService.prototype.waitForReply = function(message_id, timeoutInMilliseconds) {
	var self = this;
	var deferred = Q.defer();
	var timeout = setTimeout(function () {
		self.bookieBot.removeListener('message', callback);
		deferred.reject();
	}, timeoutInMilliseconds);

	var callback = function (message) {
		if (message.reply_to_message && message.reply_to_message.message_id === message_id) {
			self.bookieBot.removeListener('message', callback);
			clearTimeout(timeout);
			deferred.resolve(message);
		}
	}
	this.bookieBot.on('message', callback);

	return deferred.promise;
};

module.exports = BotService;