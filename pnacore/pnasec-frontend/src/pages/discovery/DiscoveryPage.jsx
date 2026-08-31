import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  FormControl,
} from '@mui/material'
import { PlayArrow as StartIcon, Search as SearchIcon } from '@mui/icons-material'

const discoveryMethods = ['Nmap', 'LDAP', 'Active Directory', 'API', 'CSV']

const DiscoveryPage = () => {
  const [method, setMethod] = useState('Nmap')
  const [target, setTarget] = useState('192.168.1.0/24')
  const [message, setMessage] = useState('')
  const [discovered, setDiscovered] = useState([
    { id: '1', name: 'web-prod-01', ip: '192.168.1.10', os: 'Ubuntu 22.04', status: 'Online' },
    { id: '2', name: 'db-prod-01', ip: '192.168.1.20', os: 'PostgreSQL 15', status: 'Online' },
  ])

  const handleDiscovery = () => {
    setMessage(`✅ ${method} discovery started against ${target}. Results are prepared for review.`)
    setDiscovered((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name: `scan-${current.length + 1}`,
        ip: '10.0.0.' + (current.length + 10),
        os: 'Detected via ' + method,
        status: 'New',
      },
    ])
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>🔎 Discovery</Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Scan Source</Typography>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Discovery Method</InputLabel>
                <Select value={method} label="Discovery Method" onChange={(e) => setMethod(e.target.value)}>
                  {discoveryMethods.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Target / Scope"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                fullWidth
              />

              <Button variant="contained" startIcon={<StartIcon />} onClick={handleDiscovery}>
                Start Discovery
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Available Discovery Sources</Typography>
            <Grid container spacing={2}>
              {discoveryMethods.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SearchIcon color="primary" />
                        <Chip label={item} size="small" variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Detected Hosts</Typography>
        <Grid container spacing={2}>
          {discovered.map((asset) => (
            <Grid item xs={12} sm={6} md={4} key={asset.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{asset.name}</Typography>
                  <Typography variant="body2">IP: {asset.ip}</Typography>
                  <Typography variant="body2">OS: {asset.os}</Typography>
                  <Chip label={asset.status} color={asset.status === 'Online' ? 'success' : 'warning'} size="small" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  )
}

export default DiscoveryPage
