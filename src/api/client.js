import logger from '../utils/logger.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

logger.debug('API', 'Base URL configured', API_BASE)

const request = async (path, options = {}) => {
  const method = options.method || 'GET'
  logger.debug('API', `${method} ${path}`, options.body ? JSON.parse(options.body) : undefined)
  
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  try {
    data = await response.json()
  } catch (error) {
    data = null
  }

  logger.api(method, path, response.status, data)

  if (!response.ok) {
    logger.error('API', `Request failed: ${data?.message || 'Unknown error'}`)
    throw new Error(data?.message || 'Request failed')
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
