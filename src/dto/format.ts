export interface FormatVideoRequest {
  fileName: string
  username: string
  facecamCoords: [number, number, number, number]
  videoLength: number
  outputFilePath: string
  realCamHeight: number
  zoomRatio: number
}

export interface DownloadVideoRequest {
  clipLink: string
}
