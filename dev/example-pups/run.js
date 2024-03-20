const { exec } = require('child_process');

exec('web-dev-server --config ./example-pups/basic/web-dev-server.config.mjs');
exec('web-dev-server --config ./example-pups/spa/web-dev-server.config.mjs');

console.log('(✔) Pups up and running')