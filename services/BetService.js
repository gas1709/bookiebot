var Q = require('q');

var BettingService = function (betRepository) {
	this.betRepository = betRepository;
};

BettingService.prototype.placeBet = function (wager) {
	var deferred = Q.defer();
	var betRepository = this.betRepository;

	var bet = new betRepository({
		wager: wager
	});

	bet.save(function (error, success) {
		if (error)
			deferred.reject(error);

		deferred.resolve(success);
	});

	return deferred.promise;
};

module.exports = BettingService;