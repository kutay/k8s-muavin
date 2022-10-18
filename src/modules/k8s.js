const kubernetes = require("../connectors/kubernetes");
const cache = require("./cache");

async function getHelmReleases() {
    // FIXME
}

async function getWorkloads() {
    const ctx = kubernetes.getCurrentContext();

    if (await cache.exists(ctx)) {
        return JSON.parse(await cache.retrieve(ctx));
    }

    const deployments = await kubernetes.getDeployments();
    //const statefulsets = kubernetes.getStatefulSets();

    const workloads = [];

    for (const dep of deployments) {
        workloads.push({
            type: "Deployment",
            namespace: dep.namespace,
            name: dep.name,
            containers: dep.containers.map((c) => c.image)
        })
    }

    await cache.save(ctx, JSON.stringify(workloads), 300);

    return workloads;
}

module.exports = {
    getHelmReleases,
    getWorkloads
}