import styled from 'styled-components'
import OutlinedInput from '@mui/material/OutlinedInput'
import ButtonSource from '@mui/material/Button'
import { useState } from 'react'
import { ipcRenderer } from 'electron'

const Container = styled.div`
  font-family: Nunito;
  padding: 30px;
`

const Button = styled(ButtonSource)`
  && {
    margin-left: 15px;
  }
`

const FlexRow = styled.div`
  display: flex;
`

const downloadClip = async (clipLink: string) => {
  const outputFile = await ipcRenderer.invoke('download-video', { clipLink })
  console.log({ outputFile })
}

const Home = () => {
  // const formatVideo = () => {
  //   ipcRenderer.invoke('format-video')
  // }
  const [clipLink, setClipLink] = useState('')

  return (
    <Container>
      <h2>Step 1 - Enter clip URL</h2>
      <FlexRow>
        <OutlinedInput
          autoFocus
          placeholder="twitch.tv/some_twitch_user/clip/ShyCleverRadishDoubleRainbow"
          value={clipLink}
          onChange={(e) => setClipLink(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => downloadClip(clipLink)}
        >
          Download
        </Button>
      </FlexRow>
    </Container>
  )
}

export default Home
