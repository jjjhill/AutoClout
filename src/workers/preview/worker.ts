import Jimp from 'jimp'
import { FormatPreviewRequest, Side } from 'renderer/components/Preview'

import registerPromiseWorker from 'promise-worker/register'
registerPromiseWorker(async (message) => {
  if (message.type === 'generatePreview') {
    const preview = await generatePreview(message.args)

    return preview
  }
  return undefined
})

// zoomRatio from 0->1 (least zoomed to most)
const generatePreview = async (args: FormatPreviewRequest) => {
  const { screenshotURL, camLeft, camWidth, zoomRatio, realCamHeight } = args

  try {
    const image = await Jimp.read(screenshotURL)
    const imageWidth = image.bitmap.width
    const imageHeight = image.bitmap.height

    let gameplayVerticalOffset

    // min/max values for zoom slider
    const minRawGameplayWidth = (1080 / 1920) * imageHeight
    const maxRawGameplayWidth = imageWidth
    const rawGameplayWidth =
      minRawGameplayWidth +
      (maxRawGameplayWidth - minRawGameplayWidth) * (1 - zoomRatio)

    const extra = imageWidth - rawGameplayWidth
    image.crop(extra / 2, 0, rawGameplayWidth, imageHeight)

    // gameplay fills width
    image.resize(1080, Jimp.AUTO)
    const realGameplayHeight = image.bitmap.height

    // background
    const blurredBackground = image.clone()
    // fill height with background keeping aspect ratio
    blurredBackground.resize(Jimp.AUTO, 1920)
    const backgroundWidthAfterResize = blurredBackground.bitmap.width
    const extraWidth = backgroundWidthAfterResize - 1080

    if (extraWidth > 0) {
      blurredBackground.crop(Math.round(extraWidth / 2), 0, 1080, 1920)
    }
    blurredBackground.blur(20)

    const contentHeight = 1920 - realCamHeight
    const extraHeight = 1920 - realGameplayHeight
    // position gameplay
    if (realGameplayHeight + realCamHeight <= 1920) {
      // there is extra content space
      if (realCamHeight < extraHeight / 2) {
        // shift gameplay down to center screen
        gameplayVerticalOffset = extraHeight / 2
      } else {
        // put gameplay directly under cam
        gameplayVerticalOffset = realCamHeight
      }
    } else {
      // gameplay too tall, shift gameplay up
      const extraGameplayHeight = realGameplayHeight - contentHeight
      gameplayVerticalOffset = realCamHeight - extraGameplayHeight / 2
    }

    blurredBackground?.composite(image, 0, gameplayVerticalOffset)
    const buffer = await blurredBackground?.getBase64Async(Jimp.MIME_PNG)
    return buffer?.toString()
  } catch (err) {
    console.error(err)
    return undefined
  }
}
