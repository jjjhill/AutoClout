import styled, { css } from 'styled-components'
import Jimp from 'jimp'
import { useContext, useEffect, useRef, useState } from 'react'
import { store } from 'renderer/store'
import { Rectangle } from './FacecamSelection'
import useComponentSize from '@rehooks/component-size'

interface ContainerProps {
  previewWidth?: number
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
    transform: translateX(-50%);
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    height: 200px;
    float: left;
  }
`

interface Props {
  webcamCoords: Rectangle
}

type Side = 'left' | 'right'

const Preview = ({ webcamCoords }: Props) => {
  const { left, width, height } = webcamCoords
  const webcamAspect = width / height
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewWidth, setPreviewWidth] = useState<number>()
  const {
    state: { screenshotURL },
  } = useContext(store)

  const previewImageRef = useRef<HTMLImageElement>()

  const previewSize = useComponentSize(previewImageRef)
  useEffect(() => {
    if (previewSize && previewSize.height > 0) {
      setPreviewWidth((1080 / 1920) * previewSize.height)
    }
  }, [previewSize])

  const newWebcamSize = (200 / previewSize.height) * 1920

  const formatScreenshot = async () => {
    try {
      const image = await Jimp.read(screenshotURL)
      const imageWidth = image.bitmap.width
      const imageHeight = image.bitmap.height

      const side: Side = left < imageWidth / 2 ? 'left' : 'right'

      let croppedOutWidth
      if (side === 'left') {
        croppedOutWidth = left + width
      } else {
        croppedOutWidth = imageWidth - left
      }
      const croppedImageWidth = imageWidth - croppedOutWidth * 2
      const scaledWidth = (1920 / imageHeight) * croppedImageWidth

      const canCropOutWebcam = scaledWidth >= 1080
      let blurredBackground

      if (canCropOutWebcam) {
        // crop out webcam
        if (side === 'left') {
          image.crop(left + width, 0, imageWidth - 2 * width, imageHeight)
        } else {
          image.crop(croppedOutWidth, 0, left, imageHeight)
        }

        const croppedWidth = image.bitmap.width
        const croppedHeight = image.bitmap.height
        const croppedRatio = croppedWidth / croppedHeight

        const backgroundWidth = Math.round(croppedRatio * 1920)
        const extraWidth = backgroundWidth - 1080

        if (extraWidth > 0) {
          blurredBackground = image.clone()
          blurredBackground.resize(backgroundWidth, 1920)

          blurredBackground.crop(Math.round(extraWidth / 2), 0, 1080, 1920)
          blurredBackground.blur(10)
        }

        const gameplayHeight = 1080 / croppedRatio
        image.resize(1080, gameplayHeight)
      }

      blurredBackground?.composite(image, 0, newWebcamSize)
      const buffer = await blurredBackground.getBase64Async(Jimp.MIME_PNG)
      // const buffer = await blurredBackground.getBase64Async(Jimp.MIME_PNG)
      console.log({ buffer: buffer.toString() })
      setPreviewSrc(buffer.toString())
    } catch (err) {
      console.log('errrored')
      console.error(err)
    }
  }

  useEffect(() => {
    if (screenshotURL) {
      formatScreenshot()
    }
  }, [screenshotURL, webcamCoords])

  return (
    <Container previewWidth={previewWidth}>
      <img ref={previewImageRef} src={previewSrc} />
      <div className="img-preview" />
    </Container>
  )
}

export default Preview
