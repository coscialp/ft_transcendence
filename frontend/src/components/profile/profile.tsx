import { NavBar } from "../navbar/navbar";
import { Achivements } from "./achivements";
import { History } from "./history";
import { Overall } from "./overall";
import './profile.css'

export function Profile() {

	const user = JSON.parse(localStorage.getItem("me") || '{}');

	console.log(user);
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