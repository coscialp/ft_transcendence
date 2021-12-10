import { NavBar } from "../navbar/navbar";
import { Achivements } from "./achivements";
import { History } from "./history";
import { Overall } from "./overall";
import './profile.css'

export function Profile() {

	const me = JSON.parse(sessionStorage.getItem("me") || '{}');
	const userProfile = window.location.pathname.split('/')[1];

	console.log(userProfile);
		return (
				<div>
					<NavBar page="Profile" />
					<div className="ProfileElement">
						<div className="ProfileMain">
							<Overall />
							<History />
							<Achivements />
						</div>
					</div>
				</div>
		);
}