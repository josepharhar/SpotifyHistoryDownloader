const express = require('express');
const path = require('path');
const fs = require('fs');

const Secrets = new require('./secrets');
const secrets = new Secrets();
const app = express();

app.get('/auth-redirect', (req, res) => {
  secrets.put('authorizationCode', req.query.code);
  res.sendFile(path.join(__dirname + '/auth-redirect.html'));
});

app.get('/auth', (req, res) => {
  const scopes = 'user-read-recently-played';
  const redirect_uri = 'http://' + req.headers.host + '/auth-redirect';
  console.log('redirect_uri: ' + redirect_uri);

  res.redirect('https://accounts.spotify.com/authorize' + 
    '?response_type=code' +
    '&client_id=' + secrets.get('clientId') +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.listen(process.env.PORT || 8080, () => {
  console.log('auth server started');
});
