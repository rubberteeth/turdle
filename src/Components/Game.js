import React from 'react'
import MenuButton from './MenuButton'
import { useTheme } from '../ThemeContext'

export default function Game( { openMenu, closeMenu } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(114, 43, 0)' : 'rgb(255, 251, 235)',
    color: darkTheme ? '#eee' : '#111',
  }

  return (
    <>
      <MenuButton openMenu={openMenu}/>
      <div
        onClick={closeMenu}
        style={styles}
        className='game w-screen min-h-screen flex items-center justify-center'
      >
        Insert Game Here
      </div>
    </>
    
  )
}
