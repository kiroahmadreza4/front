import { Box, Chip, Grid, Stack, Typography } from '@mui/material'
import DashboardMetricCard from '../../components/DashboardMetricCard'
import SectionTable from '../../components/SectionTable'
import { dashboardMetrics, recentAssets, securitySummary } from '../../config/dashboard'

const assetColumns = [
  { key: 'name', label: 'Asset' },
  { key: 'ip_address', label: 'IP address' },
  { key: 'criticality', label: 'Criticality' },
  { key: 'status', label: 'Status' },
]

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#e7eaf0', mb: 0.5 }}>
            Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#9aa3b5' }}>
            Security posture and critical asset monitoring
          </Typography>
        </Box>

        <Chip
          label="Last sync: 4m ago"
          sx={{
            bgcolor: '#1b2233',
            color: '#dfe7ff',
            border: '1px solid #2d3951',
            borderRadius: 999,
            fontSize: 11,
            px: 0.5,
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {dashboardMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <DashboardMetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <SectionTable title="Assets overview" columns={assetColumns} rows={recentAssets} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box
            sx={{
              bgcolor: '#131926',
              border: '1px solid #1d2432',
              borderRadius: 2,
              p: 2,
              height: '100%',
            }}
          >
            <Typography sx={{ color: '#e7eaf0', fontWeight: 600, mb: 2 }}>Priority watchlist</Typography>
            <Stack spacing={1.5}>
              {securitySummary.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#0f141f',
                    border: '1px solid #1a2130',
                    borderRadius: 1.5,
                    p: 1.25,
                  }}
                >
                  <Typography sx={{ color: '#9aa3b5', fontSize: 12 }}>{item.label}</Typography>
                  <Typography sx={{ color: '#e7eaf0', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
