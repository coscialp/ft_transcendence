import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { NavBar } from "../navbar/navbar";
import './settings.css'


const ip = window.location.hostname;

export function Settings() {
	const [cookies] = useCookies();
	const [unauthorized, setUnauthorized] = useState(false);
	const [me, setMe]: any = useState({});
	const [newNick, setNewNick] = useState("");
	const [newEmail, setNewEmail] = useState("");

	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
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

	return (
		<div>
			<NavBar page="Settings" />
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
					<div className="2FA">
						{me.twoFactorAuth ?
						<>Disable the 2FA<input className="ToggleSwitchON" type="checkbox" id="switch" onClick={handle2FA} /><label className="ToggleSLabelON" htmlFor="switch"></label></>
						:
						<>Enable the 2FA<input className="ToggleSwitchOFF" type="checkbox" id="switch" onClick={handle2FA} /><label className="ToggleSLabelOFF" htmlFor="switch"></label></>
						}
					</div>
				</div>
			</div>
		</div>
	);
}