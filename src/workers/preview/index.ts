import PromiseWorker from 'promise-worker'
import { FormatPreviewRequest } from 'renderer/components/Preview'

import Worker from 'worker-loader!./worker'
const worker = new Worker()
const promiseWorker = new PromiseWorker(worker)

const generatePreview = (args: FormatPreviewRequest) =>
  promiseWorker.postMessage({
    type: 'generatePreview',
    args,
  })
export default { generatePreview }
