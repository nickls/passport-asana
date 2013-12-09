/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Asana authentication strategy authenticates requests by delegating to
 * Asana using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Asana application's client id
 *   - `clientSecret`  your Asana application's client secret
 *   - `callbackURL`   URL to which Asana will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new AsanaStrategy({
 *         clientID: '1234567890123',
 *         clientSecret: '5ddf23ae77cbe6bff02430f8f37c4900'
 *         callbackURL: 'https://www.example.com/auth/asana/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         // Find user or create.
 *          return done(null, profile);
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://app.asana.com/-/oauth_authorize';
  options.tokenURL = options.tokenURL || 'https://app.asana.com/-/oauth_token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'Asana';

  //Set AuthMethod as 'Bearer' (used w/ accessToken to perform actual resource actions)
  //http://developer.asana.com/documentation/#Authentication
  this._oauth2.setAuthMethod('Bearer');

  //Make sure that it is used when performing a userinfo request:
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Asana.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *   - `emails`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://app.asana.com/api/1.0/users/me?opt_fields=id,name,email', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body).data;

      var profile = { provider: 'Asana' };
      profile.id = json.id;
      profile.displayName = json.name;
      profile.emails = [{ value: json.email }];
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;