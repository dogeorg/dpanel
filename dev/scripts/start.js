const { exec } = require('child_process');

setTimeout(function () {
  exec('web-dev-server --config ./configs/dpanel-web-dev-server.config.mjs');
  console.log('(✔) App running [dPanel]', 'http://dogebox.local:8080');

  // setTimeout(function () {
    // exec('web-dev-server --config ./configs/apmode-web-dev-server.config.mjs');
    // console.log('(✔) App running [AP Mode]', 'http://dogebox.local:8081');
  // }, 1500);

}, 1500);
