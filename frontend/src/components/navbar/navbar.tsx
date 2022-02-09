import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { ip } from '../../App';
import { isLogged } from '../../utils/isLogged';
import { Bell, Cog, UserCircle, Logout} from 'heroicons-react';
import './navbar.css'

export function NavBar(props: any) {

  let history = useHistory();
  const [cookies, setCookie] = useCookies();
  const [search, setSearch] = useState("");
  const [searchingPop, setSearchingPop] = useState(false);
  const [searchedUsers, setSearchedUsers]: any = useState([]);
  const [notification, setNotification] = useState(false);
  const [me, setMe]: any = useState({});

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => { setMe(res.me?.data) });
    }
    return (() => { mount = false; });
  }, [cookies])

  const [avatar, setAvatar] = useState(localStorage.getItem('ProfilePicture') ? localStorage.getItem('ProfilePicture') : '/img/beluga.jpeg');

  useEffect(() => {
    const interval = setInterval(() => {
      let mount = true;
      if (me?.username !== undefined) {
        axios.request({
          url: `/user/${me.username}/friends/request`,
          method: 'get',
          baseURL: `http://${ip}:5000`,
          headers: {
            "Authorization": `Bearer ${cookies.access_token}`,
          },
        }).then((response: any) => {
          if (mount) {
            if (response)
            if (response.data.from.length > 0) {
              setNotification(true);
            }
            else {
              setNotification(false);
            }
          }
        })
      }
      return () => { mount = false }
    }, 5000);
    return () => clearInterval(interval);
  }, [cookies, notification, me]);


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
          <div className="list" key={users.username} onClick={(e) => { history.push(`/${users.username}/profile`); setSearch("") }} >
            <div className="Nick list" > {users.nickName}
              <div className="User list"> {users.username} </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    
    let mounted: boolean = true;
    axios.request({
      url: '/user/me/avatar',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => {
      if (mounted) {
        setAvatar(response.data.avatar);
      }
    });
    return (() => { mounted = false })
  }, [cookies, avatar]);


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
        {notification ? <NewNotification /> : null}
        <form onSubmit={handleSearch} >
          <input type="text" className="searchBar" placeholder="Search" value={search} onChange={handleInputSearch} />
        </form>
        <details>
          <summary className="summaryProfile" style={{ backgroundImage: `url(${avatar})` }} ></summary>
          <nav className="menu">
            <button className="menuBtn" onClick={() => { return history.push(`/${me.username}/profile`) }} ><span /><span /><span /><span /><UserCircle /></button>
            <button className="menuBtn" onClick={() => { return history.push(`/alerts`) }} ><span /><span /><span /><span /><Bell /></button>
            <button className="menuBtn" onClick={() => { return history.push("/settings") }} ><span /><span /><span /><span /><Cog /></button>
            <button className="menuBtnOut" onClick={logout} ><span /><span /><span /><span /><Logout /></button>
          </nav>
        </details>
      </div>
      {searchingPop ? <SearchingList /> : null}
    </div>
  )
}