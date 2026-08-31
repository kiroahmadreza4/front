import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import {
  AccountTree as RelationshipIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material'

const asset = {
  name: 'SRV-APP-01',
  ip: '10.10.20.15',
  hostname: 'SRV-APP-01',
  os: 'Windows Server 2022',
  type: 'Application Server',
  environment: 'Production',
  criticality: 'High',
  status: 'Active',
  securityScore: 78,
  compliance: 91,
  risk: 'HIGH',
  owner: 'Platform Team',
  department: 'Infrastructure',
  location: 'DC1',
  tags: ['Production', 'Customer-Facing', 'Web', 'PCI'],
}

const tabs = ['Overview', 'Security', 'Compliance', 'Findings', 'Relationships', 'Activity']

const AssetDetail = () => {
  const [tab, setTab] = useState(0)

  const relationships = useMemo(() => [
    { name: 'VMware ESXi01', type: 'Runs On' },
    { name: 'SQL-01', type: 'Connected To' },
    { name: 'ERP', type: 'Application' },
    { name: 'VLAN 120', type: 'Network' },
  ], [])

  const activity = useMemo(() => [
    { date: 'Aug 31', event: 'Security scan completed' },
    { date: 'Aug 30', event: 'IP changed from 10.10.20.14' },
    { date: 'Aug 28', event: 'New service detected: HTTPS' },
    { date: 'Aug 25', event: 'Owner changed to Platform Team' },
  ], [])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{asset.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {asset.ip} • {asset.os} • {asset.environment}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={asset.status} color="success" />
          <Chip label={asset.criticality} color="error" />
          <Chip label={`Risk ${asset.risk}`} color="warning" />
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Security Score</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{asset.securityScore}/100</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Compliance</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{asset.compliance}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Critical Findings</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>2</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">High Findings</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>7</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(event, nextTab) => setTab(nextTab)} variant="scrollable" scrollButtons="auto">
          {tabs.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Overview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Hostname</Typography><Typography>{asset.hostname}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">IP</Typography><Typography>{asset.ip}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">OS</Typography><Typography>{asset.os}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Type</Typography><Typography>{asset.type}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Owner</Typography><Typography>{asset.owner}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Department</Typography><Typography>{asset.department}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Location</Typography><Typography>{asset.location}</Typography></Grid>
                <Grid item xs={12} md={6}><Typography variant="body2" color="text.secondary">Environment</Typography><Typography>{asset.environment}</Typography></Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Tags</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {asset.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" />
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6">Security</Typography>
          </Stack>
          <Alert severity="warning">Critical findings: 2 • High findings: 7 • Security drift: 3</Alert>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <VerifiedIcon color="primary" />
            <Typography variant="h6">Compliance</Typography>
          </Stack>
          <Alert severity="success">Compliance score: 91% • CIS baseline passed: 184 of 200 checks</Alert>
        </Paper>
      )}

      {tab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Findings</Typography>
          <Stack spacing={1.5}>
            <Alert severity="error">Remote desktop exposure on port 3389</Alert>
            <Alert severity="warning">Antivirus not reporting on endpoint</Alert>
          </Stack>
        </Paper>
      )}

      {tab === 4 && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <RelationshipIcon color="primary" />
            <Typography variant="h6">Relationships</Typography>
          </Stack>
          <Grid container spacing={2}>
            {relationships.map((item) => (
              <Grid item xs={12} md={6} key={item.name}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">{item.type}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {tab === 5 && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <TimelineIcon color="primary" />
            <Typography variant="h6">Activity</Typography>
          </Stack>
          <Stack spacing={1.5}>
            {activity.map((item) => (
              <Box key={item.date} sx={{ p: 2, borderRadius: 2, bgcolor: '#121a2a' }}>
                <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                <Typography variant="body2">{item.event}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Container>
  )
}

export default AssetDetail
