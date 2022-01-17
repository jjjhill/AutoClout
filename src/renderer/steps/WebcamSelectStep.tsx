import styled, { css } from 'styled-components'
import { useContext, useState } from 'react'
import { colors } from 'renderer/constants'
import FacecamSelection, {
  Rectangle,
} from 'renderer/components/FacecamSelection'
import { store } from 'renderer/store'
import Preview from 'renderer/components/Preview'
import Button from '@mui/material/Button'

interface ContainerProps {}

const Container = styled.div`
  background: ${colors.darkGray};
  margin: 30px 20px 0;
  border-radius: 16px;
  color: white;
  padding: 16px 24px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

const GridContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-gap: 40px;
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
    display: flex;
    flex-direction: column;
  }
`

const Options = styled.div`
  display: flex;
  grid-area: options;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`

const Positioning = styled.div``

const WebcamSelectStep = () => {
  const [clipLink, setClipLink] = useState('')
  const [facecamCoords, setFacecamCoords] = useState<Rectangle>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  const {
    state: { screenshotURL },
  } = useContext(store)

  return (
    <Container>
      <GridContainer>
        <div id="webcam-selection">
          <h3>Select Webcam</h3>
          <FacecamSelection
            // imgSrc={screenshotURL}
            imgSrc={
              'https://www.kapwing.com/resources/content/images/2020/02/image---2020-02-19T092836.082.jpg'
            }
            handleFacecamSelected={setFacecamCoords}
          />
        </div>
        <Options>
          {/* <BorderSelect /> */}
          <Positioning />
        </Options>
        <div id="preview">
          <h3>Preview</h3>
          <Preview webcamCoords={facecamCoords} />
        </div>
      </GridContainer>
      <Footer>
        <Button variant="contained">Next</Button>
      </Footer>
    </Container>
  )
}

export default WebcamSelectStep