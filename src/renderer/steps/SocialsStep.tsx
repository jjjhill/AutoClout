import styled, { css } from 'styled-components'
import { store } from 'renderer/store'
import { useContext, useEffect, useRef, useState } from 'react'
import { colors } from 'renderer/constants'
import usePrevious from 'renderer/hooks/usePrevious'
import { Rectangle } from 'renderer/components/FacecamSelection'
import Preview from 'renderer/components/Preview'
import iphoneSrc from '../../../assets/iphone.png'
import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button'
import { exec } from 'child_process'
import path from 'path'

const Container = styled.div`
  background: ${colors.darkGray};
  margin: 30px 20px 0;
  border-radius: 16px;
  color: white;
  padding: 24px 48px;
  flex: 1;
  display: flex;
`

interface ContainerProps {
  previewWidth: number
  previewHeight: number
}

const PreviewSection = styled.div`
  width: ${({ previewWidth }: ContainerProps) => previewWidth};

  h2 {
    margin-bottom: 30px;
  }
`

const PreviewContainer = styled.div`
  position: relative;

  .phone-border {
    pointer-events: none;

    ${({ previewHeight, previewWidth }: ContainerProps) =>
      previewHeight &&
      previewWidth &&
      css`
        height: ${previewHeight}px;
        position: absolute;
        top: 0;
        left: 0;
        width: calc(${previewWidth}px + 37px);
        height: calc(${previewHeight}px + 100px);
        transform: translate(-20px, -16px);
        z-index: 2;
      `}
  }
`

const UploadSection = styled.div`
  flex: 1;
  /* display: flex;
  flex-direction: column; */
  padding-left: 60px;

  button {
    min-width: 0;
  }
`

const Input = styled(OutlinedInput)`
  &&&&& {
    color: white;
    border-radius: 12px;
    border: 1px solid ${colors.lightGray};

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.orange}!important;
      border-width: 1px;
    }

    padding: 0;
    textarea {
      padding: 10px 14px;
    }
    input {
      padding: 10px 14px;
    }
  }
`

const InputLabel = styled.div`
  font-size: 14px;
  color: white;
  margin: 12px 0 6px 0;
`

interface Props {
  facecamCoords: Rectangle
  previewWidth: number
  previewHeight: number
  realCamHeight: number
  zoomRatio: number
  camEnabled: boolean
  cropURL: string
}

const SocialsStep = ({
  facecamCoords,
  previewWidth,
  previewHeight,
  realCamHeight,
  zoomRatio,
  camEnabled,
  cropURL,
}: Props) => {
  const {
    dispatch,
    state: { isWriting, outputFilePath },
  } = useContext(store)
  const [writeComplete, setWriteComplete] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const videoRef = useRef<HTMLVideoElement>()

  const handleExportClicked = () => {
    const outputDir = path.parse(outputFilePath).dir
    exec(`start "" "${outputDir}"`)
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.35
    }
  }, [videoRef.current])

  const prevIsWriting = usePrevious(isWriting)
  useEffect(() => {
    if (prevIsWriting && !isWriting) {
      setWriteComplete(true)
    }
  }, [isWriting])

  return (
    <Container>
      <PreviewSection previewWidth={previewWidth}>
        <h2>Preview</h2>
        <PreviewContainer
          previewWidth={previewWidth}
          previewHeight={previewHeight}
        >
          {isWriting && !writeComplete && (
            <Preview
              webcamCoords={facecamCoords}
              previewHeight={previewHeight}
              previewWidth={previewWidth}
              realCamHeight={realCamHeight}
              zoomRatio={zoomRatio}
              camEnabled={camEnabled}
              cropURL={cropURL}
              isLoading
            />
          )}
          {writeComplete && (
            <>
              <img src={iphoneSrc} className="phone-border" />
              <video width={previewWidth} autoPlay loop ref={videoRef} controls>
                <source src={`file://${outputFilePath}`} type="video/mp4" />
              </video>
            </>
          )}
        </PreviewContainer>
      </PreviewSection>
      <UploadSection>
        <h2>Export</h2>
        <Button
          color="primary"
          variant="contained"
          onClick={handleExportClicked}
        >
          view file
        </Button>
        {/* <InputLabel>Title</InputLabel>
        <Input
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputLabel>Description</InputLabel>
        <Input
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={6}
        />
        <InputLabel>Tags</InputLabel>
        <Input
          size="small"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        /> */}
      </UploadSection>
    </Container>
  )
}

export default SocialsStep
