// import { Db, MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB || "airline_booking";

// if (!uri) {
//   throw new Error("Please add MONGODB_URI to .env.local");
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// const globalForMongo = global as typeof globalThis & {
//   _mongoClientPromise?: Promise<MongoClient>;
// };

// if (process.env.NODE_ENV === "development") {
//   if (!globalForMongo._mongoClientPromise) {
//     client = new MongoClient(uri);
//     globalForMongo._mongoClientPromise = client.connect();
//   }

//   clientPromise = globalForMongo._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export async function getDb(): Promise<Db> {
//   const connectedClient = await clientPromise;
//   return connectedClient.db(dbName);
// }
import { Db, MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }

  return uri;
}

function getClientPromise() {
  const uri = getMongoUri();

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalForMongo._mongoClientPromise = client.connect();
    }

    return globalForMongo._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || "airline_booking";
  const connectedClient = await getClientPromise();

  return connectedClient.db(dbName);
}