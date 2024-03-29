import styled, { css } from 'styled-components'
import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { colors, UserStep } from 'renderer/constants'
import FacecamSelection, {
  Rectangle,
} from 'renderer/components/FacecamSelection'
import { store } from 'renderer/store'
import Preview, { Side } from 'renderer/components/Preview'
import Button from '@mui/material/Button'
import { ipcRenderer } from 'electron'
import { FormatVideoRequest } from 'dto/format'
import SliderSource from '@mui/material/Slider'
import Actions from 'renderer/Actions'
import Switch from '@mui/material/Switch'
import { CropData } from 'renderer/pages/Home'

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
  min-height: 800px;
`

const Slider = styled(SliderSource)`
  .MuiSlider-markLabel {
    color: white;
  }
`

interface ContainerProps {
  previewWidth: number
}

const GridContainer = styled.div`
  flex: 1;
  min-height: 0;
  max-height: 100%;
  display: grid;
  grid-gap: 60px;
  grid-template-areas:
    'select select preview'
    'select select preview'
    'options options preview';

  grid-template-rows: repeat(3, minmax(150px, 1fr));
  grid-template-columns: 1fr 1fr ${({ previewWidth }: ContainerProps) =>
      `${previewWidth}px`};

  #webcam-selection {
    grid-area: select;

    .MuiSwitch-root {
      margin-left: 10px;
    }
  }

  #options-container {
    grid-area: options;

    h2 {
      margin-top: 0;
    }
  }

  #preview {
    grid-area: preview;
    display: flex;
    flex-direction: column;
  }
`

const Options = styled.div`
  display: flex;

  & > div {
    flex: 1;
    padding: 20px;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 35px;
`

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`

const Positioning = styled.div``

type RectCoords = [number, number, number, number]

const formatVideo = (args: FormatVideoRequest) => {
  ipcRenderer.invoke('format-video', args)
}

const toRectCoords: (rect: Rectangle) => RectCoords = (rect) => {
  return [rect.left, rect.top, rect.left + rect.width, rect.top + rect.height]
}

interface Props {
  realCamHeight: number
  previewWidth: number
  previewHeight: number
  setSliderValue: (val: number) => void
  sliderChanged: boolean
  setSliderChanged: (val: boolean) => void
  zoomRatio: number
  facecamCoords: Rectangle
  setFacecamCoords: (rect: Rectangle) => void
  camEnabled: boolean
  setCamEnabled: (val: boolean) => void
  sliderValue: number
  defaultSliderValue: number
  setCropData: (data: CropData) => void
}

const WebcamSelectStep = ({
  realCamHeight,
  previewWidth,
  previewHeight,
  setSliderValue,
  sliderChanged,
  setSliderChanged,
  zoomRatio,
  facecamCoords,
  setFacecamCoords,
  camEnabled,
  setCamEnabled,
  sliderValue,
  defaultSliderValue,
  setCropData,
}: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCamEnabled(event.target.checked)
  }

  const {
    dispatch,
    state: {
      downloadFilePath,
      videoLength,
      outputFilePath,
      screenshotURL,
      imageDimensions,
    },
  } = useContext(store)

  const optimalZoomRatio = useMemo(() => {
    const { width, height } = imageDimensions
    const { left: camLeft, width: camWidth } = facecamCoords

    if (!camWidth || !width) return undefined

    const side: Side = camLeft < width / 2 ? 'left' : 'right'

    let croppedOutWidth
    if (side === 'left') {
      croppedOutWidth = camLeft + camWidth
    } else {
      croppedOutWidth = width - camLeft
    }
    const croppedWidth = width - croppedOutWidth * 2

    const minWidth = (1080 / 1920) * height
    const maxWidth = width
    console.log({
      croppedWidth,
      minWidth,
      maxWidth,
      width,
      height,
      camLeft,
      camWidth,
    })

    const scaledWidth = (1920 / height) * croppedWidth
    const canCropOutWebcam = scaledWidth >= 1080
    if (!canCropOutWebcam) {
      return undefined
    }

    return 1 - (croppedWidth - minWidth) / (maxWidth - minWidth)
  }, [imageDimensions, facecamCoords])

  useEffect(() => {
    if (optimalZoomRatio && !sliderChanged) {
      setSliderValue(Number((optimalZoomRatio * 100).toFixed(1)))
    }
  }, [optimalZoomRatio])

  const handleNextClicked = () => {
    const { width, height } = facecamCoords
    const camAspect = width / height
    const camHeight =
      camAspect > 1080 / realCamHeight ? 1080 / camAspect : realCamHeight
    const args = {
      fileName: downloadFilePath,
      username: '',
      facecamCoords: toRectCoords(facecamCoords),
      videoLength,
      outputFilePath,
      realCamHeight: camEnabled ? camHeight : 0,
      zoomRatio,
    }

    console.log(args)
    formatVideo(args)
    dispatch(Actions.setStep(UserStep.SOCIALS))
    dispatch(Actions.setIsWriting(true))
  }

  const marks = useMemo(
    () =>
      optimalZoomRatio
        ? [
            {
              value: (optimalZoomRatio * 100).toFixed(1),
              label: 'Optimal',
            },
          ]
        : false,
    [optimalZoomRatio]
  )
  console.log({ marks })
  return (
    <Container>
      <GridContainer previewWidth={previewWidth + 10}>
        <div id="webcam-selection">
          <FlexRow>
            <h2>Select Webcam</h2>
            <Switch checked={camEnabled} onChange={handleChange} label="On" />
          </FlexRow>

          <FacecamSelection
            imgSrc={screenshotURL}
            handleFacecamSelected={setFacecamCoords}
            imageDimensions={imageDimensions}
            camEnabled={camEnabled}
            setCropData={setCropData}
          />
        </div>
        <div id="options-container">
          <h2>Options</h2>
          <Options>
            {/* <BorderSelect /> */}
            <div>
              <div>Gameplay Zoom</div>
              <Slider
                aria-label="Zoom"
                defaultValue={defaultSliderValue}
                valueLabelDisplay="auto"
                value={sliderValue}
                onChange={(_, newValue) => {
                  setSliderChanged(true)
                  if (
                    optimalZoomRatio &&
                    Math.abs((newValue as number) - optimalZoomRatio * 100) < 2
                  ) {
                    setSliderValue(Number((optimalZoomRatio * 100).toFixed(1)))
                    return
                  }
                  setSliderValue(newValue as number)
                }}
                marks={marks}
                min={0}
                max={100}
              />
            </div>
            <div />
          </Options>
        </div>
        <div id="preview">
          <h2>Preview</h2>
          <Preview
            webcamCoords={facecamCoords}
            previewHeight={previewHeight}
            previewWidth={previewWidth}
            realCamHeight={realCamHeight}
            zoomRatio={zoomRatio}
            camEnabled={camEnabled}
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
