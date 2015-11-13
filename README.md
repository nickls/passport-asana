passport-asana
==============

[Passport](https://github.com/jaredhanson/passport) Authentication Strategy for [Asana's API](http://developer.asana.com/) using OAuth2

<p align='center'>
<img src="https://github.com/nickls/passport-asana/raw/master/examples/login/public/example.png" height="400px" />
</p>


## Installation

    $ npm install passport-asana

## Usage

#### Configure Strategy

The Asana authentication strategy authenticates users using an Asana account and
OAuth tokens.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user, as well as `options` specifying a
client id , client secret, and callback URL.

    passport.use('Asana', new AsanaStrategy({
        clientID: '1234567890123',
        clientSecret: '5ddf23ae77cbe6bff02430f8f37c4900'
        callbackURL: 'https://www.example.com/auth/asana/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ userId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'Asana'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/asana', passport.authenticate('Asana', { failureRedirect: '/' }));

    app.get('/auth/asana/callback',
      passport.authenticate('Asana', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits
  - [Nick Lane-Smith](https://github.com/nickls)

## Thanks
  - [Jared Hanson](https://github.com/jaredhanson)
  - [Scott Hillman](https://github.com/hillmanov)
