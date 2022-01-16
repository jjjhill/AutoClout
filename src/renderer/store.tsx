import { createContext, useReducer } from 'react'
import { ActionTypes } from './actions'
import { Page, UserStep } from './constants'

const initialState = {
  isWriting: false,
  page: Page.HOME,
  step: UserStep.WEBCAM_SELECT,
  screenshotURL: '',
}

const store = createContext(initialState)
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
      default:
        throw new Error(`Unhandled action type: ${type}`)
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
