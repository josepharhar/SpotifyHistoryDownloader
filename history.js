const SpotifyWebApi = require('spotify-web-api-node');

const secrets = require('./secrets.json');

var spotifyApi = new SpotifyWebApi({
  clientId: secrets.clientId,
  clientSecret: secrets.clientSecret,
  redirectUri: 'google.com'
});

spotifyApi.authorizationCodeGrant(secrets.authorizationCode)
  .then(function(data) {
    console.log('Retrieved access token', data.body['access_token']);

    spotifyApi.setAccessToken(data.body['access_token']);

    return spotifyApi.getMe();
  })
  .then(function(data) {
    console.log('Retrieved data for ' + data.body['display_name']);

    console.log('Email is ' + data.body.email);

    console.log('Image URL is ' + data.body.images[0].url);

    console.log('This user has a ' + data.body.product + ' account');
  })
  .catch(function(err) {
    console.log('Something went wrong', err.message);
  });
