import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const FALLBACK_URI = 'mongodb+srv://root:123@cluster.03mpd0q.mongodb.net/?appName=Cluster'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || FALLBACK_URI
    logger.info('Database', 'Attempting MongoDB connection', { dbName: process.env.MONGO_DB ?? 'leave_mgmt' })
    
    if (!mongoUri) {
      throw new Error('Missing Mongo connection string. Set MONGO_URI in server/.env')
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB ?? 'leave_mgmt',
    })
    logger.info('Database', `MongoDB connected successfully`, { host: conn.connection.host })
  } catch (error) {
    logger.error('Database', 'MongoDB connection failed', { error: error.message })
    process.exit(1)
  }
}
