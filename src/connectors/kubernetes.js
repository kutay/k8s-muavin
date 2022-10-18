const k8s = require('@kubernetes/client-node');

// FIXME provide a way to configure the context
const kc = new k8s.KubeConfig();
kc.loadFromDefault();


const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);

function getContexts() {
    return kc.contexts;
}
function getCurrentContext() {
    return kc.currentContext;
}

function mapContainer(container) {
    const mappedContainer = {
        name: container.name,
        image: container.image,
        resources: container.resources
    }

    if (container.ports) {
        mappedContainer.ports = container.ports.map((port) => {
            return `${port.name}/${port.containerPort}/${port.protocol}`
        });
    }

    return mappedContainer;
}


function mapV1Deployment(v1deployment) {
    let c = {
        uid: v1deployment.metadata.uid,
        name: v1deployment.metadata.name,
        namespace: v1deployment.metadata.namespace,
        containers: v1deployment.spec.template.spec.containers.map(mapContainer)
    }

    if (v1deployment.spec.template.spec.initContainers) {
        c.initContainers = v1deployment.spec.template.spec.initContainers.map(mapContainer)
    }

    return c;
}

async function getDeployments() {
    const deps_raws = await appsV1Api.listDeploymentForAllNamespaces();
    return deps_raws.body.items.map(mapV1Deployment);
}
async function getStatefulSets() {
    const sts_raws = await appsV1Api.listStatefulSetForAllNamespaces();
    return sts_raws.body.items.map(mapV1Deployment);
}

module.exports = {
    getContexts,
    getCurrentContext,
    getDeployments,
    getStatefulSets
}