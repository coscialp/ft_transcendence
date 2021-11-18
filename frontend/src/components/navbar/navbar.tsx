import axios from 'axios';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router'
import './navbar.css'

export function NavBar(props: any) {
  
  let history = useHistory();
  const [cookies] = useCookies();
  const [profilePicture, setProfilePicture] = useState("");
  const [menu, setMenu] = useState("hide");
  const [search, setSearch] = useState("");

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

  function handleInputSearch(e: any) {
    setSearch(e.target.value)
    e.preventDefault()
  }

  function handleSearch(e: any) {
    console.log(search)
    e.preventDefault()
  }

  function handleProfile() {
    setMenu(menu === "hide" ? "visible" : "hide");
    console.log(menu);
    
    return (
      <div className="dropdownProfile">
        Test
      </div>
    )
  }

  function loadProfilePicture() {
  
  axios.request({
      url: '/user/me/avatar',
      method: 'get',
      baseURL: 'http://localhost:5000',
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => { setProfilePicture(response.data.avatar) })
    return profilePicture;
  }
//<img src={ loadProfilePicture() } alt="" className="navProfile" onClick={ handleProfile }></img>
//<summary></summary>
  return(
    <div className="navBar">
      <button className="navBtn" onClick={ handleClickHome } ><h1 className={ props.page==="Home" ? "neonTextOn" : "neonTextOff"}>Home</h1></button>
      <button className="navBtn" onClick={ handleClickPlay } ><h1 className={ props.page==="Play" ? "neonTextOn" : "neonTextOff"}>Play</h1></button>
        <div className="prof-search">
          <form onSubmit={ handleSearch } >
            <input type="text" className="searchBar" placeholder="Search" value={ search } onChange={ handleInputSearch } />
          </form>
          <details>
            <summary style={{backgroundImage: `url(${ loadProfilePicture() })`}} ></summary>
            <nav className="menu">
              <a href="#link">Profile</a>
              <a href="#link">Settings</a>
              <a href="#link">Lougout</a>
            </nav>
          </details>
        </div>
    </div>
  )
}