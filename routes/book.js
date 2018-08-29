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
  			console.log( result.author );
			res.render('book', { 
				result,
				length,
				limitNum: length,
				skipNum: 0,
				totalNum: 1
				});
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
  			
  			if( err ) throw err;
  			var length = result.data.length;
  			var totalNum = Math.ceil( result.len / limitNum );
  			skipNum = skipNum + 1;
  			
			res.render('book', { 
				result: result.data,
				length,
				totalNum,
				skipNum,
				limitNum
				});
				
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
  				
  				db.collection('book').deleteOne( { id: id }, ( err, result ) => { 
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
    	res.render('book_add');
    },
    updateCastsRoute: ( req, res, next ) => {
        var { id, limitNum, skipNum } = url.parse( req.url, true ).query;
        async.waterfall( [
          ( cb ) => {
            MongoClient.connect( mongourl, ( err, db ) => {
              if ( err ) throw err;
              cb( null, db );
            })
          },
          ( db, cb ) => {
            db.collection('book').find( {id: id}, {_id: 0} ).toArray( ( err, res ) => {
              if ( err ) throw err;
              cb( null, res );
              db.close();
            })
          }
        ], ( err, result ) => {
            //此处拿到的是只有一个元素的数组，所以为result[0]
            var { id, name, alt } = result[0];
            var img = result[0].avatars.small
          res.render('book_update', {
            id,
            name,
            alt,
            img,
                limitNum,
                skipNum
          });
        })
      // res.render('casts_update')
    },
    updateCastsAction: ( req, res, next) => {
        var obj = req.body;
        obj.avatars = {
　　　　　　　"small":obj.img,
　　　　　　　"large":obj.img,
　　　　　　　"medium":obj.img
　　　　 };
        var whereObj = {
            id: obj.id
        };
        var updateObj = {
            $set: {
                id: obj.id,
                avatars: obj.avatars,
                name: obj.name,
                alt: obj.alt
            }
        };
        
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongourl, ( err, db ) =>{
                   if ( err ) throw err;
                   cb( null, db );
                });
            },
            ( db, cb ) => {
                db.collection('casts').updateOne( whereObj, updateObj, ( err, res ) => {
                    if ( err ) throw err;
                    cb( null, 'ok');
                })
            }
        ], ( err, result ) =>{
            if ( err ) throw err;
            if( result == 'ok') {
                // res.send('<script> history.go(-2); location.reload()</script>')
                var skipNum = obj.skipNum == 0 ? 0 : obj.skipNum - 1;
                res.redirect('/castspaging?limitNum='+obj.limitNum+'&skipNum='+skipNum);
            }
        })
    }
}
