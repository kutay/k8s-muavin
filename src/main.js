
const vuln = require("./modules/vuln");

async function main() {
    //const vulns = await vuln.analyze_image("alpine:3.14.0");
    //console.table(vulns);

    const comp = await vuln.compare_images("alpine:3.14.0", "alpine:3.14.2")
    console.log(comp);
}

main();