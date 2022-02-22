import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { Achivements } from "./achivements";
import { History } from "./history";
import { Overall } from "./overall";
import { ip } from '../../App';
import './profile.css'
import { User } from "../../utils/user.type";
import { notifSocket } from "../../App";

export function Profile() {
	const [unauthorized, setUnauthorized] = useState(false);
	const [cookies] = useCookies();
	const [me, setMe]: any = useState({});
	const userProfile = window.location.pathname.split('/')[1];
	const [user, setUser]: any = useState({});
	const [blackList, setBlackList] = useState<User[]>([]);

	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { if (mount) { setMe(res.me?.data); setUnauthorized(res.unauthorized) } });
		}
		return (() => { mount = false; });
	}, [cookies])


	useEffect(() => {
		let mount = true;
		if (mount) {
			notifSocket?.on('disconnect', function () {
				notifSocket.emit('user disconnect');
			});
		}
		return (() => { mount = false; });
	}, [cookies])



	useEffect(() => {
		let mount = true;
		if (mount) {
			axios.request({
				url: `/user/${userProfile}`,
				method: 'get',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				}
			}).then((response: any) => {
				if (mount) {
					setUser(response.data);
				}
			})
		}
		return (() => { mount = false; })
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
						<Overall me={me} user={user} socket={notifSocket} />
						<History me={me} user={user} />
						<Achivements user={user} />
					</div>
				}
			</div>
		</div>
	);
}