import { exec } from 'child_process'
const downloadVideo = (link: string) => {
  return new Promise((resolve, reject) => {
    console.log({ link })
    const clipName = link.split('clip/')[1]
    const outputFile = `${process.cwd()}\\clips\\${clipName}.mp4`
    const child = exec(
      `.\\bin\\youtube-dl\\youtube-dl.exe ${link} -o ${outputFile}`,
      (err, stdOut, stdErr) => {
        console.log(JSON.stringify(err, null, 2))
        console.log(stdOut.toString())
        console.log(stdErr.toString())
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
