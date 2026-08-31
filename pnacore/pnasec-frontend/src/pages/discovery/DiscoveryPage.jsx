import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  AutoFixHigh as AutoFixIcon,
  Dns as DnsIcon,
  Lan as LanIcon,
  PlayArrow as StartIcon,
  Radar as RadarIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

const discoverySources = [
  { name: 'Network Discovery', icon: LanIcon, description: 'Scan local and routed network segments' },
  { name: 'Active Directory', icon: DnsIcon, description: 'Synchronize identities and endpoints' },
  { name: 'Nmap', icon: RadarIcon, description: 'Port, service, and host enumeration' },
  { name: 'API Discovery', icon: AutoFixIcon, description: 'Use API-based inventory sources' },
]

const initialJobs = [
  { id: 'job-1', name: 'DC-Network-01', target: '10.10.0.0/16', method: 'Nmap', status: 'Completed', found: 842, new: 17 },
  { id: 'job-2', name: 'AD-Inventory', target: 'corp.local', method: 'Active Directory', status: 'Running', found: 154, new: 6 },
  { id: 'job-3', name: 'Cloud Sync', target: 'aws-prod', method: 'API Discovery', status: 'Queued', found: 28, new: 2 },
]

const initialHosts = [
  { id: 'host-1', name: 'dc01.corp.local', ip: '10.10.0.5', os: 'Windows Server 2022', status: 'Online', source: 'Active Directory' },
  { id: 'host-2', name: 'web-prod-01', ip: '10.10.0.22', os: 'Ubuntu 22.04', status: 'Online', source: 'Nmap' },
  { id: 'host-3', name: 'db-prod-01', ip: '10.10.0.41', os: 'PostgreSQL 15', status: 'Online', source: 'Network Discovery' },
  { id: 'host-4', name: 'vpn-edge-01', ip: '10.10.0.61', os: 'OpenWrt', status: 'Online', source: 'Nmap' },
]

const DiscoveryPage = () => {
  const [method, setMethod] = useState('Nmap')
  const [target, setTarget] = useState('10.10.0.0/16')
  const [schedule, setSchedule] = useState('Every 6 Hours')
  const [scanActive, setScanActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [jobs] = useState(initialJobs)
  const [hosts, setHosts] = useState(initialHosts)
  const [methods, setMethods] = useState({ ICMP: true, TCP: true, DNS: true, SNMP: false })

  const summary = useMemo(() => ({
    total: hosts.length,
    online: hosts.filter((host) => host.status === 'Online').length,
    unknown: hosts.filter((host) => host.source === 'Network Discovery').length,
    new: jobs.reduce((sum, job) => sum + job.new, 0),
  }), [hosts])

  const startDiscovery = () => {
    setScanActive(true)
    setProgress(0)
    setMessage('')

    let current = 0
    const timer = setInterval(() => {
      current += 10
      setProgress(Math.min(current, 100))

      if (current >= 100) {
        clearInterval(timer)
        setScanActive(false)
        setMessage(`✅ ${method} discovery completed for ${target}.`)
        setHosts((currentHosts) => [
          ...currentHosts,
          {
            id: `host-${Date.now()}`,
            name: `scan-${currentHosts.length + 1}.corp.local`,
            ip: `10.10.0.${currentHosts.length + 70}`,
            os: 'Detected via ' + method,
            status: 'New',
            source: method,
          },
        ])
      }
    }, 220)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>🔎 Discovery</Typography>
          <Typography variant="body2" color="text.secondary">
            Network, identity, and API-based discovery for asset inventory creation.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<StartIcon />} onClick={startDiscovery} disabled={scanActive}>
          {scanActive ? 'Scanning...' : 'Start Discovery'}
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Discovered</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{summary.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Online</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{summary.online}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Unknown</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{summary.unknown}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">New Assets</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{summary.new}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>⚙️ Discovery Job</Typography>

            <Stack spacing={2}>
              <TextField label="Job Name" defaultValue="DC-Network-01" fullWidth />

              <FormControl fullWidth>
                <InputLabel>Discovery Method</InputLabel>
                <Select value={method} label="Discovery Method" onChange={(event) => setMethod(event.target.value)}>
                  {['Nmap', 'LDAP', 'Active Directory', 'API Discovery', 'CSV Import'].map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Target / Scope" value={target} onChange={(event) => setTarget(event.target.value)} fullWidth />

              <FormControl fullWidth>
                <InputLabel>Schedule</InputLabel>
                <Select value={schedule} label="Schedule" onChange={(event) => setSchedule(event.target.value)}>
                  <MenuItem value="Every 6 Hours">Every 6 Hours</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Methods</Typography>
                <Stack spacing={0.5}>
                  {Object.entries(methods).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={<Checkbox checked={value} onChange={() => setMethods((current) => ({ ...current, [key]: !current[key] }))} />}
                      label={key}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📡 Discovery Sources</Typography>
            <Grid container spacing={2}>
              {discoverySources.map((source) => {
                const Icon = source.icon
                return (
                  <Grid item xs={12} sm={6} key={source.name}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <Icon color="primary" />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{source.name}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{source.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📊 Discovery Progress</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Scan status</Typography>
                <Typography variant="body2">{scanActive ? `${progress}%` : 'Ready'}</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, borderRadius: 999, bgcolor: '#1d2432', overflow: 'hidden' }}>
                <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: 'primary.main' }} />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {scanActive ? 'Scanning target network and collecting endpoint metadata...' : 'No active discovery job.'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>🧾 Recent Jobs</Typography>
            <Stack spacing={2}>
              {jobs.map((job) => (
                <Box key={job.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, bgcolor: '#121a2a' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{job.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{job.target} • {job.method}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label={job.status} size="small" color={job.status === 'Completed' ? 'success' : job.status === 'Running' ? 'warning' : 'default'} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {job.found} found • {job.new} new
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>🖥️ Discovered Hosts</Typography>
        <Grid container spacing={2}>
          {hosts.map((host) => (
            <Grid item xs={12} sm={6} md={3} key={host.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                    <SearchIcon color="primary" />
                    <Chip label={host.status} size="small" color={host.status === 'Online' ? 'success' : 'warning'} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{host.name}</Typography>
                  <Typography variant="body2" color="text.secondary">IP: {host.ip}</Typography>
                  <Typography variant="body2" color="text.secondary">OS: {host.os}</Typography>
                  <Typography variant="caption" color="text.secondary">Source: {host.source}</Typography>
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
