export const ActionTypes = {
  SET_IS_WRITING: 'SET_IS_WRITING',
  SET_STEP: 'SET_STEP',
  SET_PAGE: 'SET_PAGE',
  SET_SCREENSHOT_URL: 'SET_SCREENSHOT_URL',
  SET_DOWNLOAD_FILE_PATH: 'SET_DOWNLOAD_FILE_PATH',
  SET_VIDEO_LENGTH: 'SET_VIDEO_LENGTH',
  SET_OUTPUT_FILE_PATH: 'SET_OUTPUT_FILE_PATH',
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
  setDownloadFilePath(payload) {
    return {
      type: ActionTypes.SET_DOWNLOAD_FILE_PATH,
      payload,
    }
  },
  setVideoLength(payload) {
    return {
      type: ActionTypes.SET_VIDEO_LENGTH,
      payload,
    }
  },
  setOutputFilePath(payload) {
    return {
      type: ActionTypes.SET_OUTPUT_FILE_PATH,
      payload,
    }
  },
}

export default Actions
