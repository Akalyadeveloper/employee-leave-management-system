import { create } from 'zustand'
import { api } from '../api/client'
import logger from '../utils/logger.js'

const useLeaveStore = create((set) => ({
  myRequests: [],
  pendingRequests: [],
  allRequests: [],
  balance: null,
  loading: false,
  error: null,

  fetchMyRequests: async () => {
    logger.debug('Leave', 'Fetching my requests...')
    set({ loading: true, error: null })
    try {
      const data = await api.get('/leaves/my-requests')
      logger.success('Leave', `Loaded ${data.requests.length} requests`)
      set({ myRequests: data.requests, loading: false })
    } catch (error) {
      logger.error('Leave', 'Failed to fetch requests', error.message)
      set({ loading: false, error: error.message })
    }
  },

  fetchBalance: async () => {
    logger.debug('Leave', 'Fetching balance...')
    try {
      const data = await api.get('/leaves/balance')
      logger.success('Leave', 'Balance loaded', data.balance)
      set({ balance: data.balance })
    } catch (error) {
      logger.error('Leave', 'Failed to fetch balance', error.message)
      set({ error: error.message })
    }
  },

  applyLeave: async (payload) => {
    logger.info('Leave', 'Applying for leave', payload)
    set({ loading: true, error: null })
    try {
      await api.post('/leaves', payload)
      logger.success('Leave', 'Leave applied successfully')
      const [requestsRes, balanceRes] = await Promise.all([
        api.get('/leaves/my-requests'),
        api.get('/leaves/balance'),
      ])
      set({
        loading: false,
        myRequests: requestsRes.requests,
        balance: balanceRes.balance,
      })
    } catch (error) {
      logger.error('Leave', 'Failed to apply leave', error.message)
      set({ loading: false, error: error.message })
      throw error
    }
  },

  cancelRequest: async (id) => {
    logger.info('Leave', 'Cancelling request', { id })
    set({ loading: true, error: null })
    try {
      await api.delete(`/leaves/${id}`)
      logger.success('Leave', 'Request cancelled')
      const data = await api.get('/leaves/my-requests')
      set({ myRequests: data.requests, loading: false })
    } catch (error) {
      logger.error('Leave', 'Failed to cancel request', error.message)
      set({ loading: false, error: error.message })
      throw error
    }
  },

  fetchPendingRequests: async () => {
    logger.debug('Leave', 'Fetching pending requests...')
    set({ loading: true, error: null })
    try {
      const data = await api.get('/leaves/pending')
      logger.success('Leave', `Loaded ${data.requests.length} pending requests`)
      set({ pendingRequests: data.requests, loading: false })
    } catch (error) {
      logger.error('Leave', 'Failed to fetch pending', error.message)
      set({ loading: false, error: error.message })
    }
  },

  fetchAllRequests: async () => {
    logger.debug('Leave', 'Fetching all requests...')
    set({ loading: true, error: null })
    try {
      const data = await api.get('/leaves/all')
      logger.success('Leave', `Loaded ${data.requests.length} total requests`)
      set({ allRequests: data.requests, loading: false })
    } catch (error) {
      logger.error('Leave', 'Failed to fetch all requests', error.message)
      set({ loading: false, error: error.message })
    }
  },

  approveRequest: async (id, managerComment) => {
    logger.info('Leave', 'Approving request', { id, managerComment })
    set({ loading: true, error: null })
    try {
      await api.put(`/leaves/${id}/approve`, { managerComment })
      logger.success('Leave', 'Request approved')
      const [pendingRes, allRes] = await Promise.all([
        api.get('/leaves/pending'),
        api.get('/leaves/all'),
      ])
      set({ pendingRequests: pendingRes.requests, allRequests: allRes.requests, loading: false })
    } catch (error) {
      logger.error('Leave', 'Failed to approve', error.message)
      set({ loading: false, error: error.message })
      throw error
    }
  },

  rejectRequest: async (id, managerComment) => {
    logger.info('Leave', 'Rejecting request', { id, managerComment })
    set({ loading: true, error: null })
    try {
      await api.put(`/leaves/${id}/reject`, { managerComment })
      logger.success('Leave', 'Request rejected')
      const [pendingRes, allRes] = await Promise.all([
        api.get('/leaves/pending'),
        api.get('/leaves/all'),
      ])
      set({ pendingRequests: pendingRes.requests, allRequests: allRes.requests, loading: false })
    } catch (error) {
      logger.error('Leave', 'Failed to reject', error.message)
      set({ loading: false, error: error.message })
      throw error
    }
  },
}))

export default useLeaveStore
