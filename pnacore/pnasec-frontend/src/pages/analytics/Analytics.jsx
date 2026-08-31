import { Container, Typography, Paper } from '@mui/material'

const Analytics = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        📊 Analystic
      </Typography>

      <Paper sx={{ p: 4, border: '1px solid #1d2432', bgcolor: '#131926', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#9aa3b5', fontWeight: 600 }}>
          Coming soon
        </Typography>
      </Paper>
    </Container>
  )
}

export default Analytics
