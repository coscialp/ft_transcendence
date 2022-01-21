import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import './home.css'

const ip = window.location.hostname;

export function Friendlist() {
  const [cookies] = useCookies();
  const [friends, setFriends]: any = useState([]);

  function FriendRequest() {
    axios.request({
      url: '/user/me/friends',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => {
        setFriends(response.data.friends)
    })
  }


  useEffect(() => {
    let mounted = true;

    if (mounted) { FriendRequest() }
    
    const interval = setInterval(() => {
      let mounted = true;

      if (mounted) { FriendRequest() }

      return () => { mounted = false }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [cookies])

  function handleDeleteFriends(friendToDelete: any) {
    console.log(friendToDelete)
    axios.request({
      url: '/user/friends/remove',
      method: 'delete',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      },
      data: {
        'idToDelete': friendToDelete.username
      }
    }).then(response => FriendRequest())
  }

  function handleBlacklist(friendToDelete: any) {
    console.log(friendToDelete)
    axios.request({
      url: '/user/blacklist/add',
      method: 'patch',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      },
      data: {
        'newBlackListId': friendToDelete.username
      }
    }).then(response => FriendRequest())
  }


  return (
    <div className="FriendElement" >
      <p className="FriendTitle" >Friend List</p>
      <div className="allFriendList">{friends.map((friend: any) => (
        <details key={friend.id}>
          <summary className="FriendList">{friend.username}</summary>
          <nav className="menuFriendList">
            <button className="friendBtn"  ><span /><span /><span /><span />Send message</button>
            <button className="friendBtn"  ><span /><span /><span /><span />Invite game</button>
            <button className="friendBtn"  ><span /><span /><span /><span />Chat</button>
            <button className="friendBtnOut friendBorder" onClick={() => {handleDeleteFriends(friend)}}><span /><span /><span /><span />Delete friend</button>
            <button className="friendBtnOut"  onClick={() => {handleDeleteFriends(friend); handleBlacklist(friend)}}><span /><span /><span /><span />Blacklist</button>
          </nav>
        </details>
      ))}
      </div>
    </div>
  )
}
