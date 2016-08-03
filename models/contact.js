	// Model for contact US message
	var mongoose = require('../db').mongoose;
	var contactSchema = mongoose.Schema({
		name: {type: String, required: true},
		email: {type: String, required: true},
		phone: {type: Number, required: true},
		message: {type: String, required: true}

	});

	module.exports = mongoose.model('contact', contactSchema);

	
