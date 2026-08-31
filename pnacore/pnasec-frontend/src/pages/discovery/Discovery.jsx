import React from 'react'
import { Container, Typography, Paper } from '@mui/material'

const Discovery = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          🔍 صفحه کشف دارایی‌ها
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          این صفحه برای تست نمایش داده شده است.
        </Typography>
      </Paper>
    </Container>
  )
}

export default Discovery
