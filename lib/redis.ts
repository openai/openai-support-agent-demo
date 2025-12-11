import Redis from "ioredis";

const url = process.env.REDIS_URL;

let redis: any;

if (url) {
  redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 0 });
  if (typeof redis.on === "function") {
    redis.on("error", () => {});
    redis.connect().catch(() => {});
  }
} else {
  redis = {
    async get() {
      return null;
    },
    async set() {
      return null;
    },
  };
}

export default redis;

