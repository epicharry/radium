import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import UsernameSetup from './pages/UsernameSetup'
import Dashboard from './pages/Dashboard'
import UserProfilePage from './pages/UserProfilePage'
import AuthCallback from './pages/AuthCallback'
import TemplatesPage from './pages/TemplatesPage'
import TemplateViewPage from './pages/TemplateViewPage'
import PricingPage from './pages/PricingPage'
import AdminDashboard from './pages/AdminDashboard'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

function App() {
  if (!domain || !clientId) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Configuration Error</h1>
          <p className="text-gray-400">
            Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your .env file
          </p>
        </div>
      </div>
    )
  }

  const redirectUri = `${window.location.origin}/callback`
  
  console.log('Auth0 Configuration:', {
    domain,
    clientId: clientId?.substring(0, 10) + '...',
    redirectUri
  })

  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: 'openid profile email'
        }}
        useRefreshTokens={false}
        cacheLocation="localstorage"
        onRedirectCallback={(appState) => {
          console.log('Auth0 redirect callback', appState)
        }}
      >
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/callback" element={<AuthCallback />} />
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
      </Auth0Provider>
    </ErrorBoundary>
  )
}

export default App
