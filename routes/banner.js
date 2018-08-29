var async = require('async');
var { MongoClient } = require('mongodb');
var fs = require('fs');
var url = require('url');

var mongourl = "mongodb://localhost:27017/Data"

module.exports = {
	
  	defaultRoute: (req, res, next) => {
  	res.render('banner');
	},
	addBannerRoute: ( req, res, next ) =>{
		res.render('banner_add');
	},
	addBannerAction: ( req, res, next ) =>{
		console.log( req.file );
		console.log( req.body );
		var bannerimg = req.file.filename + "." + req.file.mimetype.split('/')[1];
		
		var oldname = "./uploads/" + req.file.filename;
		var newname = "./uploads/" + bannerimg;
		console.log(newname);
		async.waterfall( [
			( cb ) => {
				fs.rename( oldname, newname, ( err, data ) => {
                    if ( err ) throw err;
                    cb( null, bannerimg );
                })
			},
			( bannerimg, cb ) => {
				MongoClient.connect( mongourl, ( err, db ) =>{
					if( err ) throw err;
					cb( null, bannerimg, db );
				})
			},
			( bannerimg, db, cb ) => {
				var { bannerid, bannerurl } = req.body;
				var insertObj = {
					bannerimg,
					bannerid,
					bannerurl
				};
				db.collection('banner').insert( insertObj, ( err, data ) => {
					if( err ) throw err;
					cb( null, 'ok' );
					db.close();
				})
			}
		], ( err, result ) => {
			if( err ) throw err;
			if( result == 'ok' ) {
				res.redirect('/banner');
			}
		})
	}
}

