import { Box, Typography, Avatar, IconButton, Stack } from '@mui/material'
import {
  NotificationsNoneRounded as NotificationsIcon,
  ShieldRounded as ShieldIcon,
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { navigationGroups, getNavItemByPath } from '../config/navigation'

const sidebarItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.1,
  width: '100%',
  borderRadius: 1.5,
  px: 1.25,
  py: 1,
  color: '#9aa3b5',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: '#1b2233',
    color: '#e7eaf0',
  },
}

const AppShell = ({ children }) => {
  const location = useLocation()
  const activeItem = getNavItemByPath(location.pathname)
  const currentSection = navigationGroups.find((group) =>
    group.items.some((item) => item.path === activeItem.path),
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0b0f17', color: '#e7eaf0' }}>
      <Box
        sx={{
          width: 220,
          bgcolor: '#0f141f',
          borderRight: '1px solid #1d2432',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          p: 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5 }}>
          <ShieldIcon sx={{ fontSize: 20, color: '#7c8cf0' }} />
          <Typography variant="subtitle1" sx={{ color: '#e7eaf0', fontWeight: 600 }}>
            PNaSec
          </Typography>
        </Box>

        {navigationGroups.map((group) => (
          <Box key={group.title}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#5b6478',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: 10,
                px: 1.25,
                pb: 0.75,
              }}
            >
              {group.title}
            </Typography>

            <Stack spacing={0.75}>
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = item.path === activeItem.path

                return (
                  <Box
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      ...sidebarItemStyles,
                      bgcolor: isActive ? '#1b2233' : 'transparent',
                      color: isActive ? '#e7eaf0' : '#9aa3b5',
                      boxShadow: isActive ? 'inset 0 0 0 1px rgba(124,140,240,0.3)' : 'none',
                    }}
                  >
                    <Icon sx={{ fontSize: 18, color: isActive ? '#7c8cf0' : 'inherit' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>
                      {item.label}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        ))}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          sx={{
            height: 58,
            borderBottom: '1px solid #1d2432',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            bgcolor: '#0d121a',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#5b6478', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}
          >
            {currentSection?.title || 'Overview'} / {activeItem.label}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton size="small" sx={{ color: '#9aa3b5' }} aria-label="notifications">
              <NotificationsIcon fontSize="small" />
            </IconButton>
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#1b2233', color: '#c6cbe0', fontSize: 11 }}>
              AD
            </Avatar>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: 2.5, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default AppShell
