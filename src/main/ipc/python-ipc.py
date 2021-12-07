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
facecamX1 = int(round(float(sys.argv[3])))
facecamY1 = int(round(float(sys.argv[4])))
facecamX2 = int(round(float(sys.argv[5])))
facecamY2 = int(round(float(sys.argv[6])))
outputFilePath = sys.argv[7]
videoLength = float(sys.argv[8])

video.formatVideo(fileName, username=username, faceCamCoords=(
    facecamX1, facecamY1, facecamX2, facecamY2), output=outputFilePath, videoLength=videoLength)


# async def main():
#   line = await aioconsole.ainput()
#   callFunction(line)

# if __name__ == "__main__":
#   asyncio.run(main())
