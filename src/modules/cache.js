const Redis = require("ioredis");
const redis = new Redis();

keys("*").then((result) => {
    console.log(result);
})

async function keys(pattern) {
    return redis.keys(pattern);
}

async function exists(key) {
    return redis.exists(key);
}

async function save(key, data, ttl) {
    return redis.set(key, data);
}

async function retrieve(key) {
    return redis.get(key);
}

async function flushall() {
    return redis.flushall();
}

module.exports = {
    exists,
    save,
    retrieve,
    flushall
}