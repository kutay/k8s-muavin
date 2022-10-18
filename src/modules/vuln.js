const cache = require("./cache");
const trivy = require("../connectors/trivy");

async function scan_with_cache(image) {

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


async function analyze_image(image) {
    const scan = await scan_with_cache(image);

    const clean_results = scan.Results[0].Vulnerabilities.map((vuln) => {
        return {
            VulnerabilityID: vuln.VulnerabilityID,
            PkgName: vuln.PkgName,
            InstalledVersion: vuln.InstalledVersion,
            FixedVersion: vuln.FixedVersion,
            Severity: vuln.Severity,
            Score: vuln.CVSS.nvd.V3Score
        }
    });

    return clean_results;
}


module.exports = {
    analyze_image
}