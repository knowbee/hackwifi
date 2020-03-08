const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const spinner = require("ora")();
const credentials = path.join() + "/credentials/";

if (!fs.existsSync(credentials)) {
  fs.mkdirSync(credentials);
}

fs.hackwifi = function() {
  return new Promise(function(resolve, reject) {
    spinner.start("be patient");
    exec("netsh wlan show profiles > wlan.txt", (err, stdout, stderr) => {
      if (err) {
        if (err) reject(err);
      } else {
        const wlan = fs.readFileSync("wlan.txt");
        const formatted = wlan
          .toString()
          .split("All User Profile     :")
          .slice(1, -1);
        resolve(formatted);
      }
    });
  });
};

fs.readdirAsync = function(dirname) {
  return new Promise(function(resolve, reject) {
    fs.readdir(dirname, function(err, filenames) {
      if (err) reject(err);
      else resolve(filenames);
    });
  });
};
fs.readFileAsync = function(filename, enc) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, enc, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

function getFile(filename) {
  return fs.readFileAsync(credentials + filename, "utf8");
}

function fetchPasswords() {
  setTimeout(() => {
    fs.readdirAsync(credentials)
      .then(function(filenames) {
        return Promise.all(filenames.map(getFile));
      })
      .then(function(files) {
        const hackedPasswords = [];
        files.forEach(function(file) {
          if (!file.includes("Open") && file !== undefined) {
            let name = file.split("SSID name              :")[1];
            if (name !== undefined) {
              name = name.split("Network type")[0];
            }
            const pass = file
              .toString()
              .split("Cost settings")[0]
              .split("Key Content            :")[1];
            if (pass !== undefined) {
              hackedPasswords.push({
                name: name.trim(),
                password: pass.trim()
              });
            }
          }
        });
        spinner.succeed("done");
        console.log(hackedPasswords);
      });
  }, 2000);
}

fs.hackwifi()
  .then(profiles => {
    profiles.forEach(profile => {
      exec(
        `netsh wlan show profiles "${profile.trim()}" key=clear > ${credentials}/"${profile.trim()}"`
      );
    });
  })
  .then(() => {
    return fetchPasswords();
  });
