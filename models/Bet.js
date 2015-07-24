var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var betSchema = new Schema({
	wager: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Bet', betSchema);