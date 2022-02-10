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


export function Normal(data: any) {

  const [cookies] = useCookies();
  let history = useHistory();
  const [player, setPlayer] = useState<GameManager>(new GameManager());
  useEffect(() => {
    let mount = true;
    if (mount && data.player && cookies && history) {
      
      if (player && player?.Socket) {
          data.socket.on(`startgame/${data.me?.username}`, (msg: any) => {
          player.ID = msg;
          localStorage.setItem('playerID', player.ID);
          return history.push(`/game`)
        })
      }
    }
    return (() => { mount = false; });
  }, [player, cookies, data.me, history]);

  function play(): void {
    if (data.socket) {
      console.log(data.socket);
      data.socket.emit('matchmaking', '');
    }
  }

  return (
    <div className="normalElement" >
      <p className="normalTitle" >Normal Game</p>
      <PlayOutline className="playBtn" onClick={play} />
      <p> Game played : {data.stats?.normal?.played}</p>
    </div>
  )
}