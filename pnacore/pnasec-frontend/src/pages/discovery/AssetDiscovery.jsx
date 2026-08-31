import { useState } from 'react'
import { Container, Typography, Paper, Box, Button, TextField, Alert, LinearProgress, Grid, Card, CardContent } from '@mui/material'
import { PlayArrow as StartIcon, Computer as ComputerIcon } from '@mui/icons-material'

const AssetDiscovery = () => {
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [discoveredAssets, setDiscoveredAssets] = useState([])

  const startScan = () => {
    setScanning(true)
    setScanProgress(0)
    setDiscoveredAssets([])
    setMessage('')

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)
        const mockAssets = [
          { id: '1', name: 'Database-Server', ip_address: '192.168.1.50', os: 'Ubuntu 22.04' },
          { id: '2', name: 'Mail-Server', ip_address: '192.168.1.60', os: 'CentOS 8' },
          { id: '3', name: 'DNS-Server', ip_address: '192.168.1.70', os: 'Windows Server 2022' },
        ]
        setDiscoveredAssets(mockAssets)
        setScanProgress(100)
        setMessage('✅ Scan completed successfully!')
        setScanning(false)
      }
      setScanProgress(Math.min(progress, 100))
    }, 300)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🔍 Asset Discovery
      </Typography>

      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>⚙️ Scan Settings</Typography>
            <TextField
              fullWidth
              label="Network Range"
              defaultValue="192.168.1.0/24"
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<StartIcon />}
              onClick={startScan}
              disabled={scanning}
            >
              Start Scan
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📊 Scan Status</Typography>
            {scanning && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Scanning...</Typography>
                  <Typography>{scanProgress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={scanProgress} />
              </Box>
            )}
            {!scanning && scanProgress === 0 && (
              <Typography color="text.secondary">Click "Start Scan" to begin.</Typography>
            )}
          </Paper>
        </Grid>

        {discoveredAssets.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>🖥️ Discovered Assets</Typography>
              <Grid container spacing={2}>
                {discoveredAssets.map((asset) => (
                  <Grid item xs={12} sm={6} md={4} key={asset.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ComputerIcon color="primary" />
                          <Typography variant="subtitle1">{asset.name}</Typography>
                        </Box>
                        <Typography variant="body2">IP: {asset.ip_address}</Typography>
                        <Typography variant="body2">OS: {asset.os}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default AssetDiscovery
