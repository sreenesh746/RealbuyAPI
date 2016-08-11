function contactController() {
    var log = require('../logger');
    var contact = require('../models/contact');
    // Creating New Contact Us Message
    this.createContact = function(req, res, next) {
        var contactUs = req.params;
        var newContact = new contact(contactUs);
        newContact.save(function(err, result) {
            if (err) {
                log.error(err);
                return res.json(400,{
                    'error': 'Bad Request'
                });
            } else {
                log.info('successfully posted');
                return res.json({
                    'result': result,
                    'status': 'successfully saved'
                });
            }
        });
    };
    // Fetching Details of Contact Us Messages
    this.getContactUs = function(req, res, next) {
        contact.find({}, function(err, result) {
            if (err) {
                log.error(err);
                return res.json({
                    'error': err
                });
            } else {
                log.info('successfully Retrieved');
                //TODO: why is the json key a sentence, it should be a key
                return res.json({
                    'contact Us Details': result
                });
            }
        });
    };
    return this;
};

module.exports = new contactController();