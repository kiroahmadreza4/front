import { useState } from 'react'
import { Container, Typography, Paper, Grid, Card, CardContent, Box, Chip, Button, Alert } from '@mui/material'
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Pending as PendingIcon } from '@mui/icons-material'

const ChecklistList = () => {
  const [checklists] = useState([
    {
      id: 'chk-1',
      name: 'ESXI STIG Checklist',
      description: 'Compliance check against ESXI 6.0 STIG',
      category: 'Security',
      items: [
        { id: '1', description: 'SSH daemon must be configured with DoD login banner', status: 'pending' },
        { id: '2', description: 'VMM must use DoD-approved encryption', status: 'pending' },
      ],
    },
    {
      id: 'chk-2',
      name: 'CIS Benchmark Checklist',
      description: 'Compliance check against CIS Benchmark',
      category: 'Compliance',
      items: [
        { id: '3', description: 'Ensure default password policies', status: 'pending' },
        { id: '4', description: 'Enable auditing for security events', status: 'pending' },
      ],
    },
  ])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          📋 Checklist Management
        </Typography>
        <Button variant="contained">Upload File</Button>
      </Box>

      <Grid container spacing={3}>
        {checklists.map((checklist) => (
          <Grid item xs={12} md={6} key={checklist.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{checklist.name}</Typography>
                <Typography variant="body2" color="text.secondary">{checklist.description}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Chip label={checklist.category} size="small" color="primary" />
                  <Chip label={`${checklist.items.length} items`} size="small" variant="outlined" />
                </Box>
                <Box sx={{ mt: 2 }}>
                  {checklist.items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      {item.status === 'pending' && <PendingIcon color="warning" fontSize="small" />}
                      <Typography variant="body2">{item.description}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ChecklistList
