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
import { Add as AddIcon, Link as LinkIcon } from '@mui/icons-material'
import api from '../../services/api'

const assetTypes = ['Server', 'Database', 'Application', 'Network', 'Workstation', 'Cloud']
const sources = ['Manual', 'LDAP', 'CSV', 'Active Directory', 'Nmap', 'API']

const defaultForm = {
  name: '',
  ip_address: '',
  hostname: '',
  os: '',
  type: 'Server',
  source: 'Manual',
  owner: '',
  group: 'Production',
  criticality: 'Medium',
  environment: 'Production',
  description: '',
  hasCredential: false,
}

const AddAsset = () => {
  const [form, setForm] = useState(defaultForm)
  const [message, setMessage] = useState('')

  const summary = useMemo(() => {
    const fields = [
      form.name && 'Name',
      form.ip_address && 'IP',
      form.hostname && 'Hostname',
      form.os && 'OS',
      form.type && 'Type',
      form.group && 'Group',
      form.owner && 'Owner',
    ].filter(Boolean)

    return fields.length
  }, [form])

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.ip_address) {
      setMessage('Name and IP address are required.')
      return
    }

    try {
      const payload = {
        name: form.name,
        hostname: form.hostname,
        ip_address: form.ip_address,
        os: form.os,
        source: form.source,
        criticality: form.criticality,
        environment: form.environment,
        owner: form.owner,
        description: form.description,
        status: 'active',
      }

      await api.post('/api/v1/assets/', payload)
      setMessage('✅ Asset was created successfully via the backend API.')
      setForm(defaultForm)
    } catch (error) {
      console.error('Asset create failed:', error)
      setMessage('❌ Asset creation failed. Please review the backend validation rules.')
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>➕ Add Asset</Typography>
          <Typography variant="body2" color="text.secondary">
            Add asset records manually or via discovery integrations.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleSubmit}>
          Save Asset
        </Button>
      </Box>

      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField label="Asset Name" value={form.name} onChange={handleChange('name')} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Hostname" value={form.hostname} onChange={handleChange('hostname')} fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="IP Address" value={form.ip_address} onChange={handleChange('ip_address')} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Operating System" value={form.os} onChange={handleChange('os')} fullWidth />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={form.type} label="Type" onChange={handleChange('type')}>
                      {assetTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Source</InputLabel>
                    <Select value={form.source} label="Source" onChange={handleChange('source')}>
                      {sources.map((source) => (
                        <MenuItem key={source} value={source}>{source}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Criticality</InputLabel>
                    <Select value={form.criticality} label="Criticality" onChange={handleChange('criticality')}>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField label="Owner" value={form.owner} onChange={handleChange('owner')} fullWidth />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField label="Group" value={form.group} onChange={handleChange('group')} fullWidth />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Environment</InputLabel>
                    <Select value={form.environment} label="Environment" onChange={handleChange('environment')}>
                      <MenuItem value="Production">Production</MenuItem>
                      <MenuItem value="Staging">Staging</MenuItem>
                      <MenuItem value="Development">Development</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={form.description}
                    onChange={handleChange('description')}
                    multiline
                    minRows={3}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={form.hasCredential} onChange={handleChange('hasCredential')} />}
                    label="This asset should have a credential assigned"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`${summary} fields filled`} color="primary" variant="outlined" />
                  <Chip label={form.type} color="secondary" variant="outlined" />
                  <Chip label={form.source} variant="outlined" />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Import Sources</Typography>
                <Stack spacing={1}>
                  {sources.map((source) => (
                    <Box key={source} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{source}</Typography>
                      <LinkIcon color="primary" fontSize="small" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AddAsset
