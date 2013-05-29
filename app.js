
var express = require('express')
  , routes = require('./routes/route')
  , flash = require('connect-flash')
  , http = require('http')
  , ejs = require('ejs');

var app = express();
var server = http.createServer(app);

//pp.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.engine('html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser()); 
app.use(express.cookieSession({secret : 'lgyCookies'}));
app.use(express.session({ secret : 'lgySession' }));
// 使用flash插件
app.use(flash());
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.message = '';
  var err = req.session.error;
  delete req.session.error;
  if (err) res.locals.message = '<div class="alert alert-info">' + err + '</div>';
  next();
});
app.use(app.router);
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));

// 开发模式
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.post('/logon', routes.logon);

app.get('/home', authentication);
app.get('/home', routes.home);

function start(){
	server.listen(8888);
	console.log("服务器启动...");
}
exports.start = start;

function authentication(req, res, next) {
  if (req.session.user == null) {
	  req.session.error='请先登录';
	  res.redirect('/login');
  }else{
	  next();
  }
}

function notAuthentication(req, res, next) {
	if (req.session.user) {
    	req.session.error='已登陆';
    	return res.redirect('/');
  	}else{
	  next();
  	}
}