import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

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

  return (
    <div className="FriendElement" >
      <p className="FriendTitle" >Friend List</p>
      {friends.map((friends: any) => (
        <div className="FriendList" key={friends.id} >{friends.username}</div>
      ))}
    </div>
  )
}