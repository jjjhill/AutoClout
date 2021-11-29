from moviepy.editor import VideoFileClip


def formatVideo(fileName):
  # load mp4
  print('formatVideo called')
  clip = VideoFileClip(fileName).subclip(5, 10)
  clip.write_videofile("test_out.mp4")
