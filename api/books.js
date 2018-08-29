var async = require('async');
var { MongoClient } = require('mongodb');
var url = require('url');

var mongourl = "mongodb://localhost:27017/Book";

module.exports = {
	
  	defaultRoute: ( req, res, next ) => {
  		async.waterfall( [
  			( cb ) => {
  				MongoClient.connect( mongourl, ( err, db ) => {
  					if( err ) throw err;
  					cb( null, db );
  				})
  			},
  			( db, cb ) => {
  				db.collection('book').find({},{_id:0}).toArray(( err, result ) => {
  					cb( null, result );
  				})
  			}
  		], ( err, result ) => {
  			if( err ) throw err;
  			var length = result.length;
  			res.send( result );
			  ;
		})
		
  		
	},
  pagingRoute: ( req, res, next ) => {
    
      var { limitNum, skipNum } = url.parse( req.url, true ).query;
      limitNum = limitNum*1 || 5;
      skipNum = skipNum*1 || 0;
      
        async.waterfall( [
          ( cb ) => {
            
            MongoClient.connect( mongourl, ( err, db ) => {
              if( err ) throw err;
              cb( null, db ); 
            })
            
          },
          ( db, cb ) => {
            
            db.collection('book').find({},{_id:0}).toArray(( err, res ) => {
              var len = res.length;
              var data = res.splice( limitNum * skipNum, limitNum );
              cb( null, {
                len,
                data
              })
              db.close();
            })
            
          }
        ], ( err, result ) => {
          
          res.send(result.data)
      })
    
      
  },
	deleteRoute: ( req, res, next ) => {
		var{ id, limitNum, skipNum } = url.parse( req.url, true ).query;
		async.waterfall( [
  			( cb ) => {
  				
  				MongoClient.connect( mongourl, ( err, db ) => {
  					if( err ) throw err;
  					cb( null, db );	
  				})
  				
  			},
  			( db, cb ) => {
  				
  				db.collection('casts').deleteOne( { id: id }, ( err, result ) => { 
  					if( err ) throw err;
  					cb( null, 'ok' );
  					db.close();
  				})
  				
  			}
		], ( err, result ) => {
			if( err ) throw err;
			if( result == 'ok' ){
				skipNum = skipNum == 0 ? 0 : skipNum - 1;
				res.redirect( '/castspaging?limitNum='+limitNum+'&skipNum='+skipNum );
			}
		})
	},
    addRoute: ( req, res, next ) => {
    	res.render('casts_add');
    },
    updataCastRoute: ( req, res, next ) => {
    	async.waterfall( [
    		( cb ) => {
    			MongoClient.connect( mongourl, ( err, db ) => {
    				if( err ) throw err;
    				cb( null, db );
    			})
    		},
    		( db, cb ) => {
    			db.collection( 'casr' )
    		}
    	], ( err, result ) => {
    		if( err ) throw err;
    	})
    },
    getBookDetail: ( req, res, next ) => {
      var { id } = url.parse( req.url, true ).query;
      async.waterfall( [
        ( cb ) => {
          MongoClient.connect( mongourl, ( err, db ) => {
            if( err ) throw err;
            cb( null, db );
          });
        },
        ( db, cb ) => {
          db.collection('book').find( { id:id }, {} ).toArray( ( err, res ) => {
            if( err ) throw err;
            cb( null, res);
            db.close();
          } );
        }
      ], ( err, result ) => {
        if( err ) throw err;
        var len = result.length;
        res.send(result);
      })
    }    
}
