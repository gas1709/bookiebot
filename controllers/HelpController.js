var HelpController = function (botService) {
	var self = this;
	this.botService = botService;

	var help = "Hello there! I am @BookieBot, I can help you and your friends manage wagers, bets and rewards!\n\nYou can control me by sending these commands:\n\n/help - Not sure what to do?\n/new_wager - Create a new wager\n/wager - List current wagers";

	this.botService.use('/help', function (from) {
		self.botService.bookieBot.sendMessage({
			"chat_id": from.chat.id,
			"text": help,
			"reply_to_message_id": from.message_id
		})
	});

	this.botService.use('/start', function (from) {
		self.botService.bookieBot.sendMessage({
			"chat_id": from.chat.id,
			"text": help,
			"reply_to_message_id": from.message_id
		})
	});

	return this.botService;
}

module.exports = HelpController;