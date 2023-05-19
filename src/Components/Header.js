import React from 'react'
import MenuButton from './MenuButton'
import { useTheme } from '../ThemeContext'
import logo from '../Assets/Pictures/turd.png'

export default function Header( { user, openMenu } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(100, 115, 130)' : 'rgb(235, 235, 235)',
    color: darkTheme ? '#eee' : '#111',
  }

  return (
    <header 
      style={styles}
      className='w-full h-auto flex items-center justify-between'
    >
      {
        user 
        ? 
        <div className='flex pl-2'>
          <img src={logo} alt="logo" className='h-8 -rotate-12 mr-1 mt-3'/>
          <h1 className='font-pen text-6xl'> Turdle </h1>
        </div>
        
        : 
        <div></div>
      }
      <MenuButton 
        openMenu={openMenu} 
      />
    </header>
  )
}
