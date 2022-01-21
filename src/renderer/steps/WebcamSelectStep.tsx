import styled, { css } from 'styled-components'
import { useContext, useRef, useState } from 'react'
import { colors } from 'renderer/constants'
import FacecamSelection, {
  Rectangle,
} from 'renderer/components/FacecamSelection'
import { store } from 'renderer/store'
import Preview from 'renderer/components/Preview'
import Button from '@mui/material/Button'
import { ipcRenderer } from 'electron'
import { FormatVideoRequest } from 'dto/format'

const Container = styled.div`
  background: ${colors.darkGray};
  margin: 30px 20px 0;
  border-radius: 16px;
  color: white;
  padding: 16px 40px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  min-width: 1000px;
`

interface ContainerProps {
  previewWidth: number
}

const GridContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-gap: 60px;
  grid-template-areas:
    'select select preview'
    'select select preview'
    'options options preview';

  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr 1fr ${({ previewWidth }: ContainerProps) =>
      `${previewWidth}px`};

  #webcam-selection {
    grid-area: select;
  }

  #preview {
    grid-area: preview;
    display: flex;
    flex-direction: column;
  }
`

const Options = styled.div`
  display: flex;
  grid-area: options;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 35px;
`

const Positioning = styled.div``

type RectCoords = [number, number, number, number]

const formatVideo = (args: FormatVideoRequest) => {
  ipcRenderer.invoke('format-video', args)
}

const toRectCoords: (rect: Rectangle) => RectCoords = (rect) => {
  return [rect.left, rect.top, rect.left + rect.width, rect.top + rect.height]
}

const WebcamSelectStep = () => {
  const realCamHeight = 500
  const previewWidth = 300
  const previewHeight = (1920 / 1080) * previewWidth
  const [zoomRatio, setZoomRatio] = useState(0)

  const [facecamCoords, setFacecamCoords] = useState<Rectangle>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })
  const {
    state: { downloadFilePath, videoLength, outputFilePath, screenshotURL },
  } = useContext(store)

  const handleNextClicked = () => {
    const { width, height } = facecamCoords
    const camAspect = width / height
    const args = {
      fileName: downloadFilePath,
      username: '',
      facecamCoords: toRectCoords(facecamCoords),
      videoLength,
      outputFilePath,
      realCamHeight:
        camAspect > 1080 / realCamHeight ? 1080 / camAspect : realCamHeight,
      zoomRatio,
    }

    console.log(args)
    formatVideo(args)
  }

  return (
    <Container>
      <GridContainer previewWidth={previewWidth + 10}>
        <div id="webcam-selection">
          <h2>Select Webcam</h2>
          <FacecamSelection
            imgSrc={screenshotURL}
            handleFacecamSelected={setFacecamCoords}
          />
        </div>
        <Options>
          {/* <BorderSelect /> */}
          <Positioning />
        </Options>
        <div id="preview">
          <h2 style={{ marginBottom: '40px' }}>Preview</h2>
          <Preview
            webcamCoords={facecamCoords}
            previewHeight={previewHeight}
            previewWidth={previewWidth}
            realCamHeight={realCamHeight}
            zoomRatio={zoomRatio}
          />
        </div>
      </GridContainer>
      <Footer>
        <Button variant="contained" onClick={handleNextClicked}>
          Next
        </Button>
      </Footer>
    </Container>
  )
}

export default WebcamSelectStep
