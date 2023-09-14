// import { app } from 'electron'
import log from 'electron-log'
import path from 'path'
log.info({ eng: process.env.NODE_ENV })

log.info({ resourcesPath: process.resourcesPath })
export const ASSETS_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, 'assets')
    : `${process.cwd()}\\assets`

export const BIN_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, 'bin')
    : `${process.cwd()}\\bin`

export const PYTHON_BUILD_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, 'build')
    : `${process.cwd()}\\build`
