import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb+srv://saivardhanmanikala:saivardan66112@taskmanager.allm2jy.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager&tls=true"
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("trello-clone")
}

export default clientPromise
