import { create } from 'zustand'
import { api } from '../api/client'

const useLeaveStore = create((set) => ({
  myRequests: [],
  pendingRequests: [],
  allRequests: [],
  balance: null,
  loading: false,
  error: null,

  fetchMyRequests: async () => {
    set({ loading: true, error: null })
    try {
      const data = await api.get('/leaves/my-requests')
      set({ myRequests: data.requests, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  fetchBalance: async () => {
    try {
      const data = await api.get('/leaves/balance')
      set({ balance: data.balance })
    } catch (error) {
      set({ error: error.message })
    }
  },

  applyLeave: async (payload) => {
    set({ loading: true, error: null })
    try {
      await api.post('/leaves', payload)
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
      set({ loading: false, error: error.message })
      throw error
    }
  },

  cancelRequest: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/leaves/${id}`)
      const data = await api.get('/leaves/my-requests')
      set({ myRequests: data.requests, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  fetchPendingRequests: async () => {
    set({ loading: true, error: null })
    try {
      const data = await api.get('/leaves/pending')
      set({ pendingRequests: data.requests, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  fetchAllRequests: async () => {
    set({ loading: true, error: null })
    try {
      const data = await api.get('/leaves/all')
      set({ allRequests: data.requests, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  approveRequest: async (id, managerComment) => {
    set({ loading: true, error: null })
    try {
      await api.put(`/leaves/${id}/approve`, { managerComment })
      const [pendingRes, allRes] = await Promise.all([
        api.get('/leaves/pending'),
        api.get('/leaves/all'),
      ])
      set({ pendingRequests: pendingRes.requests, allRequests: allRes.requests, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  rejectRequest: async (id, managerComment) => {
    set({ loading: true, error: null })
    try {
      await api.put(`/leaves/${id}/reject`, { managerComment })
      const [pendingRes, allRes] = await Promise.all([
        api.get('/leaves/pending'),
        api.get('/leaves/all'),
      ])
      set({ pendingRequests: pendingRes.requests, allRequests: allRes.requests, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
}))

export default useLeaveStore
