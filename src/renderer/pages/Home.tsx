import styled from 'styled-components'
import { store } from 'renderer/store'
import { useContext, useState, useMemo } from 'react'
import { colors, UserStep } from 'renderer/constants'
import Navigation from 'renderer/components/Navigation'
import UploadStep from 'renderer/steps/ImportStep'
import Stepper from '@mui/material/Stepper'
import StepLabelSource from '@mui/material/StepLabel'
import Step from '@mui/material/Step'
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector'
import UploadIcon from '@mui/icons-material/FileUpload'
import EditIcon from '@mui/icons-material/ModeEditOutline'
import SettingsIcon from '@mui/icons-material/SettingsSuggest'
import WebcamSelectStep from 'renderer/steps/WebcamSelectStep'
import SocialsStep from 'renderer/steps/SocialsStep'
import { Rectangle } from 'renderer/components/FacecamSelection'
import StepButton from '@mui/material/StepButton'
import Actions from 'renderer/Actions'

const Layout = styled.div`
  flex: 1;
  background: ${colors.mediumGray};
  display: flex;
  padding: 20px;
  min-height: 0;
  overflow: auto;
`

const Content = styled.div`
  background: ${colors.mediumGray};
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const StepperContainer = styled.div`
  width: 100%;
`

const StepLabel = styled(StepLabelSource)`
  && .MuiStepLabel-label {
    color: white;
    margin-top: 5px;
    font-size: 16px;
  }
`

const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: colors.orange,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: colors.orange,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: colors.lightGray,
    borderRadius: 1,
  },
}))

const ColorlibStepIconRoot = styled('div')(({ ownerState }) => ({
  backgroundColor: colors.lightGray,
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: colors.orange,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: colors.orange,
  }),
}))

function ColorlibStepIcon(props) {
  const { active, completed, className } = props

  const icons = {
    1: <UploadIcon />,
    2: <EditIcon />,
    3: <SettingsIcon />,
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

export interface CropData {
  cropURL: string
  position: Rectangle
}

const Home = () => {
  const realCamHeight = 500
  const previewWidth = 325
  const previewHeight = (1920 / 1080) * previewWidth

  const defaultSliderValue = 50
  const [sliderValue, setSliderValue] = useState(defaultSliderValue)
  const [sliderChanged, setSliderChanged] = useState(false)
  const zoomRatio = useMemo(() => sliderValue / 100, [sliderValue])
  const [facecamCoords, setFacecamCoords] = useState<Rectangle>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })
  const [cropData, setCropData] = useState<CropData | undefined>()
  const [camEnabled, setCamEnabled] = useState(true)

  const {
    dispatch,
    state: { step: userStep, furthestStep },
  } = useContext(store)

  const steps = [
    { step: UserStep.IMPORT_CLIP, label: 'Step 1' },
    { step: UserStep.WEBCAM_SELECT, label: 'Step 2' },
    { step: UserStep.SOCIALS, label: 'Step 3' },
  ]

  return (
    <Layout>
      <Navigation />
      <Content>
        <StepperContainer>
          <Stepper
            alternativeLabel
            activeStep={Number(userStep)}
            connector={<ColorlibConnector />}
            nonLinear
          >
            {steps.map(({ label, step }) => (
              <Step
                key={label}
                disabled={userStep === UserStep.SOCIALS || step > furthestStep}
              >
                <StepButton onClick={() => dispatch(Actions.setStep(step))}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </StepperContainer>
        {userStep === UserStep.IMPORT_CLIP && <UploadStep />}
        {userStep === UserStep.WEBCAM_SELECT && (
          <WebcamSelectStep
            realCamHeight={realCamHeight}
            previewWidth={previewWidth}
            previewHeight={previewHeight}
            setSliderValue={setSliderValue}
            sliderChanged={sliderChanged}
            setSliderChanged={setSliderChanged}
            zoomRatio={zoomRatio}
            facecamCoords={facecamCoords}
            setFacecamCoords={setFacecamCoords}
            camEnabled={camEnabled}
            setCamEnabled={setCamEnabled}
            defaultSliderValue={defaultSliderValue}
            setCropData={setCropData}
          />
        )}
        {userStep === UserStep.SOCIALS && (
          <SocialsStep
            facecamCoords={facecamCoords}
            previewHeight={previewHeight}
            previewWidth={previewWidth}
            realCamHeight={realCamHeight}
            zoomRatio={zoomRatio}
            camEnabled={camEnabled}
            cropURL={cropData?.cropURL}
          />
        )}
      </Content>
    </Layout>
  )
}

export default Home
