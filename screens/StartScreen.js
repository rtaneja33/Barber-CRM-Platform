import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import ButtonSpecial from '../components/ButtonSpecial'
import Paragraph from '../components/Paragraph'
import HeaderSpecial from '../components/HeaderSpecial'
import { argonTheme } from '../constants'
export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      {/* <HeaderSpecial>I am a...</HeaderSpecial> */}
      {/* <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph> */}
      <ButtonSpecial
        mode="contained"
        onPress={() => navigation.navigate('SignUp')}
      >
        Barbershop/Salon Login
      </ButtonSpecial>
      <ButtonSpecial
        mode="outlined"
        style={{borderColor: argonTheme.COLORS.BARBERBLUE }}
        onPress={() => navigation.navigate('SignUp')}
      >
        Customer Login
      </ButtonSpecial>
    </Background>
  )
}
