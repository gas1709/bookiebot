var Q = require('q');

var BetService = function (wagerRepository) {
	this.wagerRepository = wagerRepository;
};

/**
 * Places a wager
 * @param  {String} user_id The id of the user the wager belongs to
 * @param  {String} chat_id The id of the chat the wager belongs to
 * @param  {String} wager   The wager itself
 * @return {Promise -> Wager} Returns a promise with the saved wager
 */
BetService.prototype.placeWager = function (user_id, chat_id, wager, outcomes, stake) {
	var deferred = Q.defer();
	var wagerRepository = this.wagerRepository;

	var wager = new wagerRepository({
		"belongs_to": {
			"user_id": user_id,
			"chat_id": chat_id
		},
		"outcomes": wager.outcomes,
		"stake": wager.stake,
		"wager": wager.wager
	});

	wager.save(function (error, success) {
		if (error)
			deferred.reject(error);

		deferred.resolve(success);
	});

	return deferred.promise;
};

BetService.prototype.getByChatId = function(chat_id) {
	var deferred = Q.defer();
	var wagerRepository = this.wagerRepository;

	wagerRepository.find({
		"belongs_to.chat_id": chat_id.toString()
	}, function (error, success) {
		if (error)
			deferred.reject();
		else
			deferred.resolve(success);
	});

	return deferred.promise;
};

BetService.prototype.getByUserId = function(user_id) {
	var deferred = Q.defer();

	wagerRepository.find({
		"belongs_to.user_id": chat_id.toString()
	}, function (error, success) {
		if (error)
			deferred.reject();
		else
			deferred.resolve(success);
	});

	return deferred.promise;
};

module.exports = BetService;