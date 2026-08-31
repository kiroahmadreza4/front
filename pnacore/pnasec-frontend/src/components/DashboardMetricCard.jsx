import { Box, Card, CardContent, Typography } from '@mui/material'

const DashboardMetricCard = ({ title, value, suffix = '', icon: Icon, color = '#7c8cf0', tone = 'default' }) => {
  const palette = {
    default: { bg: '#131926', border: '#1d2432', text: '#e7eaf0' },
    danger: { bg: '#2a1518', border: '#3a1c22', text: '#f28b82' },
    success: { bg: '#11271d', border: '#1e3b2d', text: '#72d7a4' },
    warning: { bg: '#2b2013', border: '#3b2e1e', text: '#f7c66b' },
  }

  const style = palette[tone] || palette.default

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        background: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', color: '#5b6478', mb: 0.8 }}>
              {title}
            </Typography>
            <Typography
              sx={{
                color: style.text,
                fontSize: 22,
                fontWeight: 600,
                fontFamily: 'IBM Plex Mono, monospace',
                lineHeight: 1.2,
              }}
            >
              {value}
              {suffix}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${color}1A`,
              color,
            }}
          >
            {Icon ? <Icon fontSize="small" /> : null}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DashboardMetricCard
