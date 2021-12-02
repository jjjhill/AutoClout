from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.video.VideoClip import ImageClip
from moviepy.video.VideoClip import TextClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from moviepy.video.fx.crop import crop
from moviepy.video.fx.resize import resize
from moviepy.video.fx.margin import margin
from skimage.filters import gaussian
import time


def blur(image):
  """ Returns a blurred (radius=2 pixels) version of the image """
  return gaussian(image.astype(float), sigma=1, truncate=1)


def formatVideo(fileName, username="SomeFuckingGuy", faceCamCoords=(0, 350, 378, 536)):
  # load mp4
  print('formatVideo called', flush=True)

  main = VideoFileClip(fileName)

  faceCamClip = crop(main, faceCamCoords[0], faceCamCoords[1], faceCamCoords[2], faceCamCoords[3])
  faceCamClip = margin(faceCamClip, None, 0, 0, 20, 0, (0, 0, 0), 0)
  faceCamClip = resize(faceCamClip, None, None, 900).set_position(("center", "top"))
  (_, facecamHeight) = faceCamClip.size

  (originalWidth, originalHeight) = main.size

  mainClip = crop(main, 378, 0, originalWidth-378, originalHeight)
  mainClip = resize(mainClip, None, None, 1080).set_position((0, facecamHeight))
  (_, mainClipHeight) = mainClip.size

  mainClip.save_frame("MAIN.png")

  backgroundClip = resize(main, None, 200, None)
  backgroundClip = backgroundClip.fl_image(blur)
  backgroundClip = resize(backgroundClip, None, 1920, None).set_position(("center", "center"))
  backgroundClip.save_frame("backgroundClip.png")

  linksY = facecamHeight + mainClipHeight
  twitchLogo = ImageClip("assets/twitch.png")
  twitchLogo = resize(twitchLogo, (120, 120)).set_position((40+100, linksY))

  twitchURL = TextClip(username, color='white', fontsize=75).set_position((180+100, linksY + 10))

  final = CompositeVideoClip([
      backgroundClip,
      mainClip,
      faceCamClip,
      twitchLogo,
      twitchURL
  ], size=(1080, 1920))
  final.save_frame("COMP.png")

  start = time.time()
  return
  print('start write', flush=True)
  final.write_videofile('test_out.mp4', threads=1, fps=30, verbose=False,
                        logger=None, preset='ultrafast')
  end = time.time()
  print(end - start)
  print('write done')
