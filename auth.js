const express = require('express');
const path = require('path');
const fs = require('fs');

const secrets = require('./secrets.json');
const app = express();

app.get('/auth-redirect', (req, res) => {
  secrets.authorizationCode = req.query.code;
  fs.writeFile(path.join(__dirname + '/secrets.json'), JSON.stringify(secrets), (err) => {
    if (err) {
      console.error('error writing secrets file: ' + err);
    } else {
      console.log('wrote auth code to secrets.json: ' + secrets.authorizationCode);
    }
  });
  res.sendFile(path.join(__dirname + '/auth-redirect.html'));
});

app.get('/auth', (req, res) => {
  const scopes = 'user-read-recently-played';
  const redirect_uri = 'http://' + req.headers.host + '/auth-redirect';
  console.log('redirect_uri: ' + redirect_uri);

  res.redirect('https://accounts.spotify.com/authorize' + 
    '?response_type=code' +
    '&client_id=' + secrets.clientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.listen(process.env.PORT || 8080, () => {
  console.log('auth server started');
});
