var Q = require('q');
var db = require('../config/mongodb');
var mockgoose = require('mockgoose');
var Bet = require('../models/Bet');
var BetService = require('../services/BetService');

describe("The bet service", function () {

	var _success;
	var wager = "Wanneer krijgt Jack eindelijk werk?";
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

		betService.placeBet(wager)
			.then(function (success) {
				return findBet(success);
			})
			.then(function (success) {
				_success = success;
				done();
			})
			.done();

	});

	it("should save the bet", function (done) {
		expect(_success.length).not.toEqual(0);
		expect(_success.length).toEqual(1);

		expect(_success[0].wager).toBeDefined();
		expect(_success[0].wager).not.toBe(null);
		expect(_success[0].wager).toEqual(wager);

		expect(_success[0]._id).toBeDefined();
		expect(_success[0]._id).not.toBe(null);

		done();
	});

});