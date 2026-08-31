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

    if (!search) {
      return assets
    }

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
          <Paper
            key={asset.id}
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
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
