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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = process.env.CLIENT_URL?.split(',').map((url) => url.trim()) || ['http://localhost:5173']

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

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
  app.listen(PORT, () => console.log(`API ready on port ${PORT}`))
}

startServer()
