const express = require('express');

const secrets = require('./secrets.json');
const app = express();

app.get('/redirect', (req, res) => {
  console.log('req: ' + JSON.stringify(req));
});

app.get('/auth', (req, res) => {
  const scopes = 'user-read-recently-played';
  const redirect_uri = req.headers.host + '/redirect';
  console.log('redirect_uri: ' + redirect_uri);

  res.redirect('https://accounts.spotify.com/authorize' + 
    '?response_type=code' +
    '&client_id=' + secrets.clientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.listen(process.env.PORT || 4880, () => {
  console.log('auth server started');
});
