var url = require('url');
var { MongoClient } = require('mongodb');
var async = require('async');

var mongourl = "mongodb://localhost:27017/Data";

module.exports = {
	
  	defaultRoute: (req, res, next) => {
  	 res.render('login');
	},
	adminLoginAction: ( req, res, next ) =>{
		var { username, password } = req.body;
		async.waterfall( [
			( cb ) => {
				MongoClient.connect( mongourl, ( err, db ) => {
					if( err ) throw  err;
					cb( null, db );
				});
			},
			( db, cb ) => {
				db.collection('admin').find( { username, password }, {} ).toArray( ( err, res ) => {
					if( err ) throw err;
					if( res.length > 0 ) {
						cb( null, 1 );
					} else {
						cb( null, 0 );
					}
					db.close();
				});
			}
			
		], ( err, result ) => {
			if( err ) throw err;
			if( result == 1 ) {
				res.cookie( 'loginState', 1 );
				res.redirect('/');
			} else {
				res.cookie( 'loginState', 0 );
				res.redirect('/');
			}
		});
	},
	adminLoginOut: ( req, res, next ) => {
		res.cookie( 'loginState', 0 );
		res.redirect('/');
	}
}

