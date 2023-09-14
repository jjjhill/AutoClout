import styled, { css } from 'styled-components'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import { store } from 'renderer/store'
import { Rectangle } from './FacecamSelection'
import preview from 'workers/preview'
import iphoneSrc from '../../../assets/iphone.png'
import Lottie from 'react-lottie'
import * as animationData from '../../../assets/icons/lottie/loading.json'

interface ContainerProps {
  previewWidth?: number
  camPreviewHeight: number
  previewHeight: number
  isLoading?: boolean
}

const Container = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  max-width: 100%;

  ${({ previewWidth, previewHeight }: ContainerProps) =>
    previewWidth &&
    css`
      width: ${previewWidth}px;
      height: ${previewHeight}px;
    `}

  .preview {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    width: 100%;
    max-width: 100%;
  }

  .crop-preview-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 30px;
    overflow: hidden;

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

      ${({ camEnabled }: ContainerProps) =>
        !camEnabled &&
        css`
          display: none;
        `}
    }

    .img-url-preview {
      ${({ camPreviewHeight }: ContainerProps) =>
        camPreviewHeight &&
        css`
          height: ${camPreviewHeight}px;
        `}

      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }
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
        width: calc(${previewWidth}px + 37px);
        height: calc(${previewHeight}px + 100px);
        transform: translate(-20px, -16px);
        z-index: 2;
      `}
  }

  ${({ isLoading }: ContainerProps) =>
    isLoading &&
    css`
      ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
        background: rgba(255, 255, 255, 0.4);
      }
    `}

  .loading-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
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
  camEnabled: boolean
  cropURL?: string
  isLoading?: boolean
}

export type Side = 'left' | 'right'

const Preview = ({
  webcamCoords,
  previewHeight,
  previewWidth,
  realCamHeight,
  zoomRatio,
  camEnabled,
  cropURL,
  isLoading,
}: Props) => {
  const { left, width, height } = webcamCoords
  const camAspect = width / height
  const [previewSrc, setPreviewSrc] = useState('')
  const {
    state: { screenshotURL },
  } = useContext(store)
  const camPreviewHeight = (realCamHeight / 1920) * previewHeight

  const args: FormatPreviewRequest = useMemo(() => {
    const camHeight =
      camAspect > 1080 / realCamHeight ? 1080 / camAspect : realCamHeight
    return {
      screenshotURL,
      camLeft: left,
      camWidth: width,
      zoomRatio,
      realCamHeight: camEnabled ? camHeight : 0,
    }
  }, [
    screenshotURL,
    left,
    width,
    zoomRatio,
    realCamHeight,
    webcamCoords,
    camEnabled,
  ])

  useEffect(() => {
    if (args.screenshotURL) {
      formatScreenshot(args)
    }
  }, [args])

  const formatScreenshot = useCallback(
    debounce(
      async (args: FormatPreviewRequest) => {
        console.log({ realCamHeight: args.realCamHeight })
        // in background worker
        const formattedImg = await preview.generatePreview(args)
        setPreviewSrc(formattedImg)
      },
      1000,
      { leading: true }
    ),
    []
  )

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  }

  return (
    <Container
      previewWidth={previewWidth}
      previewHeight={previewHeight}
      camPreviewHeight={camPreviewHeight}
      camEnabled={camEnabled}
      isLoading={isLoading}
    >
      <img src={iphoneSrc} className="phone-border" />
      <img src={previewSrc} className="preview" />
      <div className="crop-preview-container">
        {cropURL && <img src={cropURL} className="img-url-preview" />}
        {!cropURL && <div className="img-preview" />}
      </div>
      {isLoading && (
        <div className="loading-animation">
          <Lottie options={defaultOptions} height={100} width={100} />
        </div>
      )}
    </Container>
  )
}

export default Preview
