var async = require('async');
var { MongoClient } = require('mongodb');
var url = require('url');

var mongourl = "mongodb://localhost:27017/Book";



module.exports =  {
  	defaultRoute: ( req, res, next ) => {
      async.waterfall( [
        ( cb ) => {
          MongoClient.connect( mongourl, ( err, db ) => {
            if( err ) throw err;
            cb( null, db );
          })
        },
        ( db, cb ) => {
          db.collection('book').find({tags:eval("/^童话/")},{_id:0}).toArray(( err, result ) => {
            cb( null, result );
          })
        }
      ], ( err, result ) => {
        if( err ) throw err;
        var length = result.length;
        console.log( result );
      res.render('FairyTale', { 
        result,
        length
        });
    })
    
      
  }
};

