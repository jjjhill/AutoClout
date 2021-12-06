import { ipcRenderer } from 'electron'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'

ipcRenderer.on('main-error', (_, message) => console.log(message))
ipcRenderer.on('main-message', (_, message) =>
  console.log(JSON.stringify(JSON.parse(message), null, 2))
)

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  )
}
