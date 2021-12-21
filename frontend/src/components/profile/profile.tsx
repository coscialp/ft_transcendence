import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { NavBar } from "../navbar/navbar";
import { Achivements } from "./achivements";
import { History } from "./history";
import { Overall } from "./overall";
import './profile.css'

export function Profile() {
	const [unauthorized, setUnauthorized] = useState(false);
	const [cookies] = useCookies();
	const [me, setMe]: any = useState({});

	useEffect(()=>{
		let mount = true;
		if (mount) {
		  isLogged(cookies).then((res) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
		}
		return (() => { mount = false; });
	  }, [cookies])
	  
	  if (!cookies.access_token || unauthorized) {
		return (<Redirect to="/" />);
	  }
	return (
		<div>
			<NavBar page="Profile" />
			<div className="ProfileElement">
				<div className="ProfileMain">
					<Overall me={me} />
					<History />
					<Achivements />
				</div>
			</div>
		</div>
	);
}