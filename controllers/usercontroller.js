var log = require('../logger');
var dbHelper = require('../helpers/userdbhelper');
function userController() {

    this.createUser = function(req, res) {
        var profile = req.params;
        log.info(profile);
        var currentDateTime=Date.now();
        profile['photo'] = './uploads/profile/' + currentDateTime + req.files.avatar.name;
        req.profile = profile;
        dbHelper.addUser(req,res,function(err,result){
            if(err)
            {
                log.error(err);
                res.json(result.status,{message:result.message});
            }
            else
            {
                res.json(result.status,{message:result.message,data:result.data});
            }
            
        });
    };
    this.login = function(req, res) {
        dbHelper.authenticateUser(req,res);
    };
    this.updateFavourite = function(req, res) {
       dbHelper.updateFavourite(req,res);
    };

    return this;
};

module.exports = new userController();