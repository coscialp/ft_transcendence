import React from 'react'
import  background  from './background.mp4'
import './Background.css'

export function BackGround() {
    return (
        <video autoPlay muted loop width="200%" height="200%" className="fixed  h-150% w-150% top-0 left-0 opacity-70 z-0">
          <source src={background} type="video/mp4" />
        </video>
    )
}