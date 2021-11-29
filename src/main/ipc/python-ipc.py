#!/usr/bin/env python3

import sys
import aioconsole
import asyncio
from video import video


def callFunction(name):
  print(name)
  functionToCall = getattr(video, name)
  functionToCall('test.mp4')


async def main():
  while 1:
    line = await aioconsole.ainput()
    callFunction(line)

if __name__ == "__main__":
  asyncio.run(main())
