import styled from 'styled-components'
import { store } from 'renderer/store'
import { useContext, useState } from 'react'
import { colors, Page, UserStep } from 'renderer/constants'
import InputSource from '@mui/material/Input'
import ButtonSource from '@mui/material/Button'
import { ipcRenderer } from 'electron'
import Actions from 'renderer/Actions'
import path from 'path'
import CircularProgress from '@mui/material/CircularProgress'
import log from 'electron-log'
import { PYTHON_BUILD_PATH, BIN_PATH } from 'main/constants'
import extractFrames from 'ffmpeg-extract-frames'
import ffmpeg from 'fluent-ffmpeg'
// import ffprobe from 'ffprobe-static'
const ffprobePath = `${BIN_PATH}\\ffprobe.exe`
log.info({ ffprobePath })
console.log({ ffprobePath })
ffmpeg.setFfprobePath(ffprobePath)

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

const ImportStep = () => {
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
      log.info({ outputFile, name })
      const imagePath = outputFile
        .replace('clips', 'images')
        .replace('mp4', 'png')
      // `images\\${name}.png`
      setClipName(name)
      dispatch(
        Actions.setOutputFilePath(
          outputFile.replace('clips', 'out')
          // path.join(app.getPath('userData'), 'out', `${name}.mp4`)
        )
      )

      ffmpeg.ffprobe(outputFile, (error, metadata) => {
        log.info({ error, metadata, outputFile })
        const duration = metadata.format.duration
        log.info({ error, metadata, duration })
        dispatch(Actions.setVideoLength(Number(duration)))
        const { width, height } = metadata.streams?.[0]
        dispatch(Actions.setImageDimensions({ width, height }))
      })

      await extractFrames({
        input: outputFile,
        output: imagePath,
        offsets: [0],
        ffmpegPath: `${PYTHON_BUILD_PATH}\\exe.win-amd64-3.9\\lib\\imageio_ffmpeg\\binaries\\ffmpeg-win64-v4.2.2.exe`,
      })

      // const base64 = fs
      //   .readFileSync(path.join(process.cwd(), imagePath))
      //   .toString('base64')
      // dispatch(Actions.setScreenshotURL(`data:image/jpg;base64,${base64}`))

      dispatch(Actions.setScreenshotURL(imagePath))
      dispatch(Actions.setStep(UserStep.WEBCAM_SELECT))
      dispatch(Actions.setDownloadFilePath(outputFile))
    } catch (err) {
      console.error(err)
      log.error(err)
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
        <Button
          color="primary"
          variant="contained"
          onClick={() => downloadClip(clipLink)}
        >
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

export default ImportStep
