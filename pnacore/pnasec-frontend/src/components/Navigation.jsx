import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  VpnKey as VpnKeyIcon,
  Search as SearchIcon,
  Assignment as ChecklistIcon,
} from '@mui/icons-material'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/assets', label: 'Assets', icon: <ListIcon /> },
    { path: '/credentials', label: 'Credentials', icon: <VpnKeyIcon /> },
    { path: '/discovery', label: 'Discovery', icon: <SearchIcon /> },
    { path: '/checklist', label: 'Checklist', icon: <ChecklistIcon /> },
  ]

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1a237e' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700 }}>
          🚀 PNaSec
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                borderBottom: location.pathname === item.path ? '3px solid #64b5f6' : 'none',
                borderRadius: 0,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
