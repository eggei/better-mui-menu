import { Button, Typography } from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import MultiLevelMenu, { type MultiLevelMenuItem } from 'better-mui-menu'
import { useState } from 'react'
import {Cloud, CloudQueue, ContentCopy, ContentCut, ContentPaste, Google, Settings} from '@mui/icons-material'

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})

const menuItems: MultiLevelMenuItem[] = [
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
      <Typography variant='h4'>Better MUI Menu Demo</Typography>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
            <Button
        id='icon-menu-button'
        aria-controls={anchorEl ? 'icon-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClick}
        variant='outlined'
        startIcon={<Settings />}
      >
        Menu Actions
      </Button>

      <MultiLevelMenu items={menuItems} anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)} />
    </ThemeProvider>
  )
}

export default App
