import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Menu, type MenuItem } from 'better-mui-menu'
import { useState } from 'react'
import {
  AccessibilityNewRounded,
  ArrowForward,
  CloudOutlined,
  ContentCopy,
  ContentPaste,
  DeleteOutlined,
  Google,
  Storage,
} from '@mui/icons-material'
import { blueGrey } from '@mui/material/colors'

const theme = createTheme()

const menuItems: MenuItem[] = [
  {
    label: 'Copy',
    startIcon: ContentCopy,
  },
  {
    label: 'Paste',
    startIcon: ContentPaste,
  },
  {
    label: 'Delete',
    sx: { color: 'error.main' },
    startIcon: DeleteOutlined,
  },
  {
    label: 'Web Clipboard',
    startIcon: CloudOutlined,
    items: [
      {
        label: 'Google Cloud',
        startIcon: Google,
      },
      {
        label: 'Web Clipboard',
        startIcon: CloudOutlined,
        items: [
          {
            label: 'Google Cloud',
            startIcon: Google,
          },
          {
            label: 'Azure Clipboard',
            startIcon: CloudOutlined,
          },
          {
            label: 'Local Storage',
            startIcon: Storage,
          },
        ],
      },
      {
        label: 'Azure Clipboard',
        startIcon: CloudOutlined,
      },
      {
        label: 'Local Storage',
        startIcon: Storage,
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    label: 'Accessibility',
    startIcon: AccessibilityNewRounded,
    endIcon: ArrowForward,
    sx: { fontFamily: 'cursive' },
    items: [
      {
        label: 'Google Cloud',
        startIcon: Google,
      },
      {
        label: 'Azure Clipboard',
        startIcon: CloudOutlined,
      },
      {
        label: 'Local Storage',
        startIcon: Storage,
      },
    ],
  },
];

const simpleUsageSnippet = String.raw`const items = [
  { label: 'Cut', onClick: () => console.log('Cut') },
  { label: 'Delete', onClick: () => console.log('Delete') },
  { type: 'divider' },
  { label: 'Other', items: [{...}] }, <-- Nested Menu
]

<Menu
  items={items}
  anchorRef={anchorRef}
  open={Boolean(anchorRef)}
  onClose={() => {}}
/>`

function App() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack p={4} maxWidth={640} gap={2}>
        <Box>
          <Typography variant='h5' gutterBottom>
            Better MUI Material UI Menu
          </Typography>

          <Typography variant='subtitle1' gutterBottom>
            A plain material UI menu with added features.
          </Typography>

          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='caption' sx={{ p: 1, backgroundColor: blueGrey[100], color: blueGrey[800], borderRadius: 1 }}>
              npm i better-mui-menu
            </Typography>
            {/* Add a copy text button with a copy icon in MUI icon button */}
            <IconButton size='small' aria-label="copy" onClick={() => { navigator.clipboard.writeText('npm install better-mui-menu') }}>
              <ContentCopy />
            </IconButton>
          </Stack>
        </Box>
        <Box>
          <Typography variant='h6' gutterBottom>Who should use?</Typography>
          <Typography variant='body2' gutterBottom>
            You realized your MUI menu doesn't support keyboard navigation, hence the bad accessibility score. <br /><br />You need to improve quickly without changing your design system. And you realized it is pretty hard, and even AI isn't very helpful.
          </Typography>
        </Box>
        <Box>
          <Typography variant='h6' gutterBottom>Try it out</Typography>
          <Stack sx={{ borderRadius: 1, p: 2, backgroundColor: blueGrey[100] }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button
                id='icon-menu-button'
                aria-controls={anchorEl ? 'icon-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={anchorEl ? 'true' : undefined}
                onClick={handleClick}
                variant='contained'
                startIcon={<AccessibilityNewRounded />}
                color='inherit'
              >
                Menu
              </Button>

              <Menu items={menuItems} anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)} />
            </Box>
          </Stack>
        </Box>
        <Box>
          <Typography variant='h6' gutterBottom>Usage</Typography>
          <Box
            component='pre'
            sx={{
              fontFamily: 'Monospace',
              backgroundColor: blueGrey[100],
              color: blueGrey[800],
              borderRadius: 1,
              p: 1,
              mt: 1,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              overflow: 'auto',
            }}
          >
            {simpleUsageSnippet}
          </Box>
        </Box>
        <Box>
          <Typography variant='h6' gutterBottom>Why?</Typography>
          <Typography variant='body2' gutterBottom>
            I realized that it is a big pain creating a menu with nested menus, and making it keyboard accessible for an accessible product.
          </Typography>
          <Typography variant='body2' gutterBottom>
            I wasn't liking the -very few- existing solutions out there. They were either not handling things properly or too much opinionated interface that I needed to learn about.
          </Typography>
          <Typography variant='body2' gutterBottom>
            So, I decided to share this menu component which has no extra styling, nor so much new interface to learn about. Just drop it in your MUI project, it will pick up your theme,
            and use it with ease knowing that it is accessible and works well.
          </Typography>
        </Box>


      </Stack>
    </ThemeProvider>
  )
}

export default App
