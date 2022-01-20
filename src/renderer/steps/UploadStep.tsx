import styled from 'styled-components'
import { store } from 'renderer/store'
import { useContext, useState } from 'react'
import { colors, Page, UserStep } from 'renderer/constants'
import InputSource from '@mui/material/Input'
import ButtonSource from '@mui/material/Button'
import { ipcRenderer } from 'electron'
import extractFrames from 'ffmpeg-extract-frames'
import ffmpeg from 'fluent-ffmpeg'
import Actions from 'renderer/actions'
import path from 'path'
import fs from 'fs'
import CircularProgress from '@mui/material/CircularProgress'

const Container = styled.div`
  background: ${colors.darkGray};
  margin: 30px 20px 0;
  border-radius: 16px;
  color: white;
  padding: 16px 24px;
`

const FlexRow = styled.div`
  display: flex;
  align-items: flex-end;
`

const CenteredRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`

const Input = styled(InputSource)`
  && {
    flex: 1;
    margin-top: 20px;
    color: white;

    ::placeholder {
      color: ${colors.lightGray};
    }

    ::before {
      border-bottom: 1px solid rgba(255, 136, 32, 0.42);
    }
    ::after {
      border-bottom: 1px solid rgba(255, 136, 32, 1);
    }
  }
`

const Button = styled(ButtonSource)`
  && {
    background: rgba(255, 136, 32, 1);
    font-size: 16px;
    margin-left: 10px;
    padding: 0 10px;
    height: 40px;
    border-radius: 9999px;

    .plus {
      margin-left: 10px;
      font-size: 20px;
      font-weight: bold !important;
    }
  }
`

const UploadStep = () => {
  const [clipLink, setClipLink] = useState('')
  const [clipName, setClipName] = useState('')
  const [videoLength, setVideoLength] = useState(5)
  const { dispatch } = useContext(store)
  const [isDownloading, setIsDownloading] = useState(false)

  const validateClip = (clipLink: string) => {
    return !clipLink.includes('/clip')
  }

  const downloadClip = async (link: string) => {
    const clipLink = link.split('?')[0]
    try {
      setIsDownloading(true)
      const { outputFile, clipName: name } = await ipcRenderer.invoke(
        'download-video',
        {
          clipLink,
        }
      )
      setIsDownloading(false)
      console.log({ outputFile, name })
      const imagePath = `images\\${name}.png`
      setClipName(name)
      dispatch(
        Actions.setOutputFilePath(
          path.join(process.cwd(), 'out', `${name}.mp4`)
        )
      )

      ffmpeg.ffprobe(outputFile, (error, metadata) => {
        console.log({ error, metadata })
        const duration = metadata.format.duration
        console.log({ duration })
        dispatch(Actions.setVideoLength(Number(duration)))
      })

      await extractFrames({
        input: outputFile,
        output: imagePath,
        offsets: [0],
        ffmpegPath:
          'build\\exe.win-amd64-3.9\\lib\\imageio_ffmpeg\\binaries\\ffmpeg-win64-v4.2.2.exe',
      })

      // const base64 = fs
      //   .readFileSync(path.join(process.cwd(), imagePath))
      //   .toString('base64')
      // dispatch(Actions.setScreenshotURL(`data:image/jpg;base64,${base64}`))

      dispatch(Actions.setScreenshotURL(path.join(process.cwd(), imagePath)))
      dispatch(Actions.setStep(UserStep.WEBCAM_SELECT))
      dispatch(Actions.setDownloadFilePath(outputFile))
    } catch (err) {
      console.error(err)
      if (!validateClip(clipLink)) {
        console.warn('the clip link might be in the wrong format')
      }
    }
  }

  return (
    <Container>
      <div>Video Link</div>
      <FlexRow>
        <Input
          placeholder="ex. https://www.twitch.tv/daltoosh/clip/WisePiliableDeerDogFace-3tvBxRXNnewkBgPN"
          value={clipLink}
          onChange={(e) => setClipLink(e.target.value)}
          inputProps={}
        />
        <Button variant="contained" onClick={() => downloadClip(clipLink)}>
          Create <span className="plus">+</span>
        </Button>
      </FlexRow>
      {isDownloading && (
        <CenteredRow>
          <CircularProgress />
          {'  '} Downloading
        </CenteredRow>
      )}
    </Container>
  )
}

export default UploadStep
