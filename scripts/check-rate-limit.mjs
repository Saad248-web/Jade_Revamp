import mongoose from "mongoose";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();
usePublicDnsForMongo();

await mongoose.connect(process.env.MONGODB_URI);
const buckets = await mongoose.connection.db
  .collection("ratelimitbuckets")
  .find({ key: /auth:login/ })
  .toArray();
console.log(JSON.stringify(buckets, null, 2));
await mongoose.disconnect();
