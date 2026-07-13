import { create } from 'zustand'
import { api } from '../api/client'

const useAuthStore = create((set, get) => ({
  user: null,
  status: 'idle',
  error: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return
    set({ status: 'loading', error: null })
    try {
      const data = await api.get('/auth/me')
      set({ user: data.user, status: 'success', initialized: true })
    } catch (error) {
      set({ user: null, status: 'success', initialized: true })
    }
  },

  login: async (payload) => {
    set({ status: 'loading', error: null })
    const data = await api.post('/auth/login', payload)
    set({ user: data.user, status: 'success' })
  },

  register: async (payload) => {
    set({ status: 'loading', error: null })
    const data = await api.post('/auth/register', payload)
    set({ user: data.user, status: 'success' })
  },

  logout: async () => {
    await api.post('/auth/logout', {})
    set({ user: null, status: 'success' })
  },
}))

export default useAuthStore
