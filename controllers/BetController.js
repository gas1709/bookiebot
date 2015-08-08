var Q = require('q');
var BetService = require('../services/BetService');
var Bet = require('../models/Bet');
var betService = new BetService(Bet);

var BetController = function (botService) {
	var self = this;
	this.botService = botService;

	this.botService.use('/new_wager', function (message) {

		var replyKeyboardHide = {
			"hide_keyboard": true,
			"selective": true
		}

		Q.try(function () {
			return self.botService.bookieBot.sendMessage({
				"chat_id": message.chat.id,
				"text": "I am creating a new wager. First, reply to this message with your wager (max. 250 characters).",
				"reply_to_message_id": message.message_id
			});
		})
		.then(function (wagerMessage) {
			return [wagerMessage, self.botService.waitForReply(wagerMessage.message_id, message.from.id, 30000)];
		})
		.spread(function (wagerMessage, wagerMessageReply) {
			if (wagerMessageReply.text.length > 250)
				throw new Error('notvalid');

			var keyboardLayout = [
				["Boolean"],
				["Datetime"],
				["Number"]
			]
			var replyKeyboardMarkup = {"keyboard": keyboardLayout, "one_time_keyboard": true, "selective": true};

			return [wagerMessage, wagerMessageReply, self.botService.bookieBot.sendMessage({
				"chat_id": message.chat.id,
				"text": "Okay great! What are the possible outcomes people can bet on?",
				"reply_to_message_id": wagerMessageReply.message_id,
				"reply_markup": replyKeyboardMarkup
			})];
		})
		.spread(function (wagerMessage, wagerMessageReply, outcomeMessage) {
			return [wagerMessage, wagerMessageReply, outcomeMessage, self.botService.waitForReply(outcomeMessage.message_id, message.from.id, 30000)];
		})
		.spread(function (wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply) {
			return [wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply, self.botService.bookieBot.sendMessage({
				"chat_id": message.chat.id,
				"text": "Almost done! What's at stake? Please reply to this message with a number (1-10).",
				"reply_to_message_id": outcomeMessageReply.message_id,
				"reply_markup": replyKeyboardHide
			})];
		})
		.spread(function (wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply, stakeMessage) {
			return [wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply, stakeMessage, self.botService.waitForReply(stakeMessage.message_id, message.from.id, 30000)];
		})
		.spread(function (wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply, stakeMessage, stakeMessageReply) {
			if (isNaN(stakeMessageReply.text) || stakeMessageReply.text <= 0 || stakeMessageReply.text > 10)
				throw new Error('notvalid');

			return [wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply, stakeMessage, stakeMessageReply, betService.placeWager(stakeMessageReply.from.id, message.chat.id, {
				"wager": wagerMessageReply.text,
				"outcomes": outcomeMessageReply.text,
				"stake": stakeMessageReply.text
			})];
		})
		.spread(function (wagerMessage, wagerMessageReply, outcomeMessage, outcomeMessageReply, stakeMessage, stakeMessageReply, wager) {
			self.botService.bookieBot.sendMessage({
				"chat_id": message.chat.id,
				"text": "Beautiful! This is what your wager looks like, I hope that's okay!\n\nThe wager: " + wager.wager + '\nThe outcomes: ' + wager.outcomes + '\nThe stakes: ' + wager.stake,
				"reply_to_message_id": stakeMessage.message_id
			})
		})
		.catch(function (error) {
			if (error.message === 'timeout') {
				self.botService.bookieBot.sendMessage({
					"chat_id": message.chat.id,
					"text": "Hey! I'm a busy guy!\n\nPlease reply faster next time...",
					"reply_to_message_id": message.message_id,
					"reply_markup": replyKeyboardHide
				})
			} else if (error.message === 'notvalid') {
				self.botService.bookieBot.sendMessage({
					"chat_id": message.chat.id,
					"text": "Hey! Your input is invalid!\n\nPlease try again /new_wager.",
					"reply_to_message_id": message.message_id,
					'reply_markup': replyKeyboardHide
				})
			} else {
				console.log(error);
			}
		});

	});

	this.botService.use('/wagers', function (message) {

		Q.try(function () {
			return betService.getByChatId(message.chat.id);
		})
		.then(function (wagers) {
			if (wagers.length === 0) {
				return [wagers, self.botService.bookieBot.sendMessage({
					"chat_id": message.chat.id,
					"text": "Nope, there are no wagers here!\n\nAre you up for one? Use /new_wager.",
					"reply_to_message_id": message.message_id
				})];
			} else {
				var template = "Okay. These are all the currently opened wagers\n\n";
				wagers.forEach(function (wager, index) {
					template += (index + 1) + ". " + wager.wager + "\n";
				});
				return [wagers, self.botService.bookieBot.sendMessage({
					"chat_id": message.chat.id,
					"text": template,
					"reply_to_message_id": message.message_id
				})];
			}
		})
		.spread(function (wagers, wagersMessage) {

		})
		.catch(function (error) {
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