import styled, { css } from 'styled-components'
import Jimp from 'jimp'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { store } from 'renderer/store'
import { Rectangle } from './FacecamSelection'
import useComponentSize from '@rehooks/component-size'
import { ipcRenderer } from 'electron'
import preview from 'workers/preview'

interface ContainerProps {
  previewWidth?: number
  camPreviewHeight: number
}

const Container = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;

  ${({ previewWidth }: ContainerProps) =>
    previewWidth &&
    css`
      width: ${previewWidth}px;
    `}

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .img-preview {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(calc(-50% - 1px));
    overflow: hidden;
    width: calc(100% + 1px);
    max-width: calc(100% + 19px);
    height: ${({ camPreviewHeight }: ContainerProps) =>
      `${camPreviewHeight}px`};
    float: left;
  }
`

export interface FormatPreviewRequest {
  screenshotURL: string
  camLeft: number
  camWidth: number
  zoomRatio: number
  realCamHeight: number
}

interface Props {
  webcamCoords: Rectangle
}

export type Side = 'left' | 'right'

const realCamHeight = 450
const Preview = ({ webcamCoords }: Props) => {
  const { left, width, height } = webcamCoords
  const webcamAspect = width / height
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewWidth, setPreviewWidth] = useState<number>()
  const [camPreviewHeight, setCamPreviewHeight] = useState<number>(200)
  const [zoomRatio, setZoomRatio] = useState(1)
  const {
    state: { screenshotURL },
  } = useContext(store)
  const previewImageRef = useRef<HTMLImageElement>()
  const previewSize = useComponentSize(previewImageRef)

  useEffect(() => {
    if (previewSize && previewSize.height > 0) {
      setPreviewWidth((1080 / 1920) * previewSize.height)
      setCamPreviewHeight((realCamHeight / 1920) * previewSize.height)
    }
  }, [previewSize])

  const args: FormatPreviewRequest = useMemo(
    () => ({
      screenshotURL,
      camLeft: left,
      camWidth: width,
      zoomRatio,
      realCamHeight,
    }),
    [screenshotURL, left, width, zoomRatio]
  )

  useEffect(() => {
    if (args.screenshotURL) {
      formatScreenshot(screenshotURL, left, width, zoomRatio, realCamHeight)
    }
  }, [args])

  const formatScreenshot = async (
    screenshotURL: string,
    camLeft: number,
    camWidth: number,
    zoomRatio = 0.77,
    realCamHeight: number
  ) => {
    // const formattedImg = await ipcRenderer.invoke('format-preview', {
    //   screenshotURL,
    //   camLeft,
    //   camWidth,
    //   zoomRatio,
    //   realCamHeight,
    // })
    const formattedImg = await preview.generatePreview({
      screenshotURL,
      camLeft,
      camWidth,
      zoomRatio,
      realCamHeight,
    })
    console.log({ formattedImg })
    setPreviewSrc(formattedImg)
  }

  return (
    <Container previewWidth={previewWidth} camPreviewHeight={camPreviewHeight}>
      <img ref={previewImageRef} src={previewSrc} />
      <div className="img-preview" />
    </Container>
  )
}

export default Preview
