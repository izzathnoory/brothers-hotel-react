import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { SettingsProvider } from './context/SettingsContext'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './pages/admin/DashboardLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageMenu from './pages/admin/ManageMenu'
import ManageGallery from './pages/admin/ManageGallery'
import ManageReviews from './pages/admin/ManageReviews'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="about" element={<About />} />
              </Route>

              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="menu" element={<ManageMenu />} />
                  <Route path="gallery" element={<ManageGallery />} />
                  <Route path="reviews" element={<ManageReviews />} />
                  <Route path="settings" element={<Settings />} />
                  <Route index element={<Dashboard />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
