import axios from 'axios';
import React, { useState} from 'react'
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router'
import './navbar.css'

const ip = window.location.hostname;
const me = JSON.parse(sessionStorage.getItem("me") || '{}');

export function NavBar(props: any) {
  
  let history = useHistory();
  const [cookies, setCookie] = useCookies();
  const [search, setSearch] = useState("");
  const [searchingPop, setSearchingPop] = useState(false);
  const [searchedUsers, setSearchedUsers]: any = useState([]);
  const [notification, setNotification] = useState(true);
  
  function NewNotification() {
    return (
      <div className="Notification"></div>
    )
  }
  
  function handleInputSearch(e: any) {
    setSearch(e.target.value)
    if (e.target.value) {
      axios.request({
        url: `/user`,
        method: 'get',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        },
        params: {
          "search": e.target.value,
        }
      }).then((response: any) => {
        setSearchedUsers(response.data);
      })
       setSearchingPop(true); 
      }
    else { setSearchingPop(false); }
  }

  function handleSearch(e: any) {

    if (search) {
      axios.request({
        url: `/user`,
        method: 'get',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        },
        params: {
          "search": search,
        }
      }).then((response: any) => {
        setSearchedUsers(response.data);
      })
    }
    e.preventDefault()
  }

  function SearchingList() {
    return (
      <div className="searching list" >
        {searchedUsers.map((users: any) => (
          <div className="list" key={users.username} onClick={(e) => {history.push(`/${users.username}/profile`)}} >
            <div className="Nick list" > {users.nickName}
            <div className="User list"> {users.username} </div>
          </div>
          </div>
        ))}
      </div>
    )
  }

  function loadProfilePicture() {

    axios.request({
      url: '/user/me/avatar',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => { localStorage.setItem("ProfilePicture", response.data.avatar) })
  }

  if (localStorage.getItem("ProfilePicture") === null) {
    loadProfilePicture();
  }

  function logout(): void {
    axios.request({
      url: '/auth/logout',
      method: 'patch',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    });
    setCookie("access_token", "");
    history.push("/");
  }

  return (
    <div className="navBar">
      <div className="gradientRight" ></div>
      <button className="navBtn" onClick={() => { return history.push("/home") }} ><h1 className={props.page === "Home" ? "neonTextOn" : "neonTextOff"}>Home</h1></button>
      <button className="navBtn" onClick={() => { return history.push("/play") }} ><h1 className={props.page === "Play" ? "neonTextOn" : "neonTextOff"}>Play</h1></button>
      <div className="prof-search">
        { notification ? <NewNotification /> : null }
        <form onSubmit={handleSearch} >
          <input type="text" className="searchBar" placeholder="Search" value={search} onChange={handleInputSearch} />
        </form>
        <details>
          <summary style={{ backgroundImage: `url(${localStorage.getItem("ProfilePicture")})` }} ></summary>
          <nav className="menu">
            <button className="menuBtn" onClick={() => { return history.push(`/${me.data.username}/profile`) }} >Profile</button>
            <button className="menuBtn" onClick={() => { return history.push(`/alerts`) }} >Alerts</button>
            <button className="menuBtn" onClick={() => { return history.push("/settings") }} >Settings</button>
            <button className="menuBtn" onClick={logout} >Logout</button>
          </nav>
        </details>
      </div>
      { searchingPop ? <SearchingList /> : null }
    </div>
  )
}