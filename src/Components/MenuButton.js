import React from 'react'
import hamburgerIcon from '../Assets/Pictures/hamburger-menu.png'


export default function MenuButton( { openMenu } ) {
  return (
    <img 
      src={hamburgerIcon} 
      alt='menu-icon' 
      className='menu-icon absolute h-12 top-1 right-1 cursor-pointer'
      onClick={openMenu}
    />
  )
}
