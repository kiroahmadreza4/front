import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material'

const statusColorMap = {
  active: { bg: '#11271d', color: '#72d7a4' },
  warning: { bg: '#2b2013', color: '#f7c66b' },
  critical: { bg: '#2a1518', color: '#f28b82' },
  offline: { bg: '#1c2230', color: '#9aa3b5' },
}

const criticalityColorMap = {
  high: { bg: '#2a1518', color: '#f28b82' },
  medium: { bg: '#2b2013', color: '#f7c66b' },
  low: { bg: '#11271d', color: '#72d7a4' },
  unknown: { bg: '#1c2230', color: '#9aa3b5' },
}

const SectionTable = ({ title, columns, rows = [] }) => {
  return (
    <Paper
      sx={{
        bgcolor: '#131926',
        border: '1px solid #1d2432',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #1d2432' }}>
        <Typography sx={{ color: '#e7eaf0', fontWeight: 600 }}>{title}</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#121a28' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    color: '#5b6478',
                    borderBottom: '1px solid #1d2432',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    py: 1.25,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ color: '#9aa3b5', py: 3, textAlign: 'center' }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id || row.name || JSON.stringify(row)} hover sx={{ '&:last-child td': { border: 0 } }}>
                  {columns.map((column) => {
                    const value = row[column.key]
                    const cellValue = column.render ? column.render(value, row) : value

                    if (column.key === 'criticality') {
                      const mapped = criticalityColorMap[String(value)?.toLowerCase()] || criticalityColorMap.unknown
                      return (
                        <TableCell key={column.key} sx={{ borderBottom: '1px solid #1a2130', color: '#e7eaf0', py: 1.2 }}>
                          <Chip
                            label={value || 'Unknown'}
                            size="small"
                            sx={{
                              bgcolor: mapped.bg,
                              color: mapped.color,
                              fontWeight: 600,
                              borderRadius: 1,
                              height: 22,
                            }}
                          />
                        </TableCell>
                      )
                    }

                    if (column.key === 'status') {
                      const mapped = statusColorMap[String(value)?.toLowerCase()] || statusColorMap.offline
                      return (
                        <TableCell key={column.key} sx={{ borderBottom: '1px solid #1a2130', color: '#e7eaf0', py: 1.2 }}>
                          <Chip
                            label={value || 'Offline'}
                            size="small"
                            sx={{
                              bgcolor: mapped.bg,
                              color: mapped.color,
                              fontWeight: 600,
                              borderRadius: 1,
                              height: 22,
                            }}
                          />
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={column.key} sx={{ borderBottom: '1px solid #1a2130', color: '#e7eaf0', py: 1.2 }}>
                        {cellValue}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default SectionTable
