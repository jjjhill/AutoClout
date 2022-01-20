import styled, { css } from 'styled-components'
import { useContext, useEffect, useMemo, useState } from 'react'
import { store } from 'renderer/store'
import { Rectangle } from './FacecamSelection'
import preview from 'workers/preview'

interface ContainerProps {
  previewWidth?: number
  camPreviewHeight: number
}

const Container = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  max-width: 100%;

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
    max-width: calc(100% + 1px);
    ${({ camPreviewHeight }: ContainerProps) =>
      camPreviewHeight &&
      css`
        height: ${camPreviewHeight}px;
      `}
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
  previewWidth: number
  previewHeight: number
  realCamHeight: number
}

export type Side = 'left' | 'right'

const Preview = ({
  webcamCoords,
  previewHeight,
  previewWidth,
  realCamHeight,
}: Props) => {
  const { left, width, height } = webcamCoords
  const [previewSrc, setPreviewSrc] = useState('')
  const [zoomRatio, setZoomRatio] = useState(1)
  const {
    state: { screenshotURL },
  } = useContext(store)
  const camPreviewHeight = (realCamHeight / 1920) * previewHeight

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
    // in background worker
    const formattedImg = await preview.generatePreview({
      screenshotURL,
      camLeft,
      camWidth,
      zoomRatio,
      realCamHeight,
    })
    setPreviewSrc(formattedImg)
  }

  return (
    <Container previewWidth={previewWidth} camPreviewHeight={camPreviewHeight}>
      <img src={previewSrc} />
      <div className="img-preview" />
    </Container>
  )
}

export default Preview
