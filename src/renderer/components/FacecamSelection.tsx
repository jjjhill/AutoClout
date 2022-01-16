import { Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ReactCropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import omit from 'lodash.omit'
import Cropper from 'cropperjs'

import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;

  svg {
    max-height: 100%;
    max-width: 100%;
  }
`

interface Rectangle {
  left: number
  top: number
  width: number
  height: number
}

interface CropData {
  cropURL: string
  position: Rectangle
}

interface Props {
  imgSrc: string
  handleFacecamSelected: (rect: Rectangle) => void
}

const FacecamSelection = ({ imgSrc, handleFacecamSelected }: Props) => {
  const cropperRef = useRef<HTMLImageElement>(null)
  const [cropData, setCropData] = useState<CropData | undefined>()

  const getCropData = () => {
    const cropper = cropperRef?.current?.cropper

    if (typeof cropper !== 'undefined') {
      const croppedCanvas = cropper.getCroppedCanvas()
      const cropBoxData = cropper.getCropBoxData()
      const data = cropper.getData()
      const {
        left,
        top,
        width: croppedWidth,
        height: croppedHeight,
      } = cropBoxData

      const imageData = cropper.getImageData()
      const { width: displayedWidth, naturalWidth } = imageData

      const scale = naturalWidth / displayedWidth
      const realWebcamPosition = {
        left: left * scale,
        top: top * scale,
        width: croppedWidth * scale,
        height: croppedHeight * scale,
      }
      console.log({ imageData, cropBoxData, data, realWebcamPosition })

      setCropData({
        cropURL: croppedCanvas.toDataURL(),
        position: realWebcamPosition,
      })

      handleFacecamSelected(realWebcamPosition)
    }
  }

  return (
    <Container>
      <ReactCropper
        style={{ width: '100%' }}
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
      />
      {/* <Button variant="contained" onClick={getCropData}>
        Done
      </Button> */}
    </Container>
  )
}

export default FacecamSelection
