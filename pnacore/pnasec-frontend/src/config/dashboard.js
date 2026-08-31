import {
  StorageRounded as StorageIcon,
  WarningRounded as WarningIcon,
  VpnKeyRounded as KeyIcon,
  VerifiedRounded as VerifiedIcon,
} from '@mui/icons-material'

export const dashboardMetrics = [
  {
    title: 'Total assets',
    value: 128,
    suffix: '',
    icon: StorageIcon,
    color: '#7c8cf0',
    tone: 'default',
  },
  {
    title: 'Critical findings',
    value: 7,
    suffix: '',
    icon: WarningIcon,
    color: '#f28b82',
    tone: 'danger',
  },
  {
    title: 'Credentials stored',
    value: 64,
    suffix: '',
    icon: KeyIcon,
    color: '#7ed6b0',
    tone: 'success',
  },
  {
    title: 'Compliance score',
    value: 82,
    suffix: '%',
    icon: VerifiedIcon,
    color: '#f7c66b',
    tone: 'warning',
  },
]

export const recentAssets = [
  { id: 'web-01.local', name: 'web-01.local', ip_address: '192.168.1.10', criticality: 'High', status: 'Active' },
  { id: 'db-01.local', name: 'db-01.local', ip_address: '192.168.1.20', criticality: 'Medium', status: 'Active' },
  { id: 'mail-01.local', name: 'mail-01.local', ip_address: '192.168.1.30', criticality: 'Low', status: 'Active' },
  { id: 'proxy-01.local', name: 'proxy-01.local', ip_address: '192.168.1.40', criticality: 'High', status: 'Warning' },
]

export const securitySummary = [
  { label: 'Open patches', value: '14' },
  { label: 'Expiring certs', value: '3' },
  { label: 'Privilege drift', value: '8' },
]
