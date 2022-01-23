import { Context, createContext, useReducer } from 'react'
import { ActionTypes } from './actions'
import { Page, UserStep } from './constants'

interface State {
  isWriting: boolean
  page: Page
  step: UserStep
  screenshotURL: string
  downloadFilePath: string
  outputFilePath: string
  videoLength: number
  imageDimensions: { width: number; height: number }
}

const initialState: State = {
  isWriting: false,
  page: Page.HOME,
  step: UserStep.IMPORT_CLIP,
  // step: UserStep.WEBCAM_SELECT,
  screenshotURL: '',
  // 'C:\\Users\\Josh\\AutoClout\\images\\AcceptableHyperPicklesBabyRage-eAkifivv119ahBkV.png',
  downloadFilePath: '',
  outputFilePath: '',
  videoLength: 0,
  imageDimensions: { width: 0, height: 0 },
}

const store = createContext<State>(initialState)
const { Provider } = store

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action

    switch (type) {
      case ActionTypes.SET_IS_WRITING:
        return {
          ...state,
          isWriting: payload,
        }
      case ActionTypes.SET_STEP:
        return {
          ...state,
          step: payload,
        }
      case ActionTypes.SET_PAGE:
        return {
          ...state,
          page: payload,
        }
      case ActionTypes.SET_SCREENSHOT_URL:
        return {
          ...state,
          screenshotURL: payload,
        }
      case ActionTypes.SET_DOWNLOAD_FILE_PATH:
        return {
          ...state,
          downloadFilePath: payload,
        }
      case ActionTypes.SET_VIDEO_LENGTH:
        return {
          ...state,
          videoLength: payload,
        }
      case ActionTypes.SET_OUTPUT_FILE_PATH:
        return {
          ...state,
          outputFilePath: payload,
        }
      case ActionTypes.SET_IMAGE_DIMENSIONS:
        return {
          ...state,
          imageDimensions: payload,
        }
      default:
        throw new Error(`Unhandled action type: ${type}`)
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
