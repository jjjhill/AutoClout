import styled from 'styled-components'
import { store } from 'renderer/store'
import { useContext } from 'react'
import { colors, UserStep } from 'renderer/constants'
import Navigation from 'renderer/components/Navigation'
import UploadStep from 'renderer/steps/UploadStep'
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

const Layout = styled.div`
  flex: 1;
  background: ${colors.mediumGray};
  display: flex;
  padding: 20px;
  min-height: 0;
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

const Home = () => {
  const {
    state: { isWriting, page, step },
  } = useContext(store)

  const steps = ['Step 1', 'Step 2', 'Step 3']
  console.log({ isWriting, page, step })

  return (
    <Layout>
      <Navigation />
      <Content>
        <StepperContainer>
          <Stepper
            alternativeLabel
            activeStep={Number(step)}
            connector={<ColorlibConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperContainer>
        {step === UserStep.UPLOAD && <UploadStep />}
        {step === UserStep.WEBCAM_SELECT && <WebcamSelectStep />}
      </Content>
    </Layout>
  )
}

export default Home
