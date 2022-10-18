
const vuln = require("./modules/vuln");
const k8s = require("./modules/k8s");

async function analyzeCluster() {
    const workloads = await k8s.getWorkloads();

    const enhanced = [];
    for (let workload of workloads) {
        const workloadPlus = Object.assign({}, workload);
        workloadPlus.containers = [];

        for (let container of workload.containers) {
            console.log(container)
            const vulns = await vuln.analyze_image(container)

            workloadPlus.containers.push({
                image: container,
                vulnerabilities: vulns
            })
        }

        enhanced.push(workloadPlus);
    }

    console.table(enhanced);



    // get all images
    // get all helm charts
    // scan all container images for vulns
    // check new versions for containers
    // check new versions for helm charts

    // get ingresses, services, pods
    // get volumes 
}

async function main() {
    //const vulns = await vuln.analyze_image("alpine:3.14.0");
    //console.table(vulns);

    //const comp = await vuln.compare_images("alpine:3.14.0", "alpine:3.14.2")
    //console.log(comp);


}

main();