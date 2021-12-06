#!/usr/bin/env python3

import sys
from video import video


# def callFunction(name):
#   print(name)
#   functionToCall = getattr(video, name)
#   functionToCall('test.mp4')


print('python script executed')
fileName = sys.argv[1]
username = sys.argv[2]
facecamX1 = sys.argv[3]
facecamY1 = sys.argv[4]
facecamX2 = sys.argv[5]
facecamY2 = sys.argv[6]

video.formatVideo(fileName, username=username, faceCamCoords=(facecamX1, facecamY1, facecamX2, facecamY2))


# async def main():
#   line = await aioconsole.ainput()
#   callFunction(line)

# if __name__ == "__main__":
#   asyncio.run(main())
