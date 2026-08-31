import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import AppShell from './components/AppShell'
import Dashboard from './pages/dashboard/Dashboard'
import AssetManagement from './pages/assets/AssetManagement'
import CredentialList from './pages/credentials/CredentialList'
import AssetDiscovery from './pages/discovery/AssetDiscovery'
import ChecklistList from './pages/checklist/ChecklistList'
import Analytics from './pages/analytics/Analytics'
import Settings from './pages/settings/Settings'
import AboutUs from './pages/about/AboutUs'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c8cf0' },
    background: {
      default: '#0b0f17',
      paper: '#131926',
    },
    text: {
      primary: '#e7eaf0',
      secondary: '#9aa3b5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<AssetManagement />} />
            <Route path="/credentials" element={<CredentialList />} />
            <Route path="/discovery" element={<AssetDiscovery />} />
            <Route path="/checklist" element={<ChecklistList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
