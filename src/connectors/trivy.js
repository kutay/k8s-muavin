const exec = require('child_process').exec;

function exec_command(command) {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 20000 }, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout);
        });
    });
}

async function scan_image(image) {
    console.log(`Scanning image ${image}`)
    const command = `trivy image -q --security-checks vuln -f json ${image}`;
    const result = await exec_command(command);
    return JSON.parse(result);
}


module.exports = {
    scan_image
}