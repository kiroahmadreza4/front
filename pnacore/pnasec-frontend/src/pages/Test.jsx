import { Container, Typography, Paper, Button } from '@mui/material'

const Test = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 700 }}>
          🚀 PNaSec Platform
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, color: '#333' }}>
          Test Page - It's Working!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
          If you see this, React is rendering correctly.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 3 }}
          onClick={() => alert('Hello from PNaSec!')}
        >
          Click Me
        </Button>
      </Paper>
    </Container>
  )
}

export default Test
