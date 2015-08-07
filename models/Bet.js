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
	}
});

module.exports = mongoose.model('Bet', betSchema);