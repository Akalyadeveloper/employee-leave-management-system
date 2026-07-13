import { create } from 'zustand'
import { api } from '../api/client'
import logger from '../utils/logger.js'

const useAuthStore = create((set, get) => ({
  user: null,
  status: 'idle',
  error: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return
    logger.debug('Auth', 'Initializing auth state...')
    set({ status: 'loading', error: null })
    try {
      const data = await api.get('/auth/me')
      logger.success('Auth', 'User session restored', { email: data.user.email })
      set({ user: data.user, status: 'success', initialized: true })
    } catch (error) {
      logger.info('Auth', 'No active session')
      set({ user: null, status: 'success', initialized: true })
    }
  },

  login: async (payload) => {
    logger.info('Auth', 'Login attempt', { email: payload.email })
    set({ status: 'loading', error: null })
    const data = await api.post('/auth/login', payload)
    logger.success('Auth', 'Login successful', { email: data.user.email, role: data.user.role })
    set({ user: data.user, status: 'success' })
  },

  register: async (payload) => {
    logger.info('Auth', 'Registration attempt', { email: payload.email, role: payload.role })
    set({ status: 'loading', error: null })
    const data = await api.post('/auth/register', payload)
    logger.success('Auth', 'Registration successful', { email: data.user.email })
    set({ user: data.user, status: 'success' })
  },

  logout: async () => {
    logger.info('Auth', 'Logging out...')
    await api.post('/auth/logout', {})
    logger.success('Auth', 'Logged out')
    set({ user: null, status: 'success' })
  },
}))

export default useAuthStore
