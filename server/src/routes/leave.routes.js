import { Router } from 'express'
import {
  applyLeave,
  myRequests,
  deleteLeave,
  myBalance,
  allRequests,
  pendingRequests,
  approveLeave,
  rejectLeave,
} from '../controllers/leave.controller.js'
import { protect, requireEmployee, requireManager } from '../middleware/auth.js'

const router = Router()

router.post('/', protect, requireEmployee, applyLeave)
router.get('/my-requests', protect, requireEmployee, myRequests)
router.delete('/:id', protect, requireEmployee, deleteLeave)
router.get('/balance', protect, requireEmployee, myBalance)

router.get('/all', protect, requireManager, allRequests)
router.get('/pending', protect, requireManager, pendingRequests)
router.put('/:id/approve', protect, requireManager, approveLeave)
router.put('/:id/reject', protect, requireManager, rejectLeave)

export default router
