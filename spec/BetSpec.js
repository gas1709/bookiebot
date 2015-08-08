var Q = require('q');
var db = require('../config/mongodb');
var mockgoose = require('mockgoose');
var Bet = require('../models/Bet');
var BetService = require('../services/BetService');

describe("The bet service", function () {

	var _success;
	var user_id = "123124214124";
	var chat_id = "-123123";
	var wager = {
		"wager": "Wanneer krijgt Jack eindelijk werk?",
		"outcomes": "Datetime",
		"stake": 3
	}
	var betService = new BetService(Bet);

	mockgoose(db);

	beforeEach(function (done) {

		var findBet = function (bet) {
			var deferred = Q.defer();

			Bet.find(bet, function (error, success) {
				if (error)
					deferred.reject(error);

				deferred.resolve(success);
			});

			return deferred.promise;
		};

		betService.placeWager(user_id, chat_id, wager)
			.then(function (success) {
				return findBet(success);
			})
			.then(function (success) {
				_success = success;
				done();
			})
			.catch(function (error) {
				console.log(error);
				done();
			})
			.done();

	});

	it("should save the bet", function (done) {
		expect(_success.length).not.toEqual(0);
		expect(_success.length).toEqual(1);

		expect(_success[0].belongs_to.user_id).toBeDefined();
		expect(_success[0].belongs_to.user_id).not.toBe(null);
		expect(_success[0].belongs_to.user_id).toEqual(user_id);

		expect(_success[0].belongs_to.chat_id).toBeDefined();
		expect(_success[0].belongs_to.chat_id).not.toBe(null);
		expect(_success[0].belongs_to.chat_id).toEqual(chat_id);

		expect(_success[0].outcomes).toBeDefined();
		expect(_success[0].outcomes).not.toBe(null);
		expect(_success[0].outcomes).toEqual(wager.outcomes.toLowerCase());

		expect(_success[0].stake).toBeDefined();
		expect(_success[0].stake).not.toBe(null);
		expect(_success[0].stake).toEqual(wager.stake);

		expect(_success[0].wager).toBeDefined();
		expect(_success[0].wager).not.toBe(null);
		expect(_success[0].wager).toEqual(wager.wager);

		expect(_success[0]._id).toBeDefined();
		expect(_success[0]._id).not.toBe(null);

		done();
	});

});