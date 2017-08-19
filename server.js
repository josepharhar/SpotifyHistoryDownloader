const SpotifyWebApi = require('spotify-web-api-node');

const secrets = require('./secrets');

const authorizationCode = secrets.get('authorizationCode');
const clientId = secrets.get('clientId');
const clientSecret = secrets.get('clientSecret');
const redirectUri = secrets.get('redirectUri');
if (!(authorizationCode && clientId && clientSecret && redirectUri)) {
  console.error('not all secrets found');
  return;
}

const startTime = new Date().getTime() / 1000;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri
});

const authorize = () => {
  if (secrets.has('refreshToken') && startTime < secrets.get('tokenExpirationEpoch')) {
    console.log('using refresh token');

    spotifyApi.setRefreshToken(secrets.get('refreshToken'));
    return spotifyApi.refreshAccessToken()
      .then((data) => {
        secrets.put('refreshToken', data.body['refresh_token']);
        secrets.put('tokenExpirationEpoch', startTime + data.body['expires_in']);
      });
  }

  console.log('no refresh token, using authorization code');
  return spotifyApi.authorizationCodeGrant(authorizationCode)
    .then((data) => {
      const refreshToken = data.body['refresh_token'];
      secrets.put('refreshToken', refreshToken);
      console.log('set refreshToken to: ' + refreshToken);
      const tokenExpirationEpoch = startTime + data.body['expires_in'];
      secrets.put('tokenExpirationEpoch', tokenExpirationEpoch);

      spotifyApi.setAccessToken(data.body['access_token']);
    });
};

authorize()
  .then(() => {
    console.log('getting recently played tracks');
    return spotifyApi.getMyRecentlyPlayedTracks();
  })
  .then((history) => {
    console.log('got history:');
    console.log(JSON.stringify(history));
  })
  .catch((e) => {
    console.log('error: ' + JSON.stringify(e));
  });

/*spotifyApi.authorizationCodeGrant(authorizationCode)
  .then((data) => {
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    secrets.put('refreshToken', refreshToken);
    //const expiresIn = data.body['expires_in']; // in seconds
    const tokenExpirationEpoch = startTime + data.body['expires_in'];
    secrets.put('tokenExpirationEpoch', tokenExpirationEpoch);

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
  });*/
