import "./rankedGame.css";
import { PlayOutline } from 'heroicons-react';
import { ip } from "../../App";
import { GameManager } from "./gamemanager";
import { isLogged } from "../../utils/isLogged";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { io } from "socket.io-client";

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

export function Ranked(data: any) {

    const [cookies] = useCookies();
    let history = useHistory();
    const [player, setPlayer] = useState<GameManager>(new GameManager());
  
    useEffect(() => {
      let mount = true;
      if (mount && data.player) {
        if (data.socket) {
          
          data.socket.on(`startgame/${data.me?.username}`, (msg: any) => {
            player.ID = msg;
            localStorage.setItem('playerID', player.ID);
            return history.push(`/game`);
          })
        }
      }
      return (() => { mount = false; });
    }, [data.player, cookies, data.me, history]);
  
    function play(): void {
      console.log(data.socket)
      if (data.socket)
        data.socket.emit('matchmakingRanked', '');
    }
  
  
    return (
      <div className="rankedElement" >
        <p className="rankedTitle" >Ranked Game</p>
        <PlayOutline className="playBtn" onClick={play}/>
        <p> Game played : {data.stats?.ranked?.played} <br/> {data.me?.PP} PP </p>
      </div>
    )
  }