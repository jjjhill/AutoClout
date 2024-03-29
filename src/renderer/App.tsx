import { ipcRenderer } from 'electron'
import log from 'electron-log'
import { useContext, useEffect } from 'react'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import Actions from './Actions'
import Home from './pages/Home'
import { StateProvider, store } from './store'

ipcRenderer.on('main-error', (_, message) => log.error(message))
ipcRenderer.on('main-message', (_, message) =>
  log.info(JSON.stringify(JSON.parse(message), null, 2))
)

export default function App() {
  const { dispatch } = useContext(store)
  useEffect(() => {
    ipcRenderer.on('START_WRITE', () => dispatch(Actions.setIsWriting(true)))
    ipcRenderer.on('END_WRITE', () => dispatch(Actions.setIsWriting(false)))
  }, [])

  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  )
}
