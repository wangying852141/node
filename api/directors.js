module.exports = (req, res, next) => {
	
  	defaltRoute: (req, res, next) => {
  	res.render('user', { title: '用户管理' });
	}
};

