var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
})

var users = require('./users.js')
var admin = require('./admin.js')
var fairytale = require('./FairyTale.js')
var book = require('./book.js')
var banner = require('./banner.js')

var defaultRoute = (req, res, next) => {
	
  if( req.cookies.loginState == '1' ) {
  	res.render('index');
  } else {
  	res.render('login');
  }
  
}

/* GET home page. */
router.get('/', defaultRoute );

router.get('/casts', book.defaultRoute);
router.get('/castspaging', book.pagingRoute);
router.get('/deleteRoute', book.deleteRoute);
router.get('/addRoute', book.addRoute);

router.get('/users', users.defaultRoute);


router.get('/FairyTale', fairytale.defaultRoute);

//router.get('/movies', movies.defaultRoute);
//router.get('/sortMoviesRoute', movies.sortMoviesRoute);
//router.get('/areaQueryMoviesRoute', movies.areaQueryMoviesRoute);
//router.get('/getYearMovies', movies.getYearMovies );
//router.get('/serchMovies', movies.serchMovies );

router.get('/banner', banner.defaultRoute);
router.get('/addBannerRoute', banner.addBannerRoute);
router.post('/addBannerAction', upload.single('bannerimg'), banner.addBannerAction);

router.get('/admin', admin.defaultRoute);
router.post('/adminLoginAction', admin.adminLoginAction);
router.get('/adminLoginOut', admin.adminLoginOut);
module.exports = router;
