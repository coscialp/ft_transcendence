import axios from "axios"
import { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";

const ip = window.location.hostname;

export function Friendlist() {
    const [cookies] = useCookies();
    const ip = window.location.hostname;
    const [friend, setFriend]: any = useState([]);

    useEffect(() => {
      axios.request({
          url: `/home`,
          method: 'get',
          baseURL: `http://${ip}:5000`,
          headers: {
            "Authorization": `Bearer ${cookies.access_token}`,
          }
          }).then((response: any) => {
            console.log(response);
      })
    }, [setFriend, ip, cookies]);

    axios.request({
        url: '/user/me/friends',
        method: 'get',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        }
        }).then((response: any) => {
          console.log(response)
        })

    return (
        <div className="FriendElement" >
            <p className="FriendTitle" >Friend List</p>
            <p> {friend.firstName} "{friend.nickName}" {friend.lastName} </p>
        </div>
    )
}



/*############################*/
