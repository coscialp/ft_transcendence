import axios from 'axios';
import React from 'react'
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router'
import './navbar.css'

export function NavBar(props: any) {
  
  let history = useHistory();
  var search: string | number | readonly string[] | undefined;
  const [cookies] = useCookies();

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
    search = e.target.value;
  }

  function handleSearch() {
    console.log(search)
  }

  function handleProfile() {
    console.log("Profile menu !")
  }

  function loadProfilePicture() {
  
  axios.request({
      url: '/user/me/avatar',
      method: 'get',
      baseURL: 'http://localhost:5000',
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => { response =  response.data; })
    return '/Beluga.jpeg';
  }

  return(
    <div className="navBar">
      <button className="navBtn" onClick={ handleClickHome } ><h1 className={ props.page==="Home" ? "neonTextOn" : "neonTextOff"}>Home</h1></button>
      <button className="navBtn" onClick={ handleClickPlay } ><h1 className={ props.page==="Play" ? "neonTextOn" : "neonTextOff"}>Play</h1></button>
        <div className="prof-search">
          <input type="text" className="searchBar" placeholder="Search" value={ search } onChange={ handleInputSearch } onSubmit={ handleSearch } />
          <img src={ loadProfilePicture() } alt="" className="navProfile" onClick={ handleProfile }></img>
        </div>
    </div>
  )
}