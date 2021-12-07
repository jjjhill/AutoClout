import { createContext, useReducer } from 'react'
import { ActionTypes } from './actions'

const initialState = {
  isWriting: false,
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
      default:
        throw new Error(`Unhandled action type: ${type}`)
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
