var BetService = require('../services/BetService');
var Bet = require('../models/Bet');

var BetController = function (botService) {
	var self = this;
	this.botService = botService;

	this.botService.use('/place_bet', function (from) {
		var betService = new BetService(Bet);
		betService.placeBet(from.text)
			.then(function (success) {
				console.log("A bet has been placed");
			})
			.fail(function (error) {
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