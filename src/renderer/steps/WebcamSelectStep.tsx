import styled from 'styled-components'
import { useContext, useRef, useState } from 'react'
import { colors } from 'renderer/constants'
import FacecamSelection from 'renderer/components/FacecamSelection'
import { store } from 'renderer/store'
import Preview from 'renderer/components/Preview'

const Container = styled.div`
  background: ${colors.darkGray};
  margin: 30px 20px 0;
  border-radius: 16px;
  color: white;
  padding: 16px 24px;
  flex: 1;
  min-height: 0;

  display: grid;
  grid-gap: 20px;
  grid-template-areas:
    'select select preview'
    'select select preview'
    'options options preview';

  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);

  #webcam-selection {
    grid-area: select;
  }
  #preview {
    grid-area: preview;
  }
`

const Options = styled.div`
  display: flex;
  grid-area: options;
`

type RectCoords = [number, number, number, number]

const WebcamSelectStep = () => {
  const [clipLink, setClipLink] = useState('')
  const [facecamCoords, setFacecamCoords] = useState<RectCoords | undefined>()

  const {
    state: { screenshotURL },
  } = useContext(store)

  const camSelectionRef = useRef()

  return (
    <Container>
      <div id="webcam-selection" ref={camSelectionRef}>
        <div>Select Webcam</div>
        <FacecamSelection
          // imgSrc={screenshotURL}
          imgSrc={
            'https://www.kapwing.com/resources/content/images/2020/02/image---2020-02-19T092836.082.jpg'
          }
          handleFacecamSelected={(rect) => {
            setFacecamCoords([
              rect.left,
              rect.top,
              rect.left + rect.width,
              rect.top + rect.height,
            ])
          }}
          camSelectionRef={camSelectionRef}
        />
      </div>
      <Options>
        {/* <BorderSelect />
        <Positioning /> */}
      </Options>
      <div id="preview">
        <div>Preview</div>
        <Preview />
      </div>
    </Container>
  )
}

export default WebcamSelectStep
