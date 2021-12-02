import { PythonShell } from 'python-shell'
console.log('BEFORE new pyshell')
const options = {
  args: ['test.mp4'],
}
const pyshell = new PythonShell('./src/main/ipc/python-ipc.py', options)
console.log('AFTER new pyshell')

// sends a message to the Python script via stdin
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message)
})
pyshell.on('error', (data) => console.log(data))
pyshell.on('pythonError', (data) => console.log(data))
pyshell.on('stderr', (data) => console.log(data))

// console.log('sending formatVideo from node')
// pyshell.send('formatVideo')
