import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Group as GroupIcon,
  Layers as LayersIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'

const initialGroups = [
  { id: 'g-1', name: 'Production', assets: 24, risk: 'High', owner: 'Platform' },
  { id: 'g-2', name: 'Development', assets: 18, risk: 'Medium', owner: 'Engineering' },
  { id: 'g-3', name: 'DMZ', assets: 9, risk: 'High', owner: 'Security' },
  { id: 'g-4', name: 'Remote Users', assets: 12, risk: 'Low', owner: 'IAM' },
]

const AssetGroups = () => {
  const [groups, setGroups] = useState(initialGroups)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [open, setOpen] = useState(false)

  const totalAssets = useMemo(() => groups.reduce((sum, group) => sum + group.assets, 0), [groups])

  const handleCreate = () => {
    const value = name.trim()
    if (!value) return

    setGroups((current) => [
      ...current,
      {
        id: `g-${Date.now()}`,
        name: value,
        assets: 0,
        risk: 'Low',
        owner: owner.trim() || 'Unassigned',
      },
    ])

    setName('')
    setOwner('')
    setOpen(false)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>🧩 Asset Groups</Typography>
          <Typography variant="body2" color="text.secondary">
            Organize assets by business group, environment, and ownership.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Group
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Groups</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{groups.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Assets</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{totalAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">High Risk</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {groups.filter((group) => group.risk === 'High').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Protected</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>94%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack spacing={2}>
        {groups.map((group) => (
          <Paper key={group.id} sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: 'primary.main', color: '#fff' }}>
                  <GroupIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{group.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Owner: {group.owner}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`${group.assets} assets`} color="primary" variant="outlined" />
                <Chip
                  label={group.risk}
                  color={group.risk === 'High' ? 'error' : group.risk === 'Medium' ? 'warning' : 'success'}
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Asset Group</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Group Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
            <TextField
              label="Owner / Team"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AssetGroups
