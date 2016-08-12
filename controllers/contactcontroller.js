function contactController() {
    var log = require('../logger');
    var contact = require('../models/contact');
    this.createContact = function(req, res) {
        var contactUs = req.params;
        var newContact = new contact(contactUs);
        newContact.save(function(err, result) {
            if (err) {
                log.error(err);
                return res.json(400, {
                    error: 'Bad Request'
                });
            } else {
                log.info('successfully posted');
                return res.json({
                    status: true,
                    message: 'successfully saved'
                });
            }
        });
    };
    this.getContactUs = function(req, res) {
        contact.find({}, function(err, result) {
            if (err) {
                log.error(err);
                return res.json(500, {
                    error: err
                });
            } else {
                log.info('successfully Retrieved');
                return res.json({
                    messages: result
                });
            }
        });
    };
    return this;
};
module.exports = new contactController();