var express = require('express')
  , session = require('express-session')
  , errorhandler = require('errorhandler')
  , passport = require('passport')
  , util = require('util')
  , AsanaStrategy = require('passport-asana').Strategy;

var ASANA_CLIENT_ID = "";
var ASANA_CLIENT_SECRET = "";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Asana user profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the AsanaStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Asana
//   profile), and invoke a callback with a user object.
passport.use('Asana', new AsanaStrategy({
    clientID: ASANA_CLIENT_ID,
    clientSecret: ASANA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:4000/auth/asana/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.warn(accessToken, refreshToken, profile);
    process.nextTick(function () {
      
      // To keep the example simple, the user's Asana profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Asana account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(express.logger('dev'));
app.use(errorhandler());
// app.use(express.methodOverride());
// app.use(express.cookieParser('insert-some-entropy-here'));
app.use(session({secret: 'meow mix'}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/asana
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Asana authentication will involve
//   redirecting the user to asana.com.  After authorization, asana.com will
//   redirect the user back to this application at /auth/asana/callback

app.get('/auth/asana', passport.authenticate('Asana', { failureRedirect: '/' }));



// app.get('/auth/asana',
//   passport.authenticate('Asana'),
//   function(req, res){
//     // The request will be redirected to Asana authentication, so this
//     // function will not be called.
//     console.log('you should not get here!')
//   });

// GET /auth/asana/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/asana/callback', 
  passport.authenticate('Asana', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(4000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
