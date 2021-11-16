import React from 'react'
import './navbar.css'

export function NavBar() {
  return(
    <div className="navBar">
      <button className="btn.Home"><h1 className="neonTextOn">Home</h1></button>
      <button className="btn.Play"><h1 className="neonTextOff">Play</h1></button>
        <div className="prof-search">
          <input  type="text" className="searchBar" placeholder="Search" />
          <img src="/Beluga.jpeg" alt="" onClick={() => console.log("Clicked !")}></img>
        </div>
    </div>
  )
}