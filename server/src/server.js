import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import leaveRoutes from './routes/leave.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import logger from './utils/logger.js'
import { isDemoMode } from './services/demoDb.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

if (process.env.VERCEL) {
  process.env.NODE_ENV = 'production'
}

const allowedOrigins = process.env.CLIENT_URL?.split(',').map((url) => url.trim()).filter(Boolean) || ['http://localhost:5173']
const isLocalDevelopmentOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)

logger.info('Server', 'Initializing server', { allowedOrigins, nodeEnv: process.env.NODE_ENV })

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      if (process.env.NODE_ENV !== 'production' && isLocalDevelopmentOrigin(origin)) {
        return callback(null, true)
      }
      logger.warn('CORS', 'Blocked origin', { origin })
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  logger.request(req)
  res.on('finish', () => {
    logger.response(req, res)
  })
  next()
})

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Employee Leave Management API ready' })
})

app.get('/favicon.ico', (req, res) => res.status(204).end())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), demoMode: isDemoMode() })
})

app.use('/api/auth', authRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      logger.info('Server', `API ready on port ${PORT}${isDemoMode() ? ' (demo mode)' : ''}`)
    })
  } catch (error) {
    logger.error('Server', 'Failed to start API server', { error: error.message })
    process.exit(1)
  }
}

if (process.env.VERCEL === undefined) {
  startServer()
}

export default app
