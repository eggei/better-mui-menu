import { Typography } from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CustomMenu } from 'better-mui-menu'

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})

function App() {
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
      <CustomMenu open />
    </ThemeProvider>
  )
}

export default App
