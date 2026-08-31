import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'

export const navigationGroups = [
  {
    title: 'Overview',
    items: [{ path: '/dashboard', label: 'Dashboard', icon: DashboardRoundedIcon }],
  },
  {
    title: 'Inventory',
    items: [
      { path: '/assets', label: 'Assets Management', icon: StorageRoundedIcon },
      { path: '/assets/new', label: 'Add Asset', icon: StorageRoundedIcon },
      { path: '/assets/groups', label: 'Asset Groups', icon: StorageRoundedIcon },
      { path: '/discovery', label: 'Discovery', icon: SearchRoundedIcon },
    ],
  },
  {
    title: 'Access',
    items: [{ path: '/credentials', label: 'Credentials', icon: VpnKeyRoundedIcon }],
  },
  {
    title: 'Compliance',
    items: [
      { path: '/checklist', label: 'Compliance Management', icon: FactCheckRoundedIcon },
      { path: '/analytics', label: 'Analystic', icon: AnalyticsRoundedIcon },
    ],
  },
  {
    title: 'System',
    items: [
      { path: '/settings', label: 'Settings', icon: SettingsRoundedIcon },
      { path: '/about', label: 'About US', icon: InfoRoundedIcon },
    ],
  },
]

export const flatNavigation = navigationGroups.flatMap((group) => group.items)

export const getNavItemByPath = (path) =>
  flatNavigation.find((item) => item.path === path) || flatNavigation[0]
