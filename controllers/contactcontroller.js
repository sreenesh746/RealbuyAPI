function contactController () {
    var contact = require('../models/contact');
    // Creating New Contact Us Message
    this.createContact = function (req, res, next) {
        var contactUs=req.params;
        var newContact = new contact(contactUs);
        newContact.save(function(err, result) {
            if (err) {
                console.log(err);
                return res.json({'error':err}); 
            }
            else {
                return res.json({'result':result,'status':'successfully saved'});
            }
        });
    };
    // Fetching Details of Contact Us Messages
    this.getContactUs = function (req, res, next) {
        contact.find({}, function(err, result) {
            if (err) {
                console.log(err);
                return res.json({'error':err}); 
            }
            else {
                return res.json({'contact Us Details':result});
            }
        });
    };
    return this;
};

module.exports = new contactController();
