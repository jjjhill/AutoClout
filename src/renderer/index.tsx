import { render } from 'react-dom'
import App from './App'
import './App.css'
import { StateProvider } from './store'

render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.getElementById('root')
)
