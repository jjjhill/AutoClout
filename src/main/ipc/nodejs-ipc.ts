import { PythonShell } from 'python-shell'
import { exec } from 'child_process'

const invokeFormatScript = (
  fileName: string,
  username: string,
  facecamCoords: [number, number, number, number],
  onLog: (message: string) => void,
  onStartVideoWrite: () => void,
  onEndVideoWrite: () => void,
  outputFilePath: string,
  videoLength: number
) => {
  if (process.env.NODE_ENV === 'development') {
    const options = {
      args: [
        fileName,
        username,
        ...facecamCoords.map((x) => x.toString()),
        outputFilePath,
        videoLength.toString(),
      ],
    }
    const pyshell = new PythonShell('./src/main/ipc/python-ipc.py', options)
    pyshell.on('message', function (message) {
      if (message === 'START_WRITE') {
        onStartVideoWrite()
      }
      if (message === 'END_WRITE') {
        onEndVideoWrite()
      }
      onLog(message)
    })
    pyshell.on('error', (data) => onLog(JSON.stringify(data, null, 2)))
    pyshell.on('pythonError', (data) => onLog(JSON.stringify(data, null, 2)))
    pyshell.on('stderr', (data) => onLog(data))
  } else {
    exec(
      `SET IMAGEMAGICK_BINARY=.\\resources\\bin\\ImageMagick\\magick.exe && SET PY_ENV=production && .\\resources\\build\\exe.win-amd64-3.9\\python-ipc.exe ${fileName} ${username} ${facecamCoords
        .map((x) => x.toString())
        .join(' ')} ${outputFilePath} ${videoLength}`,
      (err, stdOut, stdErr) => {
        onLog(JSON.stringify(err, null, 2))
        onLog(stdOut.toString())
        onLog(stdErr.toString())
      }
    )
  }
}

export default invokeFormatScript
