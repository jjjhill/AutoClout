/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint global-require: off, no-console: off */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { resolveHtmlPath } from './util'

import invokeFormatScript from './ipc/nodejs-ipc'
import { DownloadVideoRequest, FormatVideoRequest } from 'dto/format'
import windowStateKeeper from '../windowStateKeeper'
import downloadVideo from './downloadVideo'
import generatePreview from './generatePreview'
import { FormatPreviewRequest } from 'renderer/components/Preview'

process.on('uncaughtException', function (error) {
  onLog(error)
})

const onLog = (message) => {
  setTimeout(() => {
    if (mainWindow?.webContents) {
      mainWindow?.webContents.send('main-message', JSON.stringify(message))
    }
  }, 5000)
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null = null

const onStartVideoWrite = () => {
  mainWindow?.webContents.send('START_WRITE')
}

const onEndVideoWrite = () => {
  mainWindow?.webContents.send('END_WRITE')
}

ipcMain.handle('format-video', async (_, args: FormatVideoRequest) => {
  const { fileName, username, facecamCoords, videoLength, outputFilePath } =
    args
  console.log({ fileName, username, facecamCoords })
  invokeFormatScript(
    fileName,
    username,
    facecamCoords,
    onLog,
    onStartVideoWrite,
    onEndVideoWrite,
    outputFilePath,
    // videoLength
    5
  )
})

ipcMain.handle('download-video', async (_, args: DownloadVideoRequest) => {
  const { outputFile, clipName } = await downloadVideo(args.clipLink)

  return { outputFile, clipName }
})

ipcMain.handle('format-preview', async (_, args: FormatPreviewRequest) => {
  const result = await generatePreview(args)

  return { result }
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDevelopment) {
  require('electron-debug')()
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }
  const mainWindowStateKeeper = windowStateKeeper('main')

  mainWindow = new BrowserWindow({
    show: false,
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      nodeIntegrationInWorker: true,
    },
  })
  mainWindowStateKeeper.track(mainWindow)

  mainWindow.removeMenu()
  mainWindow.loadURL(resolveHtmlPath('index.html'))

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app
  .whenReady()
  .then(() => {
    createWindow()
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow()
    })
  })
  .catch((err) =>
    mainWindow!.webContents.send('main-error', JSON.stringify({ error }))
  )
