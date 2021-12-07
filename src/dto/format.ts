export interface FormatVideoRequest {
  fileName: string
  username: string
  facecamCoords: [number, number, number, number]
  videoLength: number
  outputFilePath: string
}

export interface DownloadVideoRequest {
  clipLink: string
}
