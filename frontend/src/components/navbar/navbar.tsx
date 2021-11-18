import React from 'react'
import { useHistory } from 'react-router'
import './navbar.css'

export function NavBar(props: any) {
  
  let history = useHistory();

  function handleClickPlay() {
    return (
      history.push("/play")
    )
  }
  
  function handleClickHome() {
    return (
      history.push("/home")
    )
  }

  return(
    <div className="navBar">
      <button className="navBtn" onClick={ handleClickHome } ><h1 className={ props.page==="Home" ? "neonTextOn" : "neonTextOff"}>Home</h1></button>
      <button className="navBtn" onClick={ handleClickPlay } ><h1 className={ props.page==="Play" ? "neonTextOn" : "neonTextOff"}>Play</h1></button>
        <div className="prof-search">
          <input type="text" className="searchBar" placeholder="Search" />
          <img src="/Beluga.jpeg" alt="" className="navProfile" onClick={() => console.log("Clicked !")}></img>
        </div>
    </div>
  )
}