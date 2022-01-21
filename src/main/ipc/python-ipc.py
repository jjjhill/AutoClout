#!/usr/bin/env python3

import sys
from video import video

print('python script executed')
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
    facecamX1, facecamY1, facecamX2, facecamY2), output=outputFilePath, videoLength=1, realCamHeight=realCamHeight, zoomRatio=zoomRatio)
