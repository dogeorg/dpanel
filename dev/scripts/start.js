const { exec } = require('child_process');

setTimeout(function () {
    console.log('(i) Starting dPanel server...');
    exec('web-dev-server --config ./configs/dpanel-web-dev-server.config.mjs', (error, stdout, stderr) => {
        if (error) {
            console.error(`(✖) Error running dPanel server: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`(✖) Standard Error Output: ${stderr}`);
        }
        console.log(`(i) Output: ${stdout}`);
    });
    console.log('(✔) App running [dPanel]', 'http://localhost:8080');
    console.log('(i) Starting AP Mode...');
    setTimeout(function () {
        exec('web-dev-server --config ./configs/apmode-web-dev-server.config.mjs', (error, stdout, stderr) => {
            if (error) {
                console.error(`(✖) Error running AP Mode server: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`(✖) Standard Error Output: ${stderr}`);
            }
            console.log(`(i) Output: ${stdout}`);
        });
    }, 1500);
    console.log('(✔) App running [AP Mode]', 'http://localhost:8081');
}, 1500);
