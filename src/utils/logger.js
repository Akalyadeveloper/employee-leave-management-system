/**
 * Simple frontend logger for consistent console logging
 */

const isDev = import.meta.env.DEV

const styles = {
  info: 'color: #3b82f6; font-weight: bold',
  warn: 'color: #f59e0b; font-weight: bold',
  error: 'color: #ef4444; font-weight: bold',
  success: 'color: #22c55e; font-weight: bold',
  debug: 'color: #8b5cf6; font-weight: bold',
}

export const logger = {
  info: (context, message, data = null) => {
    console.log(`%c[${context}]`, styles.info, message, data ?? '')
  },

  warn: (context, message, data = null) => {
    console.warn(`%c[${context}]`, styles.warn, message, data ?? '')
  },

  error: (context, message, data = null) => {
    console.error(`%c[${context}]`, styles.error, message, data ?? '')
  },

  success: (context, message, data = null) => {
    console.log(`%c[${context}]`, styles.success, message, data ?? '')
  },

  debug: (context, message, data = null) => {
    if (isDev) {
      console.log(`%c[${context}]`, styles.debug, message, data ?? '')
    }
  },

  // API request logger
  api: (method, path, status, data = null) => {
    const style = status >= 400 ? styles.error : status >= 300 ? styles.warn : styles.success
    console.log(`%c[API]`, style, `${method} ${path} → ${status}`, data ?? '')
  },
}

export default logger
