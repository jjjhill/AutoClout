import { PythonShell } from 'python-shell'
import { exec } from 'child_process'

const invokeFormatScript = (
  fileName: string,
  username: string,
  facecamCoords: [number, number, number, number],
  onLog: (message: string) => void
) => {
  if (process.env.NODE_ENV === 'development') {
    const options = {
      args: [
        'C:\\Users\\Josh\\AutoClout\\test.mp4',
        username,
        ...facecamCoords.map((x) => x.toString()),
      ],
    }
    const pyshell = new PythonShell('./src/main/ipc/python-ipc.py', options)
    // sends a message to the Python script via stdin
    pyshell.on('message', function (message) {
      // received a message sent from the Python script (a simple "print" statement)
      onLog(message)
    })
    pyshell.on('error', (data) => onLog(JSON.stringify(data, null, 2)))
    pyshell.on('pythonError', (data) => onLog(JSON.stringify(data, null, 2)))
    pyshell.on('stderr', (data) => onLog(data))
  } else {
    exec(
      'SET IMAGEMAGICK_BINARY=.\\resources\\bin\\ImageMagick\\magick.exe && SET PY_ENV=production && .\\resources\\build\\exe.win-amd64-3.9\\python-ipc.exe C:\\Users\\Josh\\AutoClout\\test.mp4',
      (err, stdOut, stdErr) => {
        onLog(JSON.stringify(err, null, 2))
        onLog(stdOut.toString())
        onLog(stdErr.toString())
      }
    )
  }
}

export default invokeFormatScript
