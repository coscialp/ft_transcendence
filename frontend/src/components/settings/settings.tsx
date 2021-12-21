import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { NavBar } from "../navbar/navbar";
import './settings.css'

export function Settings() {
	const [cookies] = useCookies();
	const [unauthorized, setUnauthorized] = useState(false);

	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setUnauthorized(res.unauthorized) });
		}
		return (() => { mount = false; });
	}, [cookies])

	if (!cookies.access_token || unauthorized) {
		return (<Redirect to="/" />);
	}

	const user = JSON.parse(sessionStorage.getItem("me") || '{}');

	console.log(user);
	return (
		<div>
			<NavBar page="Settings" />
			<div className="SettingsElement">
				<div className="SettingsMain">
					Activate 2FA
					Change NickName
				</div>
			</div>
		</div>
	);
}