import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { Normal } from "./normalGame";
import { Ranked } from "./rankedGame";
import { Duel } from "./duel";
import "./play.css";
import axios from "axios";
import { ip } from "../../App";
import { User } from "../../utils/user.type";   

export function Play(props: any) {
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [stats, setStats]:any = useState({});
  const [me, setMe] = useState<User>();

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });  
    }
    return (() => { mount = false; });
  // eslint-disable-next-line
  }, [cookies])

  useEffect(() => {
		let mount = true;

		axios.request({
			url: `/user/me/statistics`,
			method: 'get',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
		}).then((response: any) => {

			if (mount) { setStats(response.data) }
		})
		return (() => { mount = false; });
	}, [cookies])

  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }

  return (
    <div>
      <div className="PlayMain" >
        <Normal me={me} stats={stats} />
        <Ranked me={me} stats={stats} />
        <Duel />
      </div>
    </div>
  )
}