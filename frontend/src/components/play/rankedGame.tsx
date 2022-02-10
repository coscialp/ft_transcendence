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
    const [player, setPlayer] = useState<GameManager>();
    const [popUp, setPopUp] = useState(false);
  
    useEffect(() => {
      let mount = true;
      if (mount) {
        setPlayer(new GameManager());
      }
      return (() => { mount = false; });
    }, [cookies]);
  
    useEffect(() => {
      let mount = true;
      if (mount && player) {
        player.Socket = io(`ws://${ip}:5002`, { transports: ['websocket'] });
        if (player?.Socket) {
          
          player.Socket.on(`startgame/${data.me?.username}`, (msg: any) => {
            player.ID = msg;
            localStorage.setItem('playerID', player.ID);
            return history.push(`/game`)
          })
        }
      }
      return (() => { mount = false; });
    }, [player, cookies, data.me, history]);
  
    function play(): void {
      if (player?.Socket)
        player.Socket.emit('matchmakingRanked', '');
    }
  
  
    return (
      <div className="rankedElement" >
        <p className="rankedTitle" >Ranked Game</p>
        <PlayOutline className="playBtn" onClick={e => {play(); setPopUp(true)}}/>
        {popUp === true ? 
          <div className="duelPage">
            <div className="duelPopUp"> 
              <p>Waiting for a game...</p>
              <div className="cancel-container">
              <span className='cancel-cross' onClick={e => {setPopUp(false)}} >
                <div className="leftright"></div>
                <div className="rightleft"></div>
                <label className="cancel">cancel</label>
              </span>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
            </div>
          </div>
        : null}
        <p> Game played : {data.stats?.ranked?.played} <br/> {data.me?.PP} PP </p>
      </div>
    )
  }