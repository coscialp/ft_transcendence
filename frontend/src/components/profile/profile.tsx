import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Redirect, useHistory, useLocation } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { NavBar } from "../navbar/navbar";
import { Achivements } from "./achivements";
import { History } from "./history";
import { Overall } from "./overall";
import { ip } from '../../App';
import './profile.css'
import { User } from "../../utils/user.type";
import { io, Socket } from "socket.io-client";

export function Profile() {
	const [unauthorized, setUnauthorized] = useState(false);
	const [cookies] = useCookies();
	const [me, setMe]: any = useState({});
	const userProfile = window.location.pathname.split('/')[1];
	const [user, setUser]: any = useState({});
	const [blackList, setBlackList] = useState<User[]>([]);
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		let mount = true;
		if (mount) {
		  isLogged(cookies).then((res) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });
		  setSocket(io(`ws://${ip}:5003`, { transports: ['websocket', 'polling']}));
		}
		return (() => { mount = false; });
	  }, [cookies])
	
	
	  useEffect(() => {
		let mount = true;
		if (mount) {
		  socket?.on('disconnect' , function(){
		  socket.emit('user disconnect');
		});
		}
		return (() => { mount = false; });
	  }, [cookies, socket])



	useEffect(() => {
		axios.request({
			url: `/user/${userProfile}`,
			method: 'get',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		}).then((response: any) => {
			
			setUser(response.data);
		})
	}, [userProfile, cookies]);

	useEffect(() => {
		let mount = true;
	
		axios.request({
			url: `/user/${userProfile}/blacklist`,
			method: 'get',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
		}).then((response: any) => {
			
			if (mount) { setBlackList(response.data.blackList) }
		})
		return (() => { mount = false; });
	}, [cookies, userProfile])

	if (!cookies.access_token || unauthorized) {
		return (<Redirect to="/" />);
	}
 
	return (
		<div>
			<div className="ProfileElement">
					{blackList.find((user) => user.username === me.username) ? <div className="Blocked ProfileMain" ><img className="ProfileImage" style={{ backgroundImage: `url(${user.profileImage})` }} alt="" /> {user.username} has blocked you !</div> :
					<div className="ProfileMain">
						<Overall me={me} user={user} socket={socket}/>
						<History me={me} user={user} />
						<Achivements user={user}/>
					</div>
					}
			</div>
		</div>
	);
}