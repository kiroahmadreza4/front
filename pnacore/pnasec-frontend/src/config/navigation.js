import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'

export const navigationGroups = [
  {
    title: 'Overview',
    items: [{ path: '/dashboard', label: 'Dashboard', icon: DashboardRoundedIcon }],
  },
  {
    title: 'Inventory',
    items: [
      { path: '/assets', label: 'Assets', icon: StorageRoundedIcon },
      { path: '/discovery', label: 'Discovery', icon: SearchRoundedIcon },
    ],
  },
  {
    title: 'Access',
    items: [{ path: '/credentials', label: 'Credentials', icon: VpnKeyRoundedIcon }],
  },
  {
    title: 'Compliance',
    items: [{ path: '/checklist', label: 'Checklists', icon: FactCheckRoundedIcon }],
  },
]

export const flatNavigation = navigationGroups.flatMap((group) => group.items)

export const getNavItemByPath = (path) =>
  flatNavigation.find((item) => item.path === path) || flatNavigation[0]
