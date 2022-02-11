// import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./normalGame.css";
import { PlayOutline } from 'heroicons-react';
import { GameManager } from "./gamemanager";
import { useHistory } from "react-router";


export function Normal(data: any) {

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
    if (mount && cookies && history) {

      if (player) {
        console.log('here');
        data.socket.on(`startgame/${data.me?.username}`, (msg: any) => {
          player.ID = msg;
          localStorage.setItem('playerID', player.ID);
          return history.push(`/game`)
        })
      }
    }
    return (() => { mount = false; });
    // eslint-disable-next-line
  }, [player, cookies, data.me, history]);

  function play(): void {
    if (data.socket) {
      console.log(data.socket);
      data.socket.emit('matchmaking', '');
    }
  }
  function exit_queue() {
    if (data.socket) {
      data.socket.emit('ExitQueue');
    }
  }
  return (
    <div className="normalElement" >
      <p className="normalTitle" >Normal Game</p>
      <PlayOutline className="playBtn" onClick={e => { play(); setPopUp(true) }} />
      {popUp === true ?
        <div className="duelPage">
          <div className="duelPopUp">
            <p>Waiting for a game...</p>
            <div className="cancel-container">
              <span className='cancel-cross' onClick={e => { exit_queue(); setPopUp(false) }} >
                <div className="leftright"></div>
                <div className="rightleft"></div>
                <label className="cancel">cancel</label>
              </span>
              <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
        : null}
      <p> Game played : {data.stats?.normal?.played}</p>
    </div>
  )
}