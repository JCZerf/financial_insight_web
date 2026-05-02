import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { hasStoredAuthTokens } from '@/features/auth/lib/auth-client'
import { HomePage } from '@/pages/home/home-page'
import { LoginPage } from '@/pages/login/login-page'
import { RegisterPage } from '@/pages/register/register-page'

function PrivateRoute({ children }) {
  return hasStoredAuthTokens() ? children : <Navigate to="/login" replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={hasStoredAuthTokens() ? '/home' : '/login'} replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route
          path="/home"
          element={(
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
