function propertyController () {
	var property = require('../models/property');
	var user = require('../models/user');
	var fs=require('fs');
	var async = require('async');
	// Creating New Property
	this.createProperty = function (req, res, next) {
		var propertyDetails = req.params;
		propertyDetails.owner=req.user._id;
		location=[propertyDetails['lng'],propertyDetails['lat']];
		delete propertyDetails['lng'];
		delete propertyDetails['lat'];
		propertyDetails['location']=location;
		propertyDetails['photo']='http://localhost:9001/uploads/properties/'+Date.now()+req.files.photo.name;
		var newProperty = new property(propertyDetails);
		newProperty.save(function(err, result) {
			if (err) {
				console.log(err);
				return res.send({'error':err});	
			}
			else {
					fs.rename(req.files.photo.path, './uploads/properties/'+Date.now()+req.files.photo.name, function(err){
					if(err)
						return console.error(err);		
					});
        	res.send({'result':result,'status':'successfully saved'});
        	user.findOneAndUpdate(
		    {_id: result.owner},
		    {$push: {properties: result._id}},
		    {},
		    function(err, result) {
		    	if(err){
		        console.log(err);
		    	return res.send(err);
		    	}
		    	else{
		    	return res.send({'Property added':result});
		    	}
		    });
      		}
		});
	};

	this.search = function(req,res,next)
	{
		console.log(req.params);
		property.find({
    		$and : [
        	{ $or : [ { saleType : req.params.option }, { availability : req.params.option } ] },
        	{ $text: { $search:  req.params.keywords} }
    		] },
        	function(err,result){
			if(err){
		        console.log(err);
		    	return res.send(err);
		    	}
		    	else{
		    	return res.send({'Search result':result});
		    	}

		});

	};
 
  	// Fetching Details of Properties
  	this.getProperties = function (req, res, next) {
	   	async.parallel([
		    function(callback){
		       property.find({}).skip(req.params.page*6).limit(6).sort({favCount : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'COMMERCIAL'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'FURNISHED HOMES'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'LAND AND PLOT'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'RENTAL'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		   
			],
		function(err, results){
	    res.json({featured:results[0],commercial:results[1], furnishedHomes: results[2], landAndPlot : results[3],
	    rental: results[4]});
	   
		});
  	};

  	this.getPropertiesAuthorized = function (req, res, next) {
	   	async.parallel([
		    function(callback){
		       property.find({}).skip(req.params.page*6).limit(6).sort({favCount : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'COMMERCIAL'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'FURNISHED HOMES'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'LAND AND PLOT'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		    function(callback){
		        property.find({propertyType: 'RENTAL'}).limit(9).sort({addedOn : -1}).exec(callback);
		    },
		   	function(callback){
		   		user.find({_id:req.user._id}).select('favourites').exec(callback);
		   	}
			],
		function(err, results){
	    res.json({featured:results[0],commercial:results[1], furnishedHomes: results[2], landAndPlot : results[3],
	    rental: results[4], favourites: results[5]});
		});
  	};
return this;
};
 
module.exports = new propertyController();