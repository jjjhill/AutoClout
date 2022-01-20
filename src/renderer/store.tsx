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
}

const initialState: State = {
  isWriting: false,
  page: Page.HOME,
  step: UserStep.UPLOAD,
  // step: UserStep.WEBCAM_SELECT,
  screenshotURL: '',
  // 'C:\\Users\\Josh\\AutoClout\\images\\AcceptableHyperPicklesBabyRage-eAkifivv119ahBkV.png',
  downloadFilePath: '',
  outputFilePath: '',
  videoLength: 0,
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
      default:
        throw new Error(`Unhandled action type: ${type}`)
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
