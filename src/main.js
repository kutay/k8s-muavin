
const vuln = require("./modules/vuln");

async function main() {
    const vulns = await vuln.analyze_image("alpine:3.14.0");
    console.table(vulns);
}

main();