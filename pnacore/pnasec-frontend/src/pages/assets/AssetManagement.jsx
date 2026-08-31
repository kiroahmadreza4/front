import { useState, useEffect } from 'react'
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Tabs, Tab, TextField, Button, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, FormControl, InputLabel, Select,
  Alert, Snackbar, Divider, InputAdornment,
  List, ListItem, ListItemText, ListItemIcon, Checkbox,
  Avatar, AvatarGroup, Chip as MuiChip,
  CircularProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Computer as ComputerIcon,
  Domain as DomainIcon,
  FileCopy as FileCopyIcon,
  NetworkCheck as NetworkCheckIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const AssetManagement = () => {
  // ===== STATE =====
  const [tabValue, setTabValue] = useState(0)
  const [assets, setAssets] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({ os: '', type: '', criticality: '', group: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([])
  const [openBulkGroupDialog, setOpenBulkGroupDialog] = useState(false)
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false)
  const [bulkTargetGroup, setBulkTargetGroup] = useState('')

  // Dialogs
  const [openGroupDialog, setOpenGroupDialog] = useState(false)
  const [openAssetGroupsDialog, setOpenAssetGroupsDialog] = useState(false)
  const [openGroupDetailDialog, setOpenGroupDetailDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [selectedGroupsForAsset, setSelectedGroupsForAsset] = useState([])
  const [actionLoading, setActionLoading] = useState(false)


// ===== LOAD DATA =====
useEffect(() => {
  // Sample data
  const sampleAssets = [
    { id: '1', name: 'WebServer-01', ip_address: '192.168.1.10', hostname: 'web-01.local', os: 'Ubuntu', type: 'Server', criticality: 'high', status: 'active', groups: ['group-1', 'group-3'] },
    { id: '2', name: 'DB-01', ip_address: '192.168.1.20', hostname: 'db-01.local', os: 'Windows Server', type: 'Database', criticality: 'high', status: 'active', groups: ['group-1'] },
    { id: '3', name: 'DNS-01', ip_address: '192.168.1.30', hostname: 'dns-01.local', os: 'CentOS', type: 'Infrastructure', criticality: 'medium', status: 'active', groups: ['group-3'] },
    { id: '4', name: 'Dev-Web-01', ip_address: '192.168.2.10', hostname: 'dev-web-01.local', os: 'Ubuntu', type: 'Server', criticality: 'low', status: 'active', groups: ['group-2'] },
    { id: '5', name: 'Firewall-01', ip_address: '192.168.1.1', hostname: 'fw-01.local', os: 'Cisco IOS', type: 'Network', criticality: 'high', status: 'active', groups: ['group-3', 'group-4'] },
    { id: '6', name: 'DC-01', ip_address: '192.168.1.5', hostname: 'dc-01.local', os: 'Windows Server', type: 'Domain Controller', criticality: 'high', status: 'active', groups: ['group-4'] },
  ]

  const sampleGroups = [
    { id: 'group-1', name: 'Production Servers', description: 'All production servers', color: '#1976d2' },
    { id: 'group-2', name: 'Development', description: 'Development environment', color: '#2e7d32' },
    { id: 'group-3', name: 'DMZ', description: 'DMZ network zone', color: '#ed6c02' },
    { id: 'group-4', name: 'Domain Controllers', description: 'Active Directory DCs', color: '#9c27b0' },
  ]

  setAssets(sampleAssets)
  setGroups(sampleGroups)
  setLoading(false)
}, [])

  //const sampleAssets = [
  //  { id: '1', name: 'WebServer-01', ip_address: '192.168.1.10', hostname: 'web-01.local', os: 'Ubuntu', type: 'Server', criticality: 'high', status: 'active', groups: ['group-1', 'group-3'] },
  //  { id: '2', name: 'DB-01', ip_address: '192.168.1.20', hostname: 'db-01.local', os: 'Windows Server', type: 'Database', criticality: 'high', status: 'active', groups: ['group-1'] },
  //  { id: '3', name: 'DNS-01', ip_address: '192.168.1.30', hostname: 'dns-01.local', os: 'CentOS', type: 'Infrastructure', criticality: 'medium', status: 'active', groups: ['group-3'] },
   // { id: '4', name: 'Dev-Web-01', ip_address: '192.168.2.10', hostname: 'dev-web-01.local', os: 'Ubuntu', type: 'Server', criticality: 'low', status: 'active', groups: ['group-2'] },
  //  { id: '5', name: 'Firewall-01', ip_address: '192.168.1.1', hostname: 'fw-01.local', os: 'Cisco IOS', type: 'Network', criticality: 'high', status: 'active', groups: ['group-3', 'group-4'] },
  //  { id: '6', name: 'DC-01', ip_address: '192.168.1.5', hostname: 'dc-01.local', os: 'Windows Server', type: 'Domain Controller', criticality: 'high', status: 'active', groups: ['group-4'] },
  //  { id: '7', name: 'MailServer-01', ip_address: '192.168.1.40', hostname: 'mail-01.local', os: 'Ubuntu', type: 'Server', criticality: 'medium', status: 'active', groups: ['group-1'] },
  //  { id: '8', name: 'Proxy-01', ip_address: '192.168.1.50', hostname: 'proxy-01.local', os: 'CentOS', type: 'Network', criticality: 'medium', status: 'active', groups: ['group-3'] },
 // ]

//  const sampleGroups = [
 //   { id: 'group-1', name: 'Production Servers', description: 'All production servers', color: '#1976d2', count: 0 },
 //   { id: 'group-2', name: 'Development', description: 'Development environment', color: '#2e7d32', count: 0 },
 //   { id: 'group-3', name: 'DMZ', description: 'DMZ network zone', color: '#ed6c02', count: 0 },
 //   { id: 'group-4', name: 'Domain Controllers', description: 'Active Directory DCs', color: '#9c27b0', count: 0 },
 // ]

  // Load data
  useEffect(() => {
    setAssets(sampleAssets)
    setGroups(sampleGroups)
    setLoading(false)
  }, [])

  // ===== HELPERS =====
  const getGroupById = (id) => groups.find(g => g.id === id)
  const getGroupName = (id) => getGroupById(id)?.name || id
  const getGroupColor = (id) => getGroupById(id)?.color || '#999'
  const getAssetsByGroup = (groupId) => assets.filter(a => a.groups?.includes(groupId))
  const getAssetGroups = (assetId) => {
    const asset = assets.find(a => a.id === assetId)
    return asset?.groups || []
  }

  // ===== BULK ACTIONS =====
  const handleBulkAddToGroup = () => {
    if (!bulkTargetGroup) {
      setSnackbar({ open: true, message: '❌ Please select a group', severity: 'error' })
      return
    }
    setActionLoading(true)
    setTimeout(() => {
      const updatedAssets = assets.map(a => {
        if (selectedIds.includes(a.id)) {
          const currentGroups = a.groups || []
          return {
            ...a,
            groups: currentGroups.includes(bulkTargetGroup) 
              ? currentGroups 
              : [...currentGroups, bulkTargetGroup]
          }
        }
        return a
      })
      setAssets(updatedAssets)
      setSelectedIds([])
      setOpenBulkGroupDialog(false)
      setBulkTargetGroup('')
      setActionLoading(false)
      setSnackbar({ 
        open: true, 
        message: `✅ ${selectedIds.length} assets added to group "${getGroupName(bulkTargetGroup)}"`, 
        severity: 'success' 
      })
    }, 500)
  }

  const handleBulkDelete = () => {
    setActionLoading(true)
    setTimeout(() => {
      const updatedAssets = assets.filter(a => !selectedIds.includes(a.id))
      setAssets(updatedAssets)
      setSelectedIds([])
      setOpenBulkDeleteDialog(false)
      setActionLoading(false)
      setSnackbar({ 
        open: true, 
        message: `🗑️ ${selectedIds.length} assets deleted successfully`, 
        severity: 'success' 
      })
    }, 500)
  }

  const handleBulkRemoveFromGroup = (groupId) => {
    if (!window.confirm(`Remove ${selectedIds.length} assets from group "${getGroupName(groupId)}"?`)) return
    setActionLoading(true)
    setTimeout(() => {
      const updatedAssets = assets.map(a => {
        if (selectedIds.includes(a.id)) {
          return {
            ...a,
            groups: (a.groups || []).filter(g => g !== groupId)
          }
        }
        return a
      })
      setAssets(updatedAssets)
      setSelectedIds([])
      setActionLoading(false)
      setSnackbar({ 
        open: true, 
        message: `✅ ${selectedIds.length} assets removed from group "${getGroupName(groupId)}"`, 
        severity: 'success' 
      })
    }, 500)
  }

  // ===== HANDLERS =====
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      setSnackbar({ open: true, message: '❌ Please enter group name', severity: 'error' })
      return
    }
    const newGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      description: newGroupDesc || 'No description',
      color: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#7b1fa2'][groups.length % 7],
      count: 0
    }
    setGroups([...groups, newGroup])
    setOpenGroupDialog(false)
    setNewGroupName('')
    setNewGroupDesc('')
    setSnackbar({ open: true, message: `✅ Group "${newGroupName}" created`, severity: 'success' })
  }

  const handleDeleteGroup = (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return
    const updatedAssets = assets.map(a => ({
      ...a,
      groups: a.groups?.filter(g => g !== groupId) || []
    }))
    setAssets(updatedAssets)
    setGroups(groups.filter(g => g.id !== groupId))
    setSnackbar({ open: true, message: '🗑️ Group deleted', severity: 'success' })
  }

  const handleOpenAssetGroups = (asset) => {
    setSelectedAsset(asset)
    setSelectedGroupsForAsset(asset.groups || [])
    setOpenAssetGroupsDialog(true)
  }

  const handleSaveAssetGroups = () => {
    const updatedAssets = assets.map(a => 
      a.id === selectedAsset.id ? { ...a, groups: selectedGroupsForAsset } : a
    )
    setAssets(updatedAssets)
    setOpenAssetGroupsDialog(false)
    setSnackbar({ open: true, message: `✅ Groups updated for ${selectedAsset.name}`, severity: 'success' })
  }

  const handleToggleGroupForAsset = (groupId) => {
    setSelectedGroupsForAsset(prev =>
      prev.includes(groupId) 
        ? prev.filter(g => g !== groupId) 
        : [...prev, groupId]
    )
  }

  const handleViewGroupAssets = (group) => {
    setSelectedGroup(group)
    setOpenGroupDetailDialog(true)
  }

  // ===== COLUMNS =====
  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'ip_address', headerName: 'IP', width: 130 },
    { field: 'hostname', headerName: 'Hostname', width: 150 },
    { field: 'os', headerName: 'OS', width: 120 },
    { field: 'type', headerName: 'Type', width: 120 },
    {
      field: 'criticality',
      headerName: 'Criticality',
      width: 110,
      renderCell: (params) => (
        <Chip label={params.value || 'Medium'} size="small" color={
          params.value === 'high' ? 'error' : params.value === 'medium' ? 'warning' : 'success'
        } />
      ),
    },
    {
      field: 'groups',
      headerName: 'Groups',
      width: 200,
      renderCell: (params) => {
        const assetGroups = params.value || []
        if (assetGroups.length === 0) return <Typography variant="caption" color="text.secondary">No groups</Typography>
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {assetGroups.slice(0, 3).map(gid => {
              const group = getGroupById(gid)
              return group ? (
                <Chip key={gid} label={group.name} size="small" sx={{ bgcolor: group.color, color: '#fff', fontSize: '0.65rem' }} />
              ) : null
            })}
            {assetGroups.length > 3 && (
              <Chip label={`+${assetGroups.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Manage Groups">
            <IconButton size="small" color="secondary" onClick={() => handleOpenAssetGroups(params.row)}>
              <GroupIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary"><EditIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error"><DeleteIcon /></IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  // ===== FILTERS =====
  const filteredAssets = assets.filter(asset => {
    const matchSearch = !searchText || 
      asset.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      asset.ip_address?.toLowerCase().includes(searchText.toLowerCase()) ||
      asset.hostname?.toLowerCase().includes(searchText.toLowerCase())
    const matchOs = !filters.os || asset.os === filters.os
    const matchType = !filters.type || asset.type === filters.type
    const matchCriticality = !filters.criticality || asset.criticality === filters.criticality
    const matchGroup = !filters.group || asset.groups?.includes(filters.group)
    return matchSearch && matchOs && matchType && matchCriticality && matchGroup
  })

  const getUniqueOs = () => [...new Set(assets.map(a => a.os).filter(Boolean))]
  const getUniqueTypes = () => [...new Set(assets.map(a => a.type).filter(Boolean))]

  // ===== SELECTED ASSETS INFO =====
  const selectedAssets = assets.filter(a => selectedIds.includes(a.id))
  const selectedCount = selectedIds.length
  const selectedGroupsList = [...new Set(selectedAssets.flatMap(a => a.groups || []))]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>📦 Asset Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mr: 1 }}>Add Asset</Button>
          <Button variant="outlined" startIcon={<UploadIcon />} sx={{ mr: 1 }}>Import</Button>
          <Button variant="outlined" startIcon={<GroupIcon />} onClick={() => setOpenGroupDialog(true)}>
            New Group
          </Button>
        </Box>
      </Box>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckBoxIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {selectedCount} asset{selectedCount > 1 ? 's' : ''} selected
              </Typography>
              {selectedGroupsList.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  | Groups: {selectedGroupsList.map(id => getGroupName(id)).join(', ')}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<GroupIcon />}
                onClick={() => setOpenBulkGroupDialog(true)}
              >
                Add to Group
              </Button>
              {selectedGroupsList.map(gid => (
                <Button
                  key={gid}
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => handleBulkRemoveFromGroup(gid)}
                >
                  Remove from {getGroupName(gid)}
                </Button>
              ))}
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenBulkDeleteDialog(true)}
              >
                Delete
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSelectedIds([])}
              >
                Clear Selection
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth size="small" placeholder="Search assets..." value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>OS</InputLabel>
              <Select value={filters.os} onChange={(e) => setFilters({...filters, os: e.target.value})} label="OS">
                <MenuItem value="">All</MenuItem>
                {getUniqueOs().map(os => <MenuItem key={os} value={os}>{os}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} label="Type">
                <MenuItem value="">All</MenuItem>
                {getUniqueTypes().map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Criticality</InputLabel>
              <Select value={filters.criticality} onChange={(e) => setFilters({...filters, criticality: e.target.value})} label="Criticality">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Group</InputLabel>
              <Select value={filters.group} onChange={(e) => setFilters({...filters, group: e.target.value})} label="Group">
                <MenuItem value="">All Groups</MenuItem>
                {groups.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="All Assets" icon={<ComputerIcon />} iconPosition="start" />
          <Tab label="Discovery" icon={<NetworkCheckIcon />} iconPosition="start" />
          <Tab label="Groups" icon={<GroupIcon />} iconPosition="start" />
          <Tab label="Hardening" icon={<ShieldIcon />} iconPosition="start" />
        </Tabs>

        {/* Tab 1: All Assets */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Found {filteredAssets.length} assets</Typography>
            <Button size="small" startIcon={<RefreshIcon />} onClick={() => setAssets([...sampleAssets])}>Refresh</Button>
          </Box>
          <Paper sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredAssets}
              columns={columns}
              getRowId={(row) => row.id}
              loading={loading}
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              checkboxSelection
              onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
              rowSelectionModel={selectedIds}
            />
          </Paper>
        </TabPanel>

        {/* Tab 2: Discovery */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>🔍 Network Scan</Typography>
                  <TextField fullWidth label="Network Range" defaultValue="192.168.1.0/24" sx={{ mb: 2 }} />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Scan Type</InputLabel>
                    <Select defaultValue="quick" label="Scan Type">
                      <MenuItem value="quick">Quick Scan</MenuItem>
                      <MenuItem value="full">Full Scan</MenuItem>
                    </Select>
                  </FormControl>
                  <Button fullWidth variant="contained" startIcon={<PlayIcon />}>Start Scan</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>📋 Import from Sources</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}><Button fullWidth variant="outlined" size="small" startIcon={<DomainIcon />}>LDAP</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" size="small" startIcon={<FileCopyIcon />}>CSV</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" size="small" startIcon={<SecurityIcon />}>Nessus</Button></Grid>
                    <Grid item xs={6}><Button fullWidth variant="outlined" size="small" startIcon={<CloudIcon />}>API</Button></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Groups */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {groups.map((group) => {
              const groupAssets = getAssetsByGroup(group.id)
              return (
                <Grid item xs={12} sm={6} md={4} key={group.id}>
                  <Card sx={{ 
                    borderLeft: `4px solid ${group.color}`,
                    '&:hover': { boxShadow: 6, transform: 'translateY(-4px)', transition: 'all 0.3s' }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>{group.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{group.description}</Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Delete Group">
                            <IconButton size="small" color="error" onClick={() => handleDeleteGroup(group.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{groupAssets.length}</Typography>
                        <Typography variant="body2" color="text.secondary">assets</Typography>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewGroupAssets(group)}
                        >
                          View Assets
                        </Button>
                        <Button size="small" variant="outlined" color="warning">
                          Hardening
                        </Button>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <AvatarGroup max={4}>
                          {groupAssets.slice(0, 4).map((asset) => (
                            <Avatar key={asset.id} sx={{ width: 28, height: 28, bgcolor: group.color }}>
                              {asset.name.charAt(0)}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                        {groupAssets.length > 4 && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            +{groupAssets.length - 4} more
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </TabPanel>

        {/* Tab 4: Hardening */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#1976d2', color: 'white' }}>
                <CardContent><Typography variant="h3">0</Typography><Typography>Assets Hardened</Typography></CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#ed6c02', color: 'white' }}>
                <CardContent><Typography variant="h3">0</Typography><Typography>Pending Hardening</Typography></CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
                <CardContent><Typography variant="h3">0</Typography><Typography>Compliant</Typography></CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>🛡️ Hardening Policies</Typography>
                <Typography color="text.secondary">Select a group to apply hardening policies.</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {groups.map(g => (
                    <Button key={g.id} variant="outlined" size="small" sx={{ borderColor: g.color, color: g.color }}>
                      {g.name}
                    </Button>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* ===== DIALOGS ===== */}

      {/* Create Group Dialog */}
      <Dialog open={openGroupDialog} onClose={() => setOpenGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📁 Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="e.g., Production Servers"
          />
          <TextField
            fullWidth
            label="Description"
            value={newGroupDesc}
            onChange={(e) => setNewGroupDesc(e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={2}
            placeholder="Optional description"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroupDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateGroup}>Create Group</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Asset Groups Dialog */}
      <Dialog open={openAssetGroupsDialog} onClose={() => setOpenAssetGroupsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon /> Manage Groups for <strong>{selectedAsset?.name}</strong>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select groups this asset belongs to (can be multiple)
          </Typography>
          <List>
            {groups.map((group) => {
              const isSelected = selectedGroupsForAsset.includes(group.id)
              return (
                <ListItem key={group.id} button onClick={() => handleToggleGroupForAsset(group.id)}>
                  <ListItemIcon>
                    <Checkbox checked={isSelected} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={group.name} 
                    secondary={`${getAssetsByGroup(group.id).length} assets`}
                  />
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: group.color }} />
                </ListItem>
              )
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssetGroupsDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveAssetGroups}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Group Detail Dialog */}
      <Dialog open={openGroupDetailDialog} onClose={() => setOpenGroupDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon sx={{ color: selectedGroup?.color }} />
            {selectedGroup?.name} - Assets ({getAssetsByGroup(selectedGroup?.id).length})
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {getAssetsByGroup(selectedGroup?.id).map((asset) => (
              <ListItem key={asset.id} divider>
                <ListItemIcon><ComputerIcon /></ListItemIcon>
                <ListItemText 
                  primary={asset.name}
                  secondary={`${asset.ip_address} | ${asset.os} | ${asset.type}`}
                />
                <Chip label={asset.criticality} size="small" color={
                  asset.criticality === 'high' ? 'error' : asset.criticality === 'medium' ? 'warning' : 'success'
                } />
              </ListItem>
            ))}
            {getAssetsByGroup(selectedGroup?.id).length === 0 && (
              <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No assets in this group yet
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroupDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Add to Group Dialog */}
      <Dialog open={openBulkGroupDialog} onClose={() => setOpenBulkGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon /> Add {selectedCount} Assets to Group
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a group to add all selected assets to:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Group</InputLabel>
            <Select
              value={bulkTargetGroup}
              onChange={(e) => setBulkTargetGroup(e.target.value)}
              label="Select Group"
            >
              <MenuItem value="">None</MenuItem>
              {groups.map(g => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Assets already in the group will be skipped.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkGroupDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBulkAddToGroup}
            disabled={!bulkTargetGroup || actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Add to Group'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={openBulkDeleteDialog} onClose={() => setOpenBulkDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon color="error" /> Delete {selectedCount} Assets?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedCount}</strong> selected assets?
            <br />
            <Typography variant="caption" color="error">
              ⚠️ This action cannot be undone!
            </Typography>
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedAssets.slice(0, 5).map(a => (
              <Chip key={a.id} label={a.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
            {selectedAssets.length > 5 && (
              <Chip label={`+${selectedAssets.length - 5} more`} size="small" variant="outlined" />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDeleteDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleBulkDelete}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  )
}

export default AssetManagement
