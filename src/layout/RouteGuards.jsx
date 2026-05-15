import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const isAdminUser = (user) => {
  const role = String(user?.role || '').trim().toLowerCase()
  return role === 'admin' || role === 'superadmin' || role === 'moderator' || Boolean(user?.isAdmin)
}

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />
  return children
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />
  if (!isAdminUser(user)) return <Navigate to="/" replace />
  return children
}

export default { RequireAuth, RequireAdmin }
