import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import UsernameSetup from './pages/UsernameSetup'
import Dashboard from './pages/Dashboard'
import UserProfilePage from './pages/UserProfilePage'
import TemplatesPage from './pages/TemplatesPage'
import TemplateViewPage from './pages/TemplateViewPage'
import PricingPage from './pages/PricingPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/setup" element={<UsernameSetup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/template/:shareId" element={<TemplateViewPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/:username" element={<UserProfilePage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
