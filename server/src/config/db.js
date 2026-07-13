import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const FALLBACK_URI = 'mongodb+srv://root:123@cluster.03mpd0q.mongodb.net/?appName=Cluster'

let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export const connectDB = async () => {
  // Return existing connection if available
  if (cached.conn) {
    logger.debug('Database', 'Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || FALLBACK_URI
    logger.info('Database', 'Attempting MongoDB connection', { dbName: process.env.MONGO_DB ?? 'leave_mgmt' })
    
    if (!mongoUri) {
      throw new Error('Missing Mongo connection string. Set MONGO_URI in server/.env')
    }

    cached.promise = mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB ?? 'leave_mgmt',
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).then((mongoose) => {
      logger.info('Database', 'MongoDB connected successfully', { host: mongoose.connection.host })
      return mongoose
    }).catch((error) => {
      logger.error('Database', 'MongoDB connection failed', { error: error.message })
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}
