import { Rectangle } from './components/FacecamSelection'

type RectCoords = [number, number, number, number]

export const coordsToArray: (rect: Rectangle) => RectCoords = (rect) => [
  rect.left,
  rect.top,
  rect.left + rect.width,
  rect.top + rect.height,
]
