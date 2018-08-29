var url = require('url');

var async = require('async');
var { MongoClient } = require('mongodb');

var mongourl = "mongodb://localhost:27017/Book";
var { sendCode } = require('./mycode.js')
module.exports = {
	defaultRoute: ( req, res, next ) => {
	 res.render('user');
	},
  getPhoneCode( req, res, next ){
    var { phoneNum } = url.parse( req.url, true ).query;
    async.waterfall( [
      ( cb ) => {
        MongoClient.connect( mongourl, ( err, db ) => {
          if ( err ) throw err;
          cb( null, db);
        })
      },
      ( db, cb ) => {
        db.collection('user').find({phoneNum},{_id:0}).toArray( ( err, res ) => {
          if ( err ) throw err;
          if( res.length == 0 ) {
            cb( null, 1);
          }else {
            cb( null, 0);
          }
          db.close();
        })
      }
    ], ( err, result ) => {
      if ( err ) throw err;
      if( result == 1) {
        sendCode({
          phoneNum,
          code:'3456',
          success:function(data){
            if(data == "ok"){
              res.send({
                state:1,
                code: '3456'
              })
            }
          }
        })
      }else{
        res.send("0")
      }
    })
    
  },
  registerUserAction( req, res, next ){
    var { phoneNum, password } = req.body;
    async.waterfall( [
    	( cb ) => {
    		MongoClient.connect( mongourl, ( err, db ) => {
    			if ( err ) throw err;
    			cb( null, db);
    		})
    	},
    	( db, cb ) => {
    		db.collection('user').insert({phoneNum, password}, ( err, res ) =>{
          if ( err ) throw err;
          cb( null, 'ok');
          db.close()
        })
    	}
    ], ( err, result ) => {
      if ( err ) throw err;
       if ( result == "ok" ){
         res.send("1")
       }else{
         res.send("0")

       }
    })
  },
  loginUserAction( req, res, next ) {
    var { phoneNum, password } = url.parse( req.url, true ).query;
    async.waterfall( [
      ( cb ) => {
        MongoClient.connect( mongourl, ( err, db ) => {
          if ( err ) throw err;
          cb( null, db);
        })
      },
      ( db, cb ) => {
        db.collection('user').find({phoneNum, password}, {} ).toArray(( err, result ) => {
          if( err ) throw err;
          cb( null, result )
        })
      }
    ], ( err, result ) => {
      if ( err ) throw err;
       if ( result.length > 0 ){
         res.send("1")
       }else{
         res.send("0")

       }
    })
  }
}
