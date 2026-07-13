import { Router } from 'express'
import { employeeDashboard, managerDashboard } from '../controllers/dashboard.controller.js'
import { protect, requireEmployee, requireManager } from '../middleware/auth.js'

const router = Router()

router.get('/employee', protect, requireEmployee, employeeDashboard)
router.get('/manager', protect, requireManager, managerDashboard)

export default router
