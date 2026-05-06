import { Navigate } from 'react-router-dom'
import authService from '../services/authService'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If specific role required and user doesn't have it, redirect to home
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

// For admin-only routes
export function AdminRoute({ children }) {
  return <ProtectedRoute requiredRole="Admin">{children}</ProtectedRoute>
}

// For admin or instructor routes
export function InstructorRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'Admin' && user?.role !== 'Instructor') {
    return <Navigate to="/" replace />
  }

  return children
}
