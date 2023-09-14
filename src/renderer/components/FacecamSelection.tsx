import { useEffect, useMemo, useRef, useState } from 'react'
import ReactCropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

import styled, { css } from 'styled-components'
import log from 'electron-log'

interface ContainerProps {
  camEnabled: boolean
}

const Container = styled.div`
  min-width: 100%;
  max-height: 100%;
  position: relative;

  & > div {
    max-height: 100%;
  }

  img {
    max-height: 100%;
    max-width: 100%;
  }

  ${({ camEnabled }: ContainerProps) =>
    !camEnabled &&
    css`
      ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        background: rgb(100, 100, 100, 0.4);
        cursor: not-allowed;
      }
    `}
`

export interface Rectangle {
  left: number
  top: number
  width: number
  height: number
}

interface Props {
  imgSrc: string
  handleFacecamSelected: (rect: Rectangle) => void
  imageDimensions: { width: number; height: number }
  camEnabled: boolean
  setCropData: (data: CropData) => void
}

const FacecamSelection = ({
  imgSrc,
  handleFacecamSelected,
  imageDimensions,
  camEnabled,
  setCropData,
}: Props) => {
  log.info({ imageDimensions })
  const cropperRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const cropper = cropperRef?.current?.cropper
    if (cropper) {
      if (!camEnabled) {
        cropper.disable()
      } else {
        cropper.enable()
        cropper.setDragMode('move')
      }
    }
  }, [camEnabled])

  const getCropData = () => {
    const cropper = cropperRef?.current?.cropper

    if (typeof cropper !== 'undefined' && cropper.getCroppedCanvas()) {
      const croppedCanvas = cropper.getCroppedCanvas()
      const data = cropper.getData()
      const { x, y, width, height } = data

      const position = {
        left: x,
        top: y,
        height,
        width,
      }
      log.info({ position })

      setCropData({
        cropURL: croppedCanvas.toDataURL(),
        position,
      })

      handleFacecamSelected(position)
    }
  }

  useEffect(() => {
    setTimeout(() => getCropData(), 500)
  }, [])

  const maxHeight = 400
  const maxWidth =
    (imageDimensions.width / imageDimensions.height) * maxHeight + 300

  return (
    <Container camEnabled={camEnabled}>
      <ReactCropper
        style={{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }}
        preview=".img-preview"
        src={imgSrc}
        viewMode={1}
        dragMode="move"
        minCropBoxHeight={30}
        minCropBoxWidth={30}
        background={false}
        responsive={true}
        autoCropArea={0.5}
        checkOrientation={false}
        initialAspectRatio={4 / 3}
        cropend={getCropData}
        zoom={getCropData}
        guides={true}
        ref={cropperRef}
        wheelZoomRatio={0.5}
      />
      {/* <Button variant="contained" onClick={getCropData}>
        Done
      </Button> */}
    </Container>
  )
}

export default FacecamSelection
