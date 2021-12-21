import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { NavBar } from "../navbar/navbar";
import './settings.css'


const ip = window.location.hostname;

export function Settings() {

	const [newNick, setNewNick] = useState("");
	const [cookies] = useCookies();

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

		return (
				<div>
					<NavBar page="Settings" />
					<div className="SettingsElement">
						<div className="SettingsMain">
                            <div className="change Nickname">
								Change your Nickname !
								<div className="change Nick input" >
										<input type="text" className="changeNickPlaceholder" placeholder="New Nickname..." value={newNick} onChange={(e) => {setNewNick(e.target.value)}} />
										<button className="changeNickbtn" onClick={handleNewNickname} >Change !</button>
								</div>
							</div>
							Activate 2FA
						</div>
					</div>
				</div>
		);
}