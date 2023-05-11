import React from 'react'
import MenuButton from './MenuButton'

export default function Game( {openMenu } ) {
  return (
    <div>
      <MenuButton openMenu={openMenu}/>
      Insert Game Here
    </div>
  )
}
