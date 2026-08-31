import { useState, useEffect } from 'react'
import { Container, Typography, Paper, Box, CircularProgress, Alert, Button, TextField, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, Snackbar } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Refresh as RefreshIcon, Download as DownloadIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import * as XLSX from 'xlsx'
import api from '../../services/api'

const AssetList = () => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', ip_address: '', hostname: '', os: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const columns = [
    { field: 'name', headerName: 'Asset Name', width: 180 },
    { field: 'ip_address', headerName: 'IP', width: 130 },
    { field: 'hostname', headerName: 'Hostname', width: 150 },
    { field: 'os', headerName: 'OS', width: 140 },
    {
      field: 'criticality',
      headerName: 'Criticality',
      width: 110,
      renderCell: (params) => (
        <Box sx={{ color: params.value === 'high' ? '#d32f2f' : params.value === 'medium' ? '#ed6c02' : '#2e7d32', fontWeight: 500 }}>
          {params.value === 'high' ? 'High' : params.value === 'medium' ? 'Medium' : 'Low'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const handleEdit = (asset) => {
    setSelectedAsset(asset)
    setEditForm({ name: asset.name || '', ip_address: asset.ip_address || '', hostname: asset.hostname || '', os: asset.os || '' })
    setOpenEditDialog(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return
    try {
      await api.delete(`/api/v1/assets/${id}`)
      setSnackbar({ open: true, message: '✅ Asset deleted successfully', severity: 'success' })
      fetchAssets()
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Delete failed', severity: 'error' })
    }
  }

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/v1/assets/${selectedAsset.id}`, editForm)
      setSnackbar({ open: true, message: '✅ Asset updated successfully', severity: 'success' })
      setOpenEditDialog(false)
      fetchAssets()
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Update failed', severity: 'error' })
    }
  }

  const exportToExcel = () => {
    const exportData = assets.map(row => ({ 'Name': row.name, 'IP': row.ip_address, 'Hostname': row.hostname, 'OS': row.os }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Assets')
    XLSX.writeFile(wb, `assets_${new Date().toISOString().slice(0,10)}.xlsx`)
  }

  const fetchAssets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/api/v1/assets/')
      const data = response.data.data || []
      setAssets(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const filteredData = assets.filter(row => 
    row.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    row.ip_address?.toLowerCase().includes(searchText.toLowerCase())
  )

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={60} /></Box>
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>📦 Asset Management</Typography>
        <Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAssets} sx={{ mr: 1 }}>Refresh</Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportToExcel}>Export Excel</Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
        />
      </Paper>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={filteredData} columns={columns} getRowId={(row) => row.id} loading={loading} />
      </Paper>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>✏️ Edit Asset</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" fullWidth value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <TextField margin="dense" label="IP" fullWidth value={editForm.ip_address} onChange={(e) => setEditForm({ ...editForm, ip_address: e.target.value })} />
          <TextField margin="dense" label="Hostname" fullWidth value={editForm.hostname} onChange={(e) => setEditForm({ ...editForm, hostname: e.target.value })} />
          <TextField margin="dense" label="OS" fullWidth value={editForm.os} onChange={(e) => setEditForm({ ...editForm, os: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  )
}

export default AssetList
