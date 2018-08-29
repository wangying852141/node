var async = require('async');
var { MongoClient } = require('mongodb');
var url = require('url');

var mongourl = "mongodb://localhost:27017/Data";

module.exports = {
	
  	defaultRoute: (req, res, next) => {
  		async.waterfall( [
  			( cb ) => {
  				MongoClient.connect( mongourl, ( err, db ) => {
  					if( err ) throw err;
  					cb( null, db );
  				})
  			},
  			( db, cb ) => {
    			db.collection('movies').distinct( 'year', ( err,yearArr ) => {
    				if( err ) throw err;
    				cb( null, db, yearArr );
    			})
    		},
    		( db, yearArr, cb ) => {
    			db.collection('movies').find( {}, {} ).toArray( ( err, res ) => {
    				if( err ) throw err;
    				cb( null, {
    					res,
    					yearArr
    				});
    				db.close();
    			} )
    		}
  		], ( err, result ) => {
  			if( err ) throw err;
  			var len = result.res.length;
//			console.log( result );
//			res.render('movies', { 
//				result: result.res,
//				len,
//				yearArr: result.yearArr
//				});
			res.send( result.res );
		})
		
	},
	sortMoviesRoute: ( req, res, next) => {
        var { type, num } = url.parse( req.url, true ).query;
        
        var sortObj = {};// style.display   style['display']
        sortObj[type] = num*1;
        
        async.waterfall([ 
        	( cb ) => {
        		MongoClient.connect( mongourl, ( err, db ) => {
        			if ( err ) throw err;
        			cb( null, db );
        		})
        	},
          	( db, cb ) => {
    			db.collection('movies').distinct( 'year', ( err,yearArr ) => {
    				if( err ) throw err;
    				cb( null, db, yearArr );
    			})
    		},
    		( db, yearArr, cb ) => {
    			db.collection('movies').find( {}, {} ).sort( sortObj ).toArray( ( err, res ) => {
    				if( err ) throw err;
    				cb( null, {
    					res,
    					yearArr
    				});
    				db.close();
    			} )
    		}
  		], ( err, result ) => {
  			if( err ) throw err;
  			var len = result.res.length;
  			console.log( result );
			res.render('movies', { 
				result: result.res,
				len,
				yearArr: result.yearArr
			});
        })
    },
    areaQueryMoviesRoute: ( req, res, next ) => {
    	var { type, min, max } = url.parse( req.url, true ).query;
    	var whereObj = {};
    	whereObj[type] = {
    		
    		$gte: min * 1,
    		$lte: max * 1
    	}
    	async.waterfall( [
    		( cb ) => {
    			MongoClient.connect( mongourl, ( err, db ) => {
    				if( err ) throw err;
    				cb( null, db );
    			})
    		},
    		( db, cb ) => {
    			db.collection('movies').distinct( 'year', ( err,yearArr ) => {
    				if( err ) throw err;
    				cb( null, db, yearArr );
    			})
    		},
    		( db, yearArr, cb ) => {
    			db.collection('movies').find( whereObj, {} ).toArray( ( err, res ) => {
    				if( err ) throw err;
    				cb( null, {
    					res,
    					yearArr
    				});
    				db.close();
    			} )
    		}
    	], ( err, result ) => {
    		if( err ) throw err;
    		var len = result.res.length;
    		res.render( 'movies' , {
    			result: result.res,
    			yearArr: result.yearArr,
    			len
    		})
    	})
    },
    getYearMovies: ( req, res, next ) => {
    	var { year } = url.parse( req.url, true ).query;
    	async.waterfall( [
    		( cb ) => {
    			MongoClient.connect( mongourl, ( err, db ) => {
    				if( err ) throw err;
    				cb( null, db );
    			})
    		},
    		( db, cb ) => {
    			db.collection('movies').distinct( 'year', ( err, yearArr ) => {
    				if( err ) throw err;
    				cb( null, db, yearArr );
    			} )
    		},
    		( db, yearArr, cb ) => {
    			db.collection('movies').find( { year: year }, {} ).toArray( ( err, res ) => {
    				if( err ) throw err;
    				cb( null, {
    					res,
    					yearArr
    				});
    				db.close();
    			})
    		}
    	],( err, result ) => {
    		if( err ) throw err;
    		var len = result.res.length;
    		res.render( 'movies', {
    			result: result.res,
    			len,
    			yearArr: result.yearArr
    		});
    	})
    },
    serchMovies: ( req, res, next ) => {
    	var { title } = url.parse( req.url, true ).query;
    	async.waterfall( [
    		( cb ) => {
    			MongoClient.connect( mongourl, ( err, db ) => {
    				if( err ) throw err;
    				cb( null, db );
    			});
    		},
    		( db, cb ) => {
    			db.collection('movies').distinct( 'yeaar', ( err, yearArr ) => {
    				if( err ) throw err;
    				cb( null, db, yearArr );
    			});
    		},
    		( db, yearArr, cb ) => {
    			db.collection('movies').find( {title: eval("/"+title+"/") }, {} ).toArray( ( err, res ) => {
    				if( err ) throw err;
    				cb( null, {
    					res,
    					yearArr
    				});
    				db.close();
    			} );
    		}
    	], ( err, result ) => {
    		if( err ) throw err;
    		var len = result.res.length;
    		res.render( 'movies', {
    			len,
    			result: result.res,
    			yearArr: result.yearArr
    		})
    	})
    },
    getMovieDetail: ( req, res, next ) => {
      var { id } = url.parse( req.url, true ).query;
      async.waterfall( [
        ( cb ) => {
          MongoClient.connect( mongourl, ( err, db ) => {
            if( err ) throw err;
            cb( null, db );
          });
        },
        ( db, cb ) => {
          db.collection('movies').distinct( 'yeaar', ( err, yearArr ) => {
            if( err ) throw err;
            cb( null, db, yearArr );
          });
        },
        ( db, yearArr, cb ) => {
          db.collection('movies').find( { id:id }, {} ).toArray( ( err, res ) => {
            if( err ) throw err;
            cb( null, {
              res,
              yearArr
            });
            db.close();
          } );
        }
      ], ( err, result ) => {
        if( err ) throw err;
        var len = result.res.length;
        res.send(result.res);
      })
    }    
    
}

