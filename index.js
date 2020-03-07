const { readFileSync, readdirSync, existsSync } = require("fs");
const path = require("path");
const { exec } = require("child_process");

const credentials = path.join() + "/credentials";
let passwords = [];

keepCredentials = profiles => {
  for (const profile of profiles) {
    exec(
      `netsh wlan show profiles ${profile} key=clear > ${credentials}/${profile}`
    );
  }
  // const exist = existsSync(credentials);
  // if (exist) {
  //   const dirnames = readdirSync(credentials);
  //   for (const filename of dirnames) {
  //     const data = readFileSync(`${credentials}/${filename}`);
  //     try {
  //       const name = data
  //         .toString()
  //         .split(" on interface WiFi")[0]
  //         .split("Profile ")[1];
  //       const password = data
  //         .toString()
  //         .split("Key Content")[1]
  //         .split("Cost settings")[0]
  //         .split(": ")[1]
  //         .trim();
  //       passwords.push({ name, password });
  //     } catch (error) {
  //       continue;
  //     }
  //   }
  //   return passwords;
  // } else {
  //   return "no passwords found!";
  // }
};

getInterface = () => {
  exec("netsh wlan show profiles > wlan.txt", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
};

const profiles = [];
formatWlan = () => {
  const wlan = readFileSync("wlan.txt");
  const formatted = wlan.toString().split("All User Profile     :");
  for (const w of formatted.slice(1, -1)) {
    profiles.push(w);
  }
  return keepCredentials(profiles);
};

formatWlan();
