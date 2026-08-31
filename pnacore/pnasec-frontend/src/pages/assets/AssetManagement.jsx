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
  TextField,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Computer as ComputerIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material'

const initialAssets = [
  { id: '1', name: 'web-prod-01', type: 'Server', os: 'Ubuntu 22.04', status: 'Active', owner: 'Platform', ip: '192.168.1.10', criticality: 'High' },
  { id: '2', name: 'db-prod-01', type: 'Database', os: 'PostgreSQL 15', status: 'Active', owner: 'Data', ip: '192.168.1.20', criticality: 'High' },
  { id: '3', name: 'app-staging-01', type: 'Application', os: 'Ubuntu 22.04', status: 'Staging', owner: 'Engineering', ip: '192.168.10.15', criticality: 'Medium' },
  { id: '4', name: 'vpn-edge-01', type: 'Network', os: 'OpenWrt', status: 'Active', owner: 'Security', ip: '10.0.0.10', criticality: 'High' },
]

const AssetManagement = () => {
  const [assets] = useState(initialAssets)
  const [query, setQuery] = useState('')

  const filteredAssets = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return assets

    return assets.filter((asset) => {
      return [asset.name, asset.type, asset.os, asset.owner, asset.ip].some((value) =>
        String(value).toLowerCase().includes(search)
      )
    })
  }, [assets, query])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>📦 Asset Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Inventory overview for the active assets in scope.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>Add Asset</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total Assets</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{assets.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Active</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {assets.filter((asset) => asset.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">High Risk</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {assets.filter((asset) => asset.criticality === 'High').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Protected</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>96%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search assets, OS, owner, or IP"
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page is intentionally simplified while the asset API is being finalized. The current version shows the live inventory data in a stable, working layout.
      </Alert>

      <Stack spacing={2}>
        {filteredAssets.map((asset) => (
          <Paper key={asset.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <ComputerIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{asset.name}</Typography>
                <Typography variant="body2" color="text.secondary">{asset.ip} • {asset.type}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip label={asset.status} color={asset.status === 'Active' ? 'success' : 'default'} size="small" />
              <Chip label={asset.criticality} color={asset.criticality === 'High' ? 'error' : 'warning'} size="small" />
              <Chip label={asset.os} variant="outlined" size="small" />
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">Owner</Typography>
              <Typography variant="subtitle2">{asset.owner}</Typography>
            </Box>
          </Paper>
        ))}

        {filteredAssets.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <ShieldIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6">No matching assets found</Typography>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default AssetManagement
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
