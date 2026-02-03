import { Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import MultiLevelMenu, { type MultiLevelMenuItem } from 'better-mui-menu'
import { useState } from 'react'
import {Cloud, CloudQueue, ContentCopy, ContentCut, ContentPaste, Google, Settings, Storage} from '@mui/icons-material'

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
