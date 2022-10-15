const cache = require("./modules/cache");
const trivy = require("./modules/trivy");


async function analyze_image(image) {

    // FIXME use sha 
    const cache_key = image;

    if (await cache.exists(cache_key)) {
        const data = await cache.retrieve(cache_key);
        return JSON.parse(data);
    } else {
        const scan_result = await trivy.scan_image(image);
        await cache.save(cache_key, JSON.stringify(scan_result));
        return scan_result;
    }
}


analyze_image("alpine:3.14.0").then((res) => {
    console.log(res.Results[0].Vulnerabilities.map((vuln) => {
        return {
            VulnerabilityID: vuln.VulnerabilityID,
            PkgName: vuln.PkgName,
            InstalledVersion: vuln.InstalledVersion,
            FixedVersion: vuln.FixedVersion,
            Severity: vuln.Severity,
            Score: vuln.CVSS.nvd.V3Score
        }
    }));
})