import mongoose from 'mongoose'

const FALLBACK_URI = 'mongodb+srv://root:123@cluster.03mpd0q.mongodb.net/?appName=Cluster'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || FALLBACK_URI
    if (!mongoUri) {
      throw new Error('Missing Mongo connection string. Set MONGO_URI in server/.env')
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB ?? 'leave_mgmt',
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Mongo connection failed', error.message)
    process.exit(1)
  }
}
