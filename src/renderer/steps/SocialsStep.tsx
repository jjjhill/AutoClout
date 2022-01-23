import styled from 'styled-components'
import { store } from 'renderer/store'
import { useContext, useEffect, useState } from 'react'
import { colors, Page, UserStep } from 'renderer/constants'
import CircularProgress from '@mui/material/CircularProgress'
import usePrevious from 'renderer/hooks/usePrevious'

const Container = styled.div`
  background: ${colors.darkGray};
  margin: 30px 20px 0;
  border-radius: 16px;
  color: white;
  padding: 16px 24px;
`

const UploadStep = () => {
  const {
    dispatch,
    state: { isWriting, outputFilePath },
  } = useContext(store)
  const [isDownloading, setIsDownloading] = useState(false)
  const [writeComplete, setWriteComplete] = useState(false)
  console.log({ isWriting, outputFilePath })

  const prevIsWriting = usePrevious(isWriting)
  useEffect(() => {
    if (prevIsWriting && !isWriting) {
      setWriteComplete(true)
    }
  }, [isWriting])

  return (
    <Container>
      {isWriting && (
        <div>
          <CircularProgress />
          Video being generated...
        </div>
      )}
      {writeComplete && (
        <video width="360" height="640" controls>
          <source src={`file://${outputFilePath}`} type="video/mp4" />
        </video>
      )}
    </Container>
  )
}

export default UploadStep
