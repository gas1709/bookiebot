var BetService = require('../services/BetService');
var Bet = require('../models/Bet');

var BetController = function (botService) {
	this.botService = botService;

	this.botService.use('/place_bet', function (message) {
		var betService = new BetService(Bet);
		betService.placeBet(message.text)
			.then(function (success) {
				console.log("A bet has been placed");
			})
			.fail(function (error) {
				console.log(error);
			});
	});

	return this.botService;
};

module.exports = BetController;