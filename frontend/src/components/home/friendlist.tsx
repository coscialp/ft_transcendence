import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import './home.css'

const ip = window.location.hostname;

export function Friendlist() {
  const [cookies] = useCookies();
  const [friends, setFriends]: any = useState([]);


  useEffect(() => {
    let mounted = true;
    axios.request({
      url: '/user/me/friends',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => {
      if (mounted) {
        setFriends(response.data.friends)
      }
    })

    return () => { mounted = false }
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
      })
  }

  function handleBlacklist(friendToDelete: any) {
    console.log(friendToDelete)
      axios.request({
        url: '/user/blacklist/remove',
        method: 'delete',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        },
        data: {
          'idToDelete': friendToDelete.username
        }
      })
  }


  return (
    <div className="FriendElement" >
      <p className="FriendTitle" >Friend List</p>
      <div className="allFriendList">{friends.map((friend: any) => (
        <details>
          <summary className="FriendList" key={friend.id}>{friend.username}</summary>
          <table className="menu">
            <button className="menuBtn"  ><span /><span /><span /><span />Send message</button>
            <button className="menuBtn"  ><span /><span /><span /><span />Invite game</button>
            <button className="menuBtnOut" onClick={() => {handleDeleteFriends(friend)}}><span /><span /><span /><span />Delete friend</button>
            <button className="menuBtnOut"  onClick={() => {handleDeleteFriends(friend); handleBlacklist(friend)}}><span /><span /><span /><span />Blacklist</button>
          </table>
        </details>
      ))}
      </div>
    </div>
  )
}
