import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { notificationApi } from '../api/notificationApi'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = useCallback(() => {
    if (!user) return
    notificationApi.getUnreadCount()
      .then((res) => setUnreadCount(res.data.data?.count ?? 0))
      .catch(() => {})
  }, [user])

  // Poll every 30 seconds while logged in
  useEffect(() => {
    if (!user) return
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [user, fetchUnreadCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
