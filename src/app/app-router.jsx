import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { hasStoredAuthTokens } from '@/features/auth/lib/auth-client'
import { AdminPage } from '@/pages/admin/admin-page'
import { AnalysisPage } from '@/pages/analysis/analysis-page'
import { ComparePage } from '@/pages/compare/compare-page'
import { HomePage } from '@/pages/home/home-page'
import { FundDetailPage } from '@/pages/home/fund-detail-page'
import { LoginPage } from '@/pages/login/login-page'
import { RegisterPage } from '@/pages/register/register-page'
import { ProfilePage } from '@/pages/profile/profile-page'

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
        <Route
          path="/analise"
          element={(
            <PrivateRoute>
              <AnalysisPage />
            </PrivateRoute>
          )}
        />
        <Route
          path="/comparador"
          element={(
            <PrivateRoute>
              <ComparePage />
            </PrivateRoute>
          )}
        />
        <Route
          path="/administracao"
          element={(
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          )}
        />
        <Route
          path="/home/fundo/:ticker"
          element={(
            <PrivateRoute>
              <FundDetailPage />
            </PrivateRoute>
          )}
        />
        <Route
          path="/perfil"
          element={(
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
