import { PythonShell } from 'python-shell'
const pyshell = new PythonShell('./src/main/ipc/python-ipc.py')

// sends a message to the Python script via stdin
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message)
})
pyshell.on('error', (data) => console.log({ data }))
pyshell.on('pythonError', (data) => console.log({ data }))
pyshell.on('stderr', (data) => console.log({ data }))

pyshell.send('formatVideo')
