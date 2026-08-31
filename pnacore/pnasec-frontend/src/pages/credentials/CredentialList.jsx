import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Add as AddIcon } from '@mui/icons-material'
import api from '../../services/api'

const CredentialList = () => {
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'port', headerName: 'Port', width: 100 },
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
        <Button variant="contained" startIcon={<AddIcon />}>
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
    </Container>
  )
}

export default CredentialList
