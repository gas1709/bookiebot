var BetService = require('../services/BetService');
var Bet = require('../models/Bet');
var betService = new BetService(Bet);

var BetController = function (botService) {
	var self = this;
	this.botService = botService;

	this.botService.use('/new_wager', function (from) {

		self.reply_message_id;

		self.botService.bookieBot.sendMessage({
			"chat_id": from.chat.id,
			"text": "I am creating a new wager. Please reply to my message with your wager",
			"reply_to_message_id": from.message_id
		})
		.then(function (to) {
			return self.botService.waitForReply(to.message_id, 30000);
		})
		.then(function (reply) {
			self.reply_message_id = reply.message_id;
			return betService.placeWager(reply.from.id, from.chat.id, reply.text);
		})
		.then(function (success) {
			self.botService.bookieBot.sendMessage({
				"chat_id": from.chat.id,
				"text": "Great! You placed the following wager\n\n" + success.wager,
				"reply_to_message_id": self.reply_message_id
			});
		})
		.catch(function (error) {
			self.botService.bookieBot.sendMessage({
				"chat_id": from.chat.id,
				"text": "Hey! I'm a busy guy!\n\nPlease reply faster next time...",
				"reply_to_message_id": from.message_id
			});
		})
		.done();

	});

	this.botService.use('/wager', function (message) {

		betService.get(message.from.id, message.chat.id)
			.then(function (success) {

				if (success.length === 0) {
					self.botService.bookieBot.sendMessage({
						"chat_id": message.chat.id,
						"text": "Nope, there are no wagers here!\n\nAre you up for one? Use /new_wager.",
						"reply_to_message_id": message.message_id
					})
				} else {

					var wagers_template = "Yeah sure. These are all the currently opened wagers\n\n"

					success.forEach(function (wager) {
						wagers_template += " • " + wager.wager + "\n"
					});

					self.botService.bookieBot.sendMessage({
						"chat_id": message.chat.id,
						"text": wagers_template,
						"reply_to_message_id": message.message_id
					})
				}
			})
			.fail(function(error) {
				console.log(error);
			});

	});

	/**
	 * Testing ReplyKeyboardMarkup
	 */
	this.botService.use('/test', function (from) {

		var keyboardLayout = [
			["A", "B"],
			["C", "D"]
		]
		var replyKeyboardMarkup = {"keyboard": keyboardLayout, "one_time_keyboard": true, "selective": true};

		self.botService.bookieBot.sendMessage({
			"chat_id": from.chat.id,
			"text": "I am testing the keyboard!",
			"reply_to_message_id": from.message_id,
			"reply_markup": replyKeyboardMarkup
		})
		.then(function (to) {
			console.log('I sent a reply to:', to.reply_to_message.message_id);
		})
		.fail(function (error) {

		});

	});

	return this.botService;
};

module.exports = BetController;