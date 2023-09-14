#!/usr/bin/env python3

import sys
from video import video

print('python script executed')
# print(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5],
#       sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10])
fileName = sys.argv[1]
username = sys.argv[2]
facecamX1 = int(round(float(sys.argv[3])))
facecamY1 = int(round(float(sys.argv[4])))
facecamX2 = int(round(float(sys.argv[5])))
facecamY2 = int(round(float(sys.argv[6])))
outputFilePath = sys.argv[7]
videoLength = float(sys.argv[8])
realCamHeight = float(sys.argv[9])
zoomRatio = float(sys.argv[10])

video.formatVideo(fileName, username=username, faceCamCoords=(
    facecamX1, facecamY1, facecamX2, facecamY2), output=outputFilePath, videoLength=videoLength, realCamHeight=realCamHeight, zoomRatio=zoomRatio)
