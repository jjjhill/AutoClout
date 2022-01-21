import styled, { css } from 'styled-components'
import { useContext, useEffect, useMemo, useState } from 'react'
import { store } from 'renderer/store'
import { Rectangle } from './FacecamSelection'
import preview from 'workers/preview'
import iphoneSrc from '../../../assets/iphone.png'

interface ContainerProps {
  previewWidth?: number
  camPreviewHeight: number
  previewHeight: number
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

  .preview {
    border-radius: 10px;
    width: 100%;
    max-width: 100%;
  }

  .img-preview {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(calc(-50% - 1px));
    overflow: hidden;
    width: calc(100% + 2px);
    ${({ camPreviewHeight }: ContainerProps) =>
      camPreviewHeight &&
      css`
        height: ${camPreviewHeight}px;
      `}
    float: left;
    z-index: 1;
  }

  .phone-border {
    ${({ previewHeight, previewWidth }: ContainerProps) =>
      previewHeight &&
      previewWidth &&
      css`
        height: ${previewHeight}px;
        position: absolute;
        top: 0;
        left: 0;
        width: calc(${previewWidth}px + 48px);
        height: calc(${previewHeight}px + 43px);
        transform: translate(-30px, -20px);
        z-index: 2;
      `}
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
  zoomRatio: number
}

export type Side = 'left' | 'right'

const Preview = ({
  webcamCoords,
  previewHeight,
  previewWidth,
  realCamHeight,
  zoomRatio,
}: Props) => {
  const { left, width, height } = webcamCoords
  const camAspect = width / height
  const [previewSrc, setPreviewSrc] = useState('')
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
      realCamHeight:
        camAspect > 1080 / realCamHeight ? 1080 / camAspect : realCamHeight,
    }),
    [screenshotURL, left, width, zoomRatio, realCamHeight, webcamCoords]
  )

  useEffect(() => {
    if (args.screenshotURL) {
      formatScreenshot(args)
    }
  }, [args])

  const formatScreenshot = async (args: FormatPreviewRequest) => {
    console.log({ realCamHeight: args.realCamHeight })
    // in background worker
    const formattedImg = await preview.generatePreview(args)
    setPreviewSrc(formattedImg)
  }

  return (
    <Container
      previewWidth={previewWidth}
      previewHeight={previewHeight}
      camPreviewHeight={camPreviewHeight}
    >
      <img src={iphoneSrc} className="phone-border" />
      <img src={previewSrc} className="preview" />
      <div className="img-preview" />
    </Container>
  )
}

export default Preview
