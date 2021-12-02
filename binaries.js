import path from 'path'
import { rootPath as root } from 'electron-root-path'
import { isPackaged } from 'electron-is-packaged'

const IS_PROD = process.env.NODE_ENV === 'production'

const binariesPath =
  IS_PROD && isPackaged // the path to a bundled electron app.
    ? path.join(root, 'Contents', 'Resources', 'bin')
    : path.join(root, 'build', 'win', 'bin')

export const execPath = path.resolve(
  path.join(binariesPath, './ImageMagick-7.1.0-16-Q16-HDRI-x64-dll.exe')
)
