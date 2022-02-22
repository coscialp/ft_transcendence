import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { gameSocket, ip } from '../../App';
import { isLogged } from '../../utils/isLogged';
import { Bell, Cog, UserCircle, Logout} from 'heroicons-react';
import './navbar.css'
import { notifSocket } from '../../App';

export function NavBar(props: any) {
  let history = useHistory();
  const [cookies, setCookie] = useCookies();
  const [search, setSearch] = useState("");
  const [searchingPop, setSearchingPop] = useState(false);
  const [searchedUsers, setSearchedUsers]: any = useState([]);
  const [me, setMe]: any = useState({});
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => {if (mount){ setMe(res.me?.data) }});
    }
    return (() => { mount = false; });
  }, [cookies])

  const [avatar, setAvatar] = useState('/img/beluga.jpeg');

  useEffect(() => {
		let mount = true;
		if (mount && gameSocket && history) {
			gameSocket.on('accept_duel', (user: any) => {
				localStorage.setItem('playerID', user);
        localStorage.setItem('gameMOD', "false");
				return history.push('/game');
			})
		}
		return (() => { mount = false; });
	}, [history]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      notifSocket?.on('disconnect' , function(){
      notifSocket.emit('user disconnect');
    });
    }
    return (() => { mount = false; });
  }, [cookies])

  useEffect(() => {
		let mount = true;
		if (mount) {
      notifSocket.on('updateProfileImg', (path: string) => {
        setAvatar(path);
      });
    }
		return (() => { mount = false; });
	}, []);

  useEffect(() => {
    let mount = true;
    if (mount) {
      notifSocket?.on('newNotification' , () => {
          setCounter(prev => prev + 1);
    });
    }
    return (() => { mount = false; });
  }, [cookies, me])
  
  function NewNotification() {
    return (
      <div className="counter">{counter / 2}</div>
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
      <button className="navBtn" onClick={() => { return history.push("/home") }} ><h1 className={props.page === "home" ? "neonTextOn" : "neonTextOff"}>Home</h1></button>
      <button className="navBtn" onClick={() => { return history.push("/play") }} ><h1 className={props.page === "play" ? "neonTextOn" : "neonTextOff"}>Play</h1></button>
      <div className="prof-search">
        {counter ? <NewNotification /> : null}
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