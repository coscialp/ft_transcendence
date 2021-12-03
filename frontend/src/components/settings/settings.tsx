import { NavBar } from "../navbar/navbar";
import './settings.css'

export function Settings() {

	const user = JSON.parse(localStorage.getItem("me") || '{}');

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