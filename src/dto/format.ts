export interface FormatVideoRequest {
  fileName: string
  username: string
  facecamCoords: [number, number, number, number]
}

export interface DownloadVideoRequest {
  clipLink: string
}
