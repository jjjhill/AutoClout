import styled from 'styled-components'
import { colors, Page } from 'renderer/constants'
import { useContext } from 'react'
import { store } from 'renderer/store'

const Container = styled.div`
  background: ${colors.darkGray};
  width: 50px;
  border-radius: 8px;
`

const NavigationItem = styled.div`
  height: 20px;
  width: 20px;
`

const Home = () => {
  const {
    state: { page },
  } = useContext(store)

  return (
    <Container>
      <NavigationItem></NavigationItem>
    </Container>
  )
}

export default Home
