import Jimp from 'jimp'
import { FormatPreviewRequest, Side } from 'renderer/components/Preview'
// zoomRatio from 0->1 (least zoomed to most)
const generatePreview = async (args: FormatPreviewRequest) => {
  const { screenshotURL, camLeft, camWidth, zoomRatio, realCamHeight } = args

  try {
    const image = await Jimp.read(screenshotURL)
    const imageWidth = image.bitmap.width
    const imageHeight = image.bitmap.height

    const side: Side = camLeft < imageWidth / 2 ? 'left' : 'right'

    let croppedOutWidth
    if (side === 'left') {
      croppedOutWidth = camLeft + camWidth
    } else {
      croppedOutWidth = imageWidth - camLeft
    }
    const croppedImageWidth = imageWidth - croppedOutWidth * 2
    const scaledWidth = (1920 / imageHeight) * croppedImageWidth

    const canCropOutWebcam = scaledWidth >= 1080
    let blurredBackground, gameplayVerticalOffset

    if (canCropOutWebcam) {
      // crop out webcam
      if (side === 'left') {
        image.crop(
          camLeft + camWidth,
          0,
          imageWidth - 2 * camWidth,
          imageHeight
        )
      } else {
        image.crop(croppedOutWidth, 0, camLeft, imageHeight)
      }

      const croppedWidth = image.bitmap.width
      const croppedHeight = image.bitmap.height
      const croppedRatio = croppedWidth / croppedHeight

      const backgroundWidth = Math.round(croppedRatio * 1920)
      const extraWidth = backgroundWidth - 1080

      if (extraWidth > 0) {
        blurredBackground = image.clone()
        //keep aspect ratio resize
        blurredBackground.resize(Jimp.AUTO, 1920)

        blurredBackground.crop(Math.round(extraWidth / 2), 0, 1080, 1920)
        blurredBackground.blur(10)
      }

      // fill width
      image.resize(1080, Jimp.AUTO)
      gameplayVerticalOffset = realCamHeight
    } else {
      // use these as min/max values for zoom slider
      const minRawGameplayWidth = (1080 / 1920) * imageHeight
      const maxRawGameplayWidth = imageWidth
      const rawGameplayWidth =
        minRawGameplayWidth +
        (maxRawGameplayWidth - minRawGameplayWidth) * (1 - zoomRatio)

      const extra = imageWidth - rawGameplayWidth
      image.crop(extra / 2, 0, rawGameplayWidth, imageHeight)

      // fill width
      image.resize(1080, Jimp.AUTO)
      const newGameplayHeight = image.bitmap.height
      blurredBackground = image.clone()
      // fill height with background keeping aspect ratio
      blurredBackground.resize(Jimp.AUTO, 1920)
      const backgroundWidthAfterResize = blurredBackground.bitmap.width
      const extraWidth = backgroundWidthAfterResize - 1080

      if (extraWidth > 0) {
        blurredBackground.crop(Math.round(extraWidth / 2), 0, 1080, 1920)
      }
      blurredBackground.blur(10)
      gameplayVerticalOffset = (1920 - newGameplayHeight) / 2
    }

    blurredBackground?.composite(image, 0, gameplayVerticalOffset)
    const buffer = await blurredBackground.getBase64Async(Jimp.MIME_PNG)
    // console.log({ buffer: buffer.toString() })
    return buffer.toString()
  } catch (err) {
    // console.log('errrored')
    console.error(err)
    return undefined
  }
}

export default generatePreview
