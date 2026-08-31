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
import { Add as AddIcon, LocalOffer as TagIcon } from '@mui/icons-material'

const initialTags = [
  { id: 't-1', name: 'Production', color: 'primary' },
  { id: 't-2', name: 'Development', color: 'secondary' },
  { id: 't-3', name: 'PCI', color: 'error' },
  { id: 't-4', name: 'Legacy', color: 'warning' },
  { id: 't-5', name: 'Customer-Facing', color: 'success' },
]

const AssetTags = () => {
  const [tags, setTags] = useState(initialTags)
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

  const totals = useMemo(() => ({
    total: tags.length,
    active: tags.filter((tag) => tag.name).length,
  }), [tags])

  const handleCreate = () => {
    if (!name.trim()) return

    setTags((current) => [...current, { id: `t-${Date.now()}`, name: name.trim(), color: 'primary' }])
    setName('')
    setOpen(false)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>🏷️ Asset Tags</Typography>
          <Typography variant="body2" color="text.secondary">
            Group assets with labels such as Environment, Role, Location, and sensitivity.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Tag
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Tags</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{totals.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Active</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{totals.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {tags.map((tag) => (
            <Chip key={tag.id} label={tag.name} color={tag.color} icon={<TagIcon />} variant="outlined" />
          ))}
        </Stack>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Tag</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="Tag Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AssetTags
