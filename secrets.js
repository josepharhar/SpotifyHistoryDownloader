const fs = require('fs');
const path = require('path');

const writeSecrets = (secrets) => {
  fs.writeFile(
      path.join(__dirname + '/secrets.json'),
      JSON.stringify(secrets, null, '  '),
      (err) => {
    if (err) {
      console.error('error writing secrets file: ' + err);
    }
  });
}

const readSecrets = () => {
  return JSON.parse(fs.readFileSync(__dirname + '/secrets.json', 'utf8'));
}

const get = (key) => {
  return readSecrets()[key];
};

const has = (key) => {
  return get(key) != undefined;
}

const put = (key, value) => {
  const secrets = readSecrets();
  secrets[key] = value;
  writeSecrets(secrets);
}

module.exports.get = get;
module.exports.put = put;
module.exports.has = has;
