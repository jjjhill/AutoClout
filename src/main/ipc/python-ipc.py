#!/usr/bin/env python3

import sys
from video import video


def callFunction(name):
  print(name)
  functionToCall = getattr(video, name)
  functionToCall('test.mp4')


print('python script executed')
fileName = sys.argv[1]
video.formatVideo(fileName)


# async def main():
#   line = await aioconsole.ainput()
#   callFunction(line)

# if __name__ == "__main__":
#   asyncio.run(main())
