class Secrets {
  constructor(filename) {
    this.secrets_ = require('./secrets.json');
  }

  get(key) {
    return this.secrets_[key];
  }

  put(key, value) {
    if (this.secrets_[key] != value) {
      this.secrets_[key] = value;
      this.writeSecrets_();
    }
  }

  writeSecrets_() {
    fs.writeFile(path.join(__dirname + '/secrets.json'), JSON.stringify(this.secrets_), (err) => {
      if (err) {
        console.error('error writing secrets file: ' + err);
      } else {
        console.log('updated secrets.json');
      }
    });
  }
}

module.exports = Secrets;
