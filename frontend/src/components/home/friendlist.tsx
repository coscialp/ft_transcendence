import axios from "axios"
import { useCookies } from "react-cookie";

const ip = window.location.hostname;

export function Friendlist() {
    const [cookies] = useCookies();

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
        </div>
    )
}