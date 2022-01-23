from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.video.VideoClip import ImageClip
from moviepy.video.VideoClip import TextClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from moviepy.video.fx.crop import crop
from moviepy.video.fx.resize import resize
from moviepy.video.fx.margin import margin
from skimage.filters import gaussian
import time
import os

pyEnv = os.getenv('PY_ENV')
isProd = pyEnv.strip() == 'production' if pyEnv else False
assetsPath = 'resources/assets' if isProd else 'assets'


def blur(image):
  """ Returns a blurred (radius=2 pixels) version of the image """
  return gaussian(image.astype(float), sigma=1, truncate=1)


defaultOutputFile = os.getcwd() + '\\out\\' + str(time.time()) + '.mp4'


def formatVideo(fileName, username="ExquisiteSquid", faceCamCoords=(0, 350, 378, 536), output=defaultOutputFile, videoLength=1, realCamHeight=400, zoomRatio=1):
  # load mp4
  print('formatVideo called', flush=True)
  print('realCamHeight: ', realCamHeight, flush=True)

  main = VideoFileClip(fileName)
  (imageWidth, imageHeight) = main.size

  faceCamClip = crop(main, faceCamCoords[0], faceCamCoords[1], faceCamCoords[2], faceCamCoords[3])
  # faceCamClip = margin(faceCamClip, None, 0, 0, 20, 0, (0, 0, 0), 0)
  faceCamClip = resize(faceCamClip, None, realCamHeight, None).set_position(("center", "top"))
  (_, facecamHeight) = faceCamClip.size
  print(realCamHeight, facecamHeight, flush=True)

  # min/max values for zoom slider
  minRawGameplayWidth = (1080 / 1920) * imageHeight
  maxRawGameplayWidth = imageWidth
  rawGameplayWidth = minRawGameplayWidth + (maxRawGameplayWidth - minRawGameplayWidth) * (1 - zoomRatio)

  extra = imageWidth - rawGameplayWidth
  main = crop(main, extra / 2, 0, imageWidth - extra / 2, imageHeight)

  # fill width
  main = resize(main, None, None, 1080)
  (_, realGameplayHeight) = main.size

  backgroundClip = resize(main, None, 200, None)
  backgroundClip = backgroundClip.fl_image(blur)
  backgroundClip = resize(backgroundClip, None, 1920, None).set_position(("center", "center"))
  backgroundClip.save_frame("backgroundClip.png")

  extraHeight = 1920 - realGameplayHeight
  contentHeight = 1920 - realCamHeight
  # position gameplay
  if realGameplayHeight + realCamHeight <= 1920:
    # there is extra content space
    if realCamHeight < extraHeight / 2:
      # shift gameplay down to center screen
      gameplayVerticalOffset = extraHeight / 2
    else:
      # put gameplay directly under cam
      gameplayVerticalOffset = realCamHeight
  else:
    # gameplay too tall, shift gameplay up
    extraGameplayHeight = realGameplayHeight - contentHeight
    gameplayVerticalOffset = realCamHeight - extraGameplayHeight / 2

  print(realCamHeight, realGameplayHeight, gameplayVerticalOffset, flush=True)

  # linksY = facecamHeight + mainClipHeight
  # twitchLogo = ImageClip(assetsPath + '/twitch.png')
  # twitchLogo = resize(twitchLogo, (120, 120)).set_position((40+100, linksY))
  main = main.set_position((0, gameplayVerticalOffset))
  clips = [
      backgroundClip,
      main,
      faceCamClip,
      # twitchLogo,
  ]

  # if not username:
  #   twitchURL = TextClip(username, color='white', fontsize=75).set_position((180+100, linksY + 10))
  #   clips.append(twitchURL)

  final = CompositeVideoClip(clips, size=(1080, 1920))
  final.save_frame("COMP.png")

  start = time.time()
  # return
  print('START_WRITE', flush=True)
  print(output, flush=True)
  final.set_duration(videoLength).write_videofile(output, threads=1, fps=30, verbose=False,
                                                  logger=None, preset='ultrafast')
  end = time.time()
  print(end - start)
  print('END_WRITE')
