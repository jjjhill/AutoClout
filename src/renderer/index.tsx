import { render } from 'react-dom'
import App from './App'
import './App.css'
import { StateProvider } from './store'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { colors } from './constants'

const theme = createTheme({
  palette: {
    primary: {
      main: colors.orange,
      contrastText: '#FFF',
      dark: '#D47019',
    },
  },
})

render(
  <ThemeProvider theme={theme}>
    <StateProvider>
      <App />
    </StateProvider>
  </ThemeProvider>,
  document.getElementById('root')
)
