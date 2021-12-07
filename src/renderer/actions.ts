export const ActionTypes = {
  SET_IS_WRITING: 'SET_IS_WRITING',
}

const Actions = {
  setIsWriting(payload) {
    return {
      type: ActionTypes.SET_IS_WRITING,
      payload,
    }
  },
}

export default Actions
