import { Box, Button, CssBaseline, Stack, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Menu, { type MenuItem } from 'better-mui-menu'
import { useState } from 'react'
import { Cloud, CloudQueue, ContentCopy, ContentCut, ContentPaste, Google, Settings, Storage } from '@mui/icons-material'

const theme = createTheme()

const menuItems: MenuItem[] = [
  {
    label: 'Cut',
    startIcon: ContentCut,
  },
  {
    label: 'Web Clipboard',
    startIcon: Cloud,
    items: [
      {
        label: 'Google Cloud',
        startIcon: Google,
      },
      {
        label: 'Azure Clipboard',
        startIcon: CloudQueue,
      },
      {
        label: 'Local Storage',
        startIcon: Storage,
      },
    ],
  },
  {
    label: 'Copy',
    startIcon: ContentCopy,
  },
  {
    label: 'Paste',
    startIcon: ContentPaste,
  },
  {
    type: 'divider',
  },
  {
    label: 'Web Clipboard',
    startIcon: Cloud,
    items: [
      {
        label: 'Google Cloud',
        startIcon: Google,
      },
      {
        label: 'Web Clipboard',
        startIcon: Cloud,
        items: [
          {
            label: 'Google Cloud',
            startIcon: Google,
          },
          {
            label: 'Azure Clipboard',
            startIcon: CloudQueue,
          },
          {
            label: 'Local Storage',
            startIcon: Storage,
          },
        ],
      },
      {
        label: 'Azure Clipboard',
        startIcon: CloudQueue,
      },
      {
        label: 'Local Storage',
        startIcon: Storage,
      },
    ],
  },
];

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
      <Stack p={4} maxWidth={560} gap={2}>
        <Box>
          <Typography variant='h5' gutterBottom>
            Better MUI Material UI Menu
          </Typography>

          <Typography variant='subtitle1' gutterBottom>
            A plain material UI menu with added features.
          </Typography>

          <Typography variant='caption' gutterBottom sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            npm install better-mui-menu
          </Typography>
        </Box>
        <Box>
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
          <Typography component="span" variant='body2' gutterBottom>
            <ul>
              <li><b>Nested menu items</b> - You can add sub menus to any menu item.</li>
              <li><b>Keyboard navigation</b> - Use arrow keys to navigate between menu items and sub menus.</li>
              <li><b>Accessibile</b> - Fully accessible with proper ARIA attributes. Ready for screen readers.</li>
              <li><b>Customizable</b> - Customize the menu items using MUI's standard menu item props or style through MUI styling system as you would for other MUI components.</li>
              <li><b>TypeScript support</b> - Built with TypeScript and provides type definitions for menu items.</li>
              <li><b>Lightweight</b> - Minimal dependencies and optimized for performance.</li>
              <li><b>Tested</b> - Thoroughly tested for reliability and stability.</li>
            </ul>
          </Typography>
        </Box>
        <Box>
          <Button
            id='icon-menu-button'
            aria-controls={anchorEl ? 'icon-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={anchorEl ? 'true' : undefined}
            onClick={handleClick}
            variant='outlined'
            startIcon={<Settings />}
          >
            Menu
          </Button>

          <Menu items={menuItems} anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)} />
        </Box>

      </Stack>
    </ThemeProvider>
  )
}

export default App
