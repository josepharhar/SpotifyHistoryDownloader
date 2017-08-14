const SpotifyWebApi = require('spotify-web-api-node');

const secrets = require('./secrets.json');
const authorizationCode = secrets.authorizationCode;
const clientId = secrets.clientId;
const clientSecret = secrets.clientSecret;
const redirectUri = secrets.redirectUri;
console.log('authorizationCode: ' + authorizationCode);
console.log('clientId: ' + clientId);
console.log('clientSecret: ' + clientSecret);
console.log('redirectUri: ' + redirectUri);
console.log();
if (!(authorizationCode && clientId && clientSecret && redirectUri)) {
  console.error('not all secrets found');
  return;
}

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri
});

spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in']; // in seconds

    console.log('access_token: ' + accessToken);
    console.log('refresh_token: ' + refreshToken);
    console.log('expires_in: ' + expiresIn);
    spotifyApi.setAccessToken(accessToken);

    return spotifyApi.getMe();
    // return spotifyApi.getMyRecentlyPlayedTracks();
  })
  .then(function(data) {
    console.log('Retrieved data for ' + data.body['display_name']);
    console.log('Email is ' + data.body.email);
    console.log('Image URL is ' + data.body.images[0].url);
    console.log('This user has a ' + data.body.product + ' account');
  })
  .catch(function(err) {
    console.log('error: ' + JSON.stringify(err));
  });
