import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { ip } from "../../App";
import { isLogged } from "../../utils/isLogged";
import './settings.css'
import { notifSocket } from "../../App";



export function Settings() {
	const [cookies] = useCookies();
	const [unauthorized, setUnauthorized] = useState(false);
	const [me, setMe]: any = useState({});
	const [newNick, setNewNick] = useState("");
	const [newEmail, setNewEmail] = useState("");

	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { if (mount) { setMe(res.me?.data); setUnauthorized(res.unauthorized) }});
		}
		return (() => { mount = false; });
	}, [cookies])

	if (!cookies.access_token || unauthorized) {
		return (<Redirect to="/" />);
	}


	function handleNewNickname(e: any) {
		if (newNick !== "") {
			axios.request({
				url: '/user/me/nickname',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				data: {
					"nickname": newNick,
				}
			})
			window.alert("Nickname successfully changed to " + newNick + " !")
			setNewNick("");
			e.preventDefault();
		}
	}

	function handleNewEmail(e: any) {
		if (newEmail !== "") {
			axios.request({
				url: '/user/me/email',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				data: {
					"email": newEmail,
				}
			})
			window.alert("Email successfully changed to " + newEmail + " !")
			setNewEmail("");
			e.preventDefault();
		}
	}

	function handle2FA() {
		
		me.twoFactorAuth ?
			axios.request({
				url: '/user/2FA/deactivate',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			})
			:
			axios.request({
				url: '/user/2FA/activate',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			})
	}

	function handleChangeAvatar(avatar: string) {

		axios.request({
            url: '/user/me/avatar',
            method: 'patch',
            baseURL: `http://${ip}:5000`,
            headers: {
              "Authorization": `Bearer ${cookies.access_token}`,
            },
			
			data: {
				"avatar": avatar,
			}
          })
		  notifSocket?.emit('updateProfileImg', {path: avatar});
	}

	return (
		<div>
			<div className="SettingsElement">
				<div className="SettingsMain">
					<div className="change Nickname">
						Change your Nickname !
						<div className="change Nick input" >
							<input type="text" className="changeNickPlaceholder" placeholder="New Nickname..." value={newNick} onChange={(e) => { setNewNick(e.target.value) }} />
							<button className="changeNickbtn" onClick={handleNewNickname} >Change !</button>
						</div>
					</div>
					<div className="change Nickname">
						Change your Email !
						<div className="change Nick input" >
							<input type="text" className="changeNickPlaceholder" placeholder="New Email..." value={newEmail} onChange={(e) => { setNewEmail(e.target.value) }} />
							<button className="changeNickbtn" onClick={handleNewEmail} >Change !</button>
						</div>
					</div>
					<div className="change Nickname">
						Chose your Avatar !
						<div className="avatar-bank">
							{me?.password === null ? <img src={`https://cdn.intra.42.fr/users/${me.username}.jpg`} alt="" className="avatar-photo" onClick={e => handleChangeAvatar(`https://cdn.intra.42.fr/users/${me.username}.jpg`)} /> : null }
							<img src={"./img/Beluga.jpeg"} alt="" className="avatar-photo" onClick={e => handleChangeAvatar("/img/Beluga.jpeg")} />
							<img src={"./img/Eye.jpg"} alt="" className="avatar-photo" onClick={e => handleChangeAvatar("/img/Eye.jpg")} />
							<img src={"./img/Goat.jpg"} alt="" className="avatar-photo" onClick={e => handleChangeAvatar("/img/Goat.jpg")} />
							<img src={"./img/Mole.jpg"} alt="" className="avatar-photo" onClick={e => handleChangeAvatar("/img/Mole.jpg")} />
							<img src={"./img/monkey.png"} alt="" className="avatar-photo" onClick={e => handleChangeAvatar("/img/monkey.png")} />
							<img src={"./img/MossaBenApolocreed.jpg"} alt="" className="avatar-photo" onClick={e => handleChangeAvatar("/img/MossaBenApolocreed.jpg")} />
						</div>
					</div>
					<div className="change Nickname">
						{me?.twoFactorAuth ?
						<div>
							Disable the 2FA !
							<input className="ToggleSwitchON" type="checkbox" id="switch" onClick={handle2FA} />
							<label className="ToggleSLabelON" htmlFor="switch"></label>
						</div>
						:
						<div>
							Enable the 2FA !
							<input className="ToggleSwitchOFF" type="checkbox" id="switch" onClick={handle2FA} />
							<label className="ToggleSLabelOFF" htmlFor="switch"></label>
						</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}