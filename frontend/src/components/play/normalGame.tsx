// import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./normalGame.css";
import { PlayOutline } from 'heroicons-react';
import { isLogged } from "../../utils/isLogged";
import { GameManager } from "./gamemanager";
import { useHistory } from "react-router";
import { io } from "socket.io-client";
import { ip } from "../../App";

type User = {
  id: string,
  username: string,
  password: string | null,
  firstName: string,
  lastName: string,
  nickName: string,
  isLogged: boolean,
  profileImage: string,
  email: string,
}
export function Normal(data: any) {

  const [cookies] = useCookies();
  let history = useHistory();
  const [player, setPlayer] = useState<GameManager>();

  useEffect(() => {
    let mount = true;
    if (mount) {
      setPlayer(new GameManager());
    }
    return (() => { mount = false; });
  }, [cookies]);

  useEffect(() => {
    let mount = true;
    if (mount && player && cookies && history) {
      player.Socket = io(`ws://${ip}:5002`, { transports: ['websocket'] });
      if (player?.Socket) {
        
        player.Socket.on(`startgame/${data.me?.username}`, (msg: any) => {
          player.ID = msg;
          localStorage.setItem('playerID', player.ID);
          player.Socket.disconnect();
          return history.push(`/game`)
        })
      }
    }
    return (() => { mount = false; });
  }, [player, cookies, data.me, history]);

  function play(): void {
    if (player?.Socket)
      player.Socket.emit('matchmaking', '');
  }

  return (
    <div className="normalElement" >
      <p className="normalTitle" >Normal Game</p>
      <PlayOutline className="playBtn" onClick={play} />
      <p> Game played : {data.stats?.normal?.played}</p>
    </div>
  )
}