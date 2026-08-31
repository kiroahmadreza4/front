import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  FilterAlt as FilterIcon,
  Key as KeyIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const initialAssets = [
  { id: '1', name: 'web-prod-01', hostname: 'web-prod-01', ip_address: '192.168.1.10', type: 'Server', os: 'Ubuntu 22.04', group: 'Production', owner: 'Platform', status: 'Active', criticality: 'High', credential: 'Linked', source: 'Nmap' },
  { id: '2', name: 'db-prod-01', hostname: 'db-prod-01', ip_address: '192.168.1.20', type: 'Database', os: 'PostgreSQL 15', group: 'Production', owner: 'Data', status: 'Active', criticality: 'High', credential: 'Linked', source: 'Active Directory' },
  { id: '3', name: 'app-staging-01', hostname: 'app-staging-01', ip_address: '192.168.10.15', type: 'Application', os: 'Ubuntu 22.04', group: 'Development', owner: 'Engineering', status: 'Warning', criticality: 'Medium', credential: 'Missing', source: 'LDAP' },
  { id: '4', name: 'vpn-edge-01', hostname: 'vpn-edge-01', ip_address: '10.0.0.10', type: 'Network', os: 'OpenWrt', group: 'DMZ', owner: 'Security', status: 'Active', criticality: 'High', credential: 'Linked', source: 'CSV' },
  { id: '5', name: 'win-ops-22', hostname: 'win-ops-22', ip_address: '192.168.1.42', type: 'Workstation', os: 'Windows 11', group: 'Remote Users', owner: 'IT Ops', status: 'Offline', criticality: 'Low', credential: 'Missing', source: 'Manual' },
]

const normalizeAsset = (asset) => ({
  id: asset.id || asset.ID || `${asset.ip_address || asset.ip || Date.now()}`,
  name: asset.name || asset.hostname || 'Unnamed asset',
  hostname: asset.hostname || asset.name || 'Unknown',
  ip_address: asset.ip_address || asset.ip || '0.0.0.0',
  type: asset.type || asset.asset_type || 'Server',
  os: asset.os || 'Unknown OS',
  group: asset.group || asset.environment || 'Production',
  owner: asset.owner || 'Unassigned',
  status: asset.status || 'Active',
  criticality: asset.criticality || 'Medium',
  credential: asset.credential_id ? 'Linked' : 'Missing',
  source: asset.source || 'Manual',
})

const AssetManagement = () => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [criticalityFilter, setCriticalityFilter] = useState('All')
  const [groupFilter, setGroupFilter] = useState('All')
  const [selectedIds, setSelectedIds] = useState([])
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    ip_address: '',
    hostname: '',
    type: '',
    os: '',
    group: '',
    owner: '',
    status: '',
    criticality: '',
    credential: '',
  })

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)

      try {
        const response = await api.get('/api/v1/assets/')
        const rawAssets = response?.data?.data || []
        const nextAssets = Array.isArray(rawAssets) ? rawAssets.map(normalizeAsset) : []
        setAssets(nextAssets.length > 0 ? nextAssets : initialAssets)
      } catch (error) {
        console.error('Failed to load assets from API, using fallback data:', error)
        setAssets(initialAssets)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const filteredAssets = useMemo(() => {
    const search = query.trim().toLowerCase()

    return assets.filter((asset) => {
      const matchesQuery =
        !search ||
        [
          asset.name,
          asset.hostname,
          asset.ip_address,
          asset.type,
          asset.os,
          asset.group,
          asset.owner,
          asset.credential,
          asset.source,
        ].some((value) => String(value).toLowerCase().includes(search))

      const matchesType = typeFilter === 'All' || asset.type === typeFilter
      const matchesStatus = statusFilter === 'All' || asset.status === statusFilter
      const matchesCriticality = criticalityFilter === 'All' || asset.criticality === criticalityFilter
      const matchesGroup = groupFilter === 'All' || asset.group === groupFilter

      return matchesQuery && matchesType && matchesStatus && matchesCriticality && matchesGroup
    })
  }, [assets, criticalityFilter, groupFilter, query, statusFilter, typeFilter])

  const stats = useMemo(() => ({
    total: assets.length,
    active: assets.filter((asset) => asset.status === 'Active').length,
    highRisk: assets.filter((asset) => asset.criticality === 'High').length,
    linked: assets.filter((asset) => asset.credential === 'Linked').length,
  }), [assets])

  const handleEdit = (row) => {
    setSelectedAsset(row)
    setEditForm({
      name: row.name,
      ip_address: row.ip_address,
      hostname: row.hostname,
      type: row.type,
      os: row.os,
      group: row.group,
      owner: row.owner,
      status: row.status,
      criticality: row.criticality,
      credential: row.credential,
    })
    setOpenEditDialog(true)
  }

  const handleSaveEdit = () => {
    if (!selectedAsset) return

    setAssets((current) =>
      current.map((asset) =>
        asset.id === selectedAsset.id
          ? { ...asset, ...editForm }
          : asset,
      ),
    )

    setOpenEditDialog(false)
    setSelectedAsset(null)
  }

  const handleDelete = (id) => {
    setAssets((current) => current.filter((asset) => asset.id !== id))
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
  }

  const handleBulkDelete = () => {
    setAssets((current) => current.filter((asset) => !selectedIds.includes(asset.id)))
    setSelectedIds([])
  }

  const handleExport = () => {
    const rows = filteredAssets.map((asset) => ({
      Name: asset.name,
      IP: asset.ip_address,
      Hostname: asset.hostname,
      Type: asset.type,
      OS: asset.os,
      Group: asset.group,
      Owner: asset.owner,
      Status: asset.status,
      Criticality: asset.criticality,
      Credential: asset.credential,
    }))

    const csv = [
      ['Name', 'IP', 'Hostname', 'Type', 'OS', 'Group', 'Owner', 'Status', 'Criticality', 'Credential'],
      ...rows.map((row) => [row.Name, row.IP, row.Hostname, row.Type, row.OS, row.Group, row.Owner, row.Status, row.Criticality, row.Credential]),
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'assets-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 170 },
    { field: 'ip_address', headerName: 'IP', flex: 0.8, minWidth: 120 },
    { field: 'hostname', headerName: 'Hostname', flex: 0.9, minWidth: 130 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 120 },
    { field: 'os', headerName: 'OS', flex: 1, minWidth: 150 },
    { field: 'group', headerName: 'Group', flex: 0.9, minWidth: 120 },
    { field: 'owner', headerName: 'Owner', flex: 0.9, minWidth: 120 },
    { field: 'status', headerName: 'Status', flex: 0.7, minWidth: 110, renderCell: (params) => (
      <Chip label={params.value} size="small" color={params.value === 'Active' ? 'success' : params.value === 'Warning' ? 'warning' : 'default'} />
    ) },
    { field: 'criticality', headerName: 'Criticality', flex: 0.8, minWidth: 110, renderCell: (params) => (
      <Chip label={params.value} size="small" color={params.value === 'High' ? 'error' : params.value === 'Medium' ? 'warning' : 'success'} />
    ) },
    { field: 'credential', headerName: 'Credential', flex: 0.8, minWidth: 110, renderCell: (params) => (
      <Chip label={params.value} size="small" variant={params.value === 'Linked' ? 'filled' : 'outlined'} color={params.value === 'Linked' ? 'primary' : 'default'} />
    ) },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.9,
      minWidth: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<KeyIcon />} component={Link} to="/credentials" sx={{ minWidth: 0 }}>
            Cred
          </Button>
          <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>📦 Asset Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Nessus-style inventory, filtering, assignment, and asset operations.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button component={Link} to="/assets/new" variant="contained" startIcon={<AddIcon />}>
            Add Asset
          </Button>
          <Button component={Link} to="/assets/groups" variant="outlined">
            Groups
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total Assets</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Active</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{stats.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">High Risk</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{stats.highRisk}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Credential Linked</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{stats.linked}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, IP, OS, group, owner..."
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} label="Type" onChange={(event) => setTypeFilter(event.target.value)}>
                <MenuItem value="All">All</MenuItem>
                {['Server', 'Database', 'Application', 'Network', 'Workstation'].map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Criticality</InputLabel>
              <Select value={criticalityFilter} label="Criticality" onChange={(event) => setCriticalityFilter(event.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Group</InputLabel>
              <Select value={groupFilter} label="Group" onChange={(event) => setGroupFilter(event.target.value)}>
                <MenuItem value="All">All</MenuItem>
                {['Production', 'Development', 'DMZ', 'Remote Users'].map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="body2" color="text.secondary">
            {filteredAssets.length} assets match the current filters.
          </Typography>
        </Box>

        <Button variant="outlined" color="error" onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
          Delete Selected ({selectedIds.length})
        </Button>
      </Box>

      <Paper sx={{ height: 560, width: '100%' }}>
        {loading ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredAssets}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selection) => setSelectedIds(selection)}
            rowSelectionModel={selectedIds}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          />
        )}
      </Paper>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Asset</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField label="Name" fullWidth value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Hostname" fullWidth value={editForm.hostname} onChange={(event) => setEditForm({ ...editForm, hostname: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="IP Address" fullWidth value={editForm.ip_address} onChange={(event) => setEditForm({ ...editForm, ip_address: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="OS" fullWidth value={editForm.os} onChange={(event) => setEditForm({ ...editForm, os: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Type" fullWidth value={editForm.type} onChange={(event) => setEditForm({ ...editForm, type: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Group" fullWidth value={editForm.group} onChange={(event) => setEditForm({ ...editForm, group: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Owner" fullWidth value={editForm.owner} onChange={(event) => setEditForm({ ...editForm, owner: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Credential" fullWidth value={editForm.credential} onChange={(event) => setEditForm({ ...editForm, credential: event.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={editForm.status} label="Status" onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Warning">Warning</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Criticality</InputLabel>
                <Select value={editForm.criticality} label="Criticality" onChange={(event) => setEditForm({ ...editForm, criticality: event.target.value })}>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Alert severity="info" sx={{ mt: 3 }}>
        Asset records are currently presented as a working UI layer. This page supports filtering, bulk selection, editing, delete, export, and quick credential linking to the credential module.
      </Alert>
    </Container>
  )
}

export default AssetManagement
