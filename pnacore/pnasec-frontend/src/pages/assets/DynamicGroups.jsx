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
import { Add as AddIcon, AutoAwesome as RuleIcon } from '@mui/icons-material'

const initialGroups = [
  { id: 'dg-1', name: 'Critical Windows Servers', rule: 'OS = Windows Server AND Criticality = Critical AND Environment = Production', assets: 37 },
  { id: 'dg-2', name: 'Internet Facing Assets', rule: 'Exposure = Internet AND Open Ports contains 443', assets: 19 },
  { id: 'dg-3', name: 'PCI Assets', rule: 'Tag = PCI AND Environment = Production', assets: 14 },
]

const DynamicGroups = () => {
  const [groups, setGroups] = useState(initialGroups)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [rule, setRule] = useState('')

  const totalAssets = useMemo(() => groups.reduce((sum, group) => sum + group.assets, 0), [groups])

  const handleCreate = () => {
    if (!name.trim()) return

    setGroups((current) => [
      ...current,
      {
        id: `dg-${Date.now()}`,
        name: name.trim(),
        rule: rule.trim() || 'OS = Windows AND Environment = Production',
        assets: 0,
      },
    ])

    setName('')
    setRule('')
    setOpen(false)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>🧠 Dynamic Asset Groups</Typography>
          <Typography variant="body2" color="text.secondary">
            Rules automatically add assets to groups based on conditions.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Rule
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Dynamic Groups</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{groups.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Assets in Rules</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{totalAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Auto Updates</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>Live</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack spacing={2}>
        {groups.map((group) => (
          <Paper key={group.id} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: 'primary.main', color: '#fff' }}>
                  <RuleIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{group.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{group.rule}</Typography>
                </Box>
              </Box>

              <Chip label={`${group.assets} assets`} color="primary" variant="outlined" />
            </Box>
          </Paper>
        ))}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Dynamic Group</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField label="Group Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
            <TextField
              label="Rule"
              value={rule}
              onChange={(event) => setRule(event.target.value)}
              fullWidth
              multiline
              minRows={3}
              placeholder="OS = Windows Server AND Criticality = Critical AND Environment = Production"
            />
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select value="AND" label="Operator">
                <MenuItem value="AND">AND</MenuItem>
                <MenuItem value="OR">OR</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create Rule</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default DynamicGroups
