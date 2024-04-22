const { exec } = require('child_process');

setTimeout(function () {
  exec('web-dev-server --config ./configs/web-dev-sever.config.mjs');
  console.log('(✔) dPanel running');
  console.log('---------')
  console.log('http://dogebox.local:8080');
}, 300);
