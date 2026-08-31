import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Add as AddIcon } from '@mui/icons-material'
import api from '../../services/api'

const initialForm = {
  name: '',
  type: 'database',
  username: '',
  password: '',
  host: '',
  port: 22,
  domain: '',
  description: '',
  is_active: true,
}

const CredentialList = () => {
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState(initialForm)

  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'host', headerName: 'Host', width: 170 },
    { field: 'port', headerName: 'Port', width: 100 },
    { field: 'domain', headerName: 'Domain', width: 160 },
  ]

  const fetchCredentials = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/api/v1/credentials/')
      const data = response?.data?.data || []
      setCredentials(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load credentials'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCredential = async () => {
    try {
      const payload = {
        ...createForm,
        port: Number(createForm.port || 22),
        is_active: Boolean(createForm.is_active),
      }

      await api.post('/api/v1/credentials/', payload)
      setOpenCreateDialog(false)
      setCreateForm(initialForm)
      fetchCredentials()
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create credential'
      setError(message)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          🔐 Credential Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)}>
          Add Credential
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={credentials}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
        />
      </Paper>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Credential</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
              >
                <MenuItem value="database">Database</MenuItem>
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="ssh">SSH</MenuItem>
                <MenuItem value="web">Web</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Host"
                value={createForm.host}
                onChange={(e) => setCreateForm({ ...createForm, host: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Port"
                type="number"
                value={createForm.port}
                onChange={(e) => setCreateForm({ ...createForm, port: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Domain"
                value={createForm.domain}
                onChange={(e) => setCreateForm({ ...createForm, domain: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCredential} variant="contained">
            Save Credential
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CredentialList
