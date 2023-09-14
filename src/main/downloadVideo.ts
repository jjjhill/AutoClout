import { exec } from 'child_process'
import { app } from 'electron'
import log from 'electron-log'
import { BIN_PATH } from './constants'

const downloadVideo = (link: string) => {
  return new Promise((resolve, reject) => {
    log.info({
      userData: app.getPath('userData'),
    })
    const clipName = link.split('clip/')[1]
    const outputFile = `${app.getPath('userData')}\\clips\\${clipName}.mp4`
    const child = exec(
      `${BIN_PATH}\\youtube-dl\\youtube-dl.exe ${link} -o ${outputFile}`,
      (err, stdOut, stdErr) => {
        log.info(JSON.stringify(err, null, 2))
        log.info(stdOut.toString())
        log.error(stdErr.toString())
      }
    )
    child.on('exit', () => {
      resolve({
        outputFile,
        clipName,
      })
    })
  })
}

export default downloadVideo
