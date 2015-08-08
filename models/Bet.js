var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var betSchema = new Schema({
	belongs_to: {
		user_id: {
			type: String,
			required: true
		},
		chat_id: {
			type: String,
			required: true
		}
	},
	wager: {
		type: String,
		required: true
	},
	outcomes: {
		type: String,
		required: true
	},
	stake: {
		type: Number,
		required: true,
		min: 1,
		max: 10
	}
});

var Bet = mongoose.model('Bet', betSchema);

Bet.schema.path('wager').validate(function (value) {
	return value.length <= 250;
}, 'Invalid wager, too long');

Bet.schema.path('outcomes').validate(function (value) {
	return /boolean|number|datetime/i.test(value);
}, 'Invalid outcomes');

Bet.schema.pre('save', function (next) {
	this.outcomes = this.outcomes.toLowerCase();
	next();
});

module.exports = mongoose.model('Bet', betSchema);