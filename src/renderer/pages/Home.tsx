import styled from 'styled-components'
import OutlinedInput from '@mui/material/OutlinedInput'
import ButtonSource from '@mui/material/Button'
import { useContext, useState } from 'react'
import { ipcRenderer } from 'electron'
import extractFrames from 'ffmpeg-extract-frames'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import FacecamSelection from 'renderer/components/FacecamSelection'
import { store } from 'renderer/store'
import CircularProgress from '@mui/material/CircularProgress'
import { FormatVideoRequest } from 'dto/format'

const Container = styled.div`
  font-family: Nunito;
  padding: 30px;

  h2 {
    margin: 10px;
  }
`

const Button = styled(ButtonSource)`
  && {
    margin-left: 15px;
  }
`

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`

const InputLabel = styled.span`
  font-size: 18px;
`

const FormatVideo = styled.div`
  margin: 20px 50px;
`

type RectCoords = [number, number, number, number]

const formatVideo = (
  downloadFilePath: string,
  username: string,
  facecamCoords: RectCoords,
  videoLength: number,
  outputFilePath: string
) => {
  const formatArgs: FormatVideoRequest = {
    fileName: downloadFilePath,
    username,
    facecamCoords,
    videoLength,
    outputFilePath,
  }
  ipcRenderer.invoke('format-video', formatArgs)
}

const Home = () => {
  const [clipLink, setClipLink] = useState('')
  const [username, setUsername] = useState('')
  const [videoLength, setVideoLength] = useState(5)
  const [screenshotURL, setScreenshotURL] = useState('')
  const [facecamCoords, setFacecamCoords] = useState<RectCoords | undefined>()
  const [downloadFilePath, setDownloadFilePath] = useState('')
  const [clipName, setClipName] = useState('')
  const [step, setStep] = useState(1)
  const { isWriting } = useContext(store)

  console.log({ downloadFilePath, facecamCoords, username, isWriting })

  const validateClip = (clipLink: string) => {
    return !clipLink.includes('/clip')
  }

  const downloadClip = async (link: string) => {
    const clipLink = link.split('?')[0]
    try {
      const { outputFile, clipName: name } = await ipcRenderer.invoke(
        'download-video',
        {
          clipLink,
        }
      )
      console.log({ outputFile, name })
      // const outputFile =
      //   'C:\\Users\\Josh\\AutoClout\\clips\\DepressedNurturingSardineNotLikeThis-zTtPiMo7q6ZUdNnk.mp4'
      // const tokens = outputFile.split('\\')
      // const fileName = tokens[tokens.length - 1].split('.')[0]
      const imagePath = `images\\${name}.png`
      setDownloadFilePath(outputFile)
      setClipName(name)

      ffmpeg.ffprobe(outputFile, (error, metadata) => {
        console.log({ error, metadata })
        const duration = metadata.format.duration
        console.log({ duration })
        setVideoLength(Number(duration))
      })

      await extractFrames({
        input: outputFile,
        output: imagePath,
        offsets: [0],
        ffmpegPath:
          'build\\exe.win-amd64-3.9\\lib\\imageio_ffmpeg\\binaries\\ffmpeg-win64-v4.2.2.exe',
      })

      const base64 = fs
        .readFileSync(path.join(process.cwd(), imagePath))
        .toString('base64')

      setScreenshotURL(`data:image/jpg;base64,${base64}`)
      setStep(2)
    } catch (err) {
      console.error(err)
      if (!validateClip(clipLink)) {
        console.warn('the clip link might be in the wrong format')
      }
    }
  }

  const outputFilePath = path.join(process.cwd(), 'out', `${clipName}.mp4`)

  return (
    <Container>
      <FlexRow>
        <h2>Step 1 - Enter clip URL</h2>
        {step > 1 && '✅'}
      </FlexRow>
      {step === 1 && (
        <FlexRow>
          <OutlinedInput
            autoFocus
            placeholder="twitch.tv/UserName/clip/ShyCleverRadishDoubleRainbow"
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
      )}
      <FlexRow>
        <h2>Step 2 - Select your Face cam</h2>
        {step > 2 && '✅'}
      </FlexRow>
      {step === 2 && (
        <FacecamSelection
          imgSrc={screenshotURL}
          handleFacecamSelected={(rect) => {
            setFacecamCoords([
              rect.x,
              rect.y,
              rect.x + rect.width,
              rect.y + rect.height,
            ])
            setStep(3)
          }}
        />
      )}
      <FlexRow>
        <h2>Step 3 - Add social links</h2>
        {step > 3 && '✅'}
      </FlexRow>
      {step === 3 && (
        <>
          <InputLabel>Twitch: </InputLabel>
          <OutlinedInput
            autoFocus
            placeholder="iiTzTimmy"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </>
      )}

      {step === 3 && (
        <FormatVideo>
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              formatVideo(
                downloadFilePath,
                username,
                facecamCoords,
                videoLength,
                outputFilePath
              )
            }
            disabled={isWriting}
          >
            Format Video
          </Button>
        </FormatVideo>
      )}
      {isWriting && <CircularProgress />}
      <video width="360" height="640">
        <source src="testvideo.mp4#t=0.1" type="video/mp4" />
      </video>
    </Container>
  )
}

export default Home
