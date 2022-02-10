import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { NavBar } from "../navbar/navbar";
import { Normal } from "./normalGame";
import { Ranked } from "./rankedGame";
import { Duel } from "./duel";
import "./play.css";
import axios from "axios";
import { ip } from "../../App";
import { User } from "../../utils/user.type";
import { GameManager } from "./gamemanager";
import { io } from "socket.io-client";

export function Play() {
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [stats, setStats]:any = useState({});
  const [me, setMe] = useState<User>();
  const [player, setPlayer] = useState<GameManager>();
  const [socket, setSocket] = useState(io());

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });  
      setPlayer(new GameManager());
      if (cookies) {
        setSocket(io(`ws://${ip}:5002`, { transports: ['websocket'] }));
        console.log(socket);
      }
    }
    return (() => { mount = false; });
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
      <NavBar page="Play" />
      <div className="PlayMain" >
        <Normal me={me} stats={stats} socket={socket}/>
        <Ranked me={me} stats={stats} socket={socket}/>
        <Duel />
      </div>
    </div>
  )
}