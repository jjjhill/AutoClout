import { Button } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactCropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import omit from 'lodash.omit'
import Cropper from 'cropperjs'

import styled from 'styled-components'

const Container = styled.div`
  min-width: 100%;
  height: 100%;

  svg {
    max-height: 100%;
    max-width: 100%;
  }
`

export interface Rectangle {
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
      const data = cropper.getData()
      const { x, y, width, height } = data

      const position = {
        left: x,
        top: y,
        height,
        width,
      }
      console.log({ position })

      setCropData({
        cropURL: croppedCanvas.toDataURL(),
        position,
      })

      handleFacecamSelected(position)
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
        wheelZoomRatio={0.5}
      />
      {/* <Button variant="contained" onClick={getCropData}>
        Done
      </Button> */}
    </Container>
  )
}

export default FacecamSelection
