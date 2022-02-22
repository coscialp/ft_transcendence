import "./rankedGame.css";
import { PlayOutline } from 'heroicons-react';
import { GameManager } from "./gamemanager";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { gameSocket } from "../../App";
export function Ranked(data: any) {

  const [cookies] = useCookies();
  let history = useHistory();
  const [player] = useState<GameManager>();
  const [popUp, setPopUp] = useState(false);
  const [inQueue, setInQueue] = useState<boolean>();

  useEffect(() => {
    let mount = true;
    if (mount && data.player) {
      if (gameSocket && player && data.me) {

        gameSocket.on(`startgame/${data.me.username}`, (msg: any) => {
          player.ID = msg;
          localStorage.setItem('playerID', player.ID);
          localStorage.setItem('gameMOD', "false");
          return history.push(`/game`);
        })
      }
    }
    return (() => { mount = false; });
  // eslint-disable-next-line
  }, [data.player, cookies, data.me, history]);

  useEffect(() => {
    const interval = setInterval(() => {
      
      if (inQueue === true) {
        gameSocket.emit('matchmakingRanked', '');
      }
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [inQueue]);
  function play(): void {
    setInQueue(true);
    if (gameSocket)
    gameSocket.emit('matchmakingRanked', '');
  }
  function exit_queue() {
    setInQueue(false);
    if (gameSocket) {
      gameSocket.emit('ExitQueue');
    }
  }

  return (
    <div className="rankedElement" >
      <p className="rankedTitle" >Ranked Game</p>
      <PlayOutline className="playBtn" onClick={() => { play(); setPopUp(true) }} />
      {popUp === true ?
        <div className="duelPage">
          <div className="duelPopUp">
            <p>Waiting for a game...</p>
            <div className="cancel-container">
              <span className='cancel-cross' onClick={() => { exit_queue(); setPopUp(false) }} >
                <div className="leftright"></div>
                <div className="rightleft"></div>
                <label className="cancel">cancel</label>
              </span>
              <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
        : null}
      <p> Game played : {data.stats?.ranked?.played} <br /> {data.me?.PP} PP </p>
    </div>
  )
}