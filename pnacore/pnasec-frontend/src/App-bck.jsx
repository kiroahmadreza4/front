import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import Navigation from './components/Navigation'
import AssetList from './pages/assets/AssetList'
import Dashboard from './pages/dashboard/Dashboard'
import CredentialList from './pages/credentials/CredentialList'
import AssetDiscovery from './pages/discovery/AssetDiscovery'
import ChecklistList from './pages/checklist/ChecklistList'

const theme = createTheme({
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/credentials" element={<CredentialList />} />
          <Route path="/discovery" element={<AssetDiscovery />} />
          <Route path="/checklist" element={<ChecklistList />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
