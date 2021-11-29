import { ipcRenderer } from 'electron'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'

const Hello = () => {
  const formatVideo = () => {
    ipcRenderer.invoke('format-video')
  }

  return (
    <div>
      <button type="button" onClick={() => formatVideo()}>
        test
      </button>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  )
}
