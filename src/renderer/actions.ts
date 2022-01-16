export const ActionTypes = {
  SET_IS_WRITING: 'SET_IS_WRITING',
  SET_STEP: 'SET_STEP',
  SET_PAGE: 'SET_PAGE',
  SET_SCREENSHOT_URL: 'SET_SCREENSHOT_URL',
}

const Actions = {
  setIsWriting(payload) {
    return {
      type: ActionTypes.SET_IS_WRITING,
      payload,
    }
  },
  setStep(payload) {
    return {
      type: ActionTypes.SET_STEP,
      payload,
    }
  },
  setPage(payload) {
    return {
      type: ActionTypes.SET_PAGE,
      payload,
    }
  },
  setScreenshotURL(payload) {
    return {
      type: ActionTypes.SET_SCREENSHOT_URL,
      payload,
    }
  },
}

export default Actions
