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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = process.env.CLIENT_URL?.split(',').map((url) => url.trim()) || ['http://localhost:5173']

logger.info('Server', 'Initializing server', { allowedOrigins, nodeEnv: process.env.NODE_ENV })

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Request logging middleware
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
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => logger.info('Server', `API ready on port ${PORT}`))
}

// Only start server locally, not in Vercel
if (process.env.VERCEL === undefined) {
  startServer()
}

export default app
