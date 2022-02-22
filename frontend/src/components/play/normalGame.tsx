// import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./normalGame.css";
import { PlayOutline } from 'heroicons-react';
import { GameManager } from "./gamemanager";
import { useHistory } from "react-router";
import { gameSocket } from "../../App";

export function Normal(data: any) {

  const [cookies] = useCookies();
  let history = useHistory();
  const [player, setPlayer] = useState<GameManager>();
  const [popUp, setPopUp] = useState(false);
  const [selectedOption, setSelectedOption] = useState<String>();

  useEffect(() => {
    let mount = true;
    if (mount) {
      setPlayer(new GameManager());
      setSelectedOption("Normal Game");
    }
    return (() => { mount = false; });
  }, [cookies]);

  useEffect(() => {
    let mount = true;
    if (mount && cookies && history) {

      if (player) {

        gameSocket.on(`startgame/${data.me?.username}`, (msg: any) => {
          player.ID = msg;
          localStorage.setItem('playerID', player.ID);
          localStorage.setItem('gameMOD', "false");
          return history.push(`/game`)
        })
        gameSocket.on(`startgamemod/${data.me?.username}`, (msg: any) => {
          player.ID = msg;
          localStorage.setItem('playerID', player.ID);
          localStorage.setItem('gameMOD', "true");
          return history.push(`/game`)
        })
      }
    }
    return (() => { mount = false; });
    // eslint-disable-next-line
  }, [player, cookies, data.me, history]);

  function play(): void {
    if (gameSocket) {

      gameSocket.emit('matchmaking', '');
    }
  }
  function exit_queue() {
    if (gameSocket) {
      gameSocket.emit('ExitQueue');
    }
  }

  function playGamemode(): void {
    if (gameSocket) {
      
      gameSocket.emit('matchmaking', { mod: "gamemod" });
    }
  }

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  const styles: { [name: string]: React.CSSProperties } = {
    container: {
      marginTop: 50,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "10px",
      height: "40px",
    },
    select: {
      padding: 5,
      maxWidth: 200,
      width: "15vw",
      background: "transparent",
      height: "40px",
      color: "white",
      borderRadius: "5px",
    },
  };

  return (
    <div className="normalElement" >
      <div style={styles.container}>
        <select onChange={selectChange} style={styles.select}>
          <option style={{ display: `none` }}>
            {selectedOption}
          </option>
          <option value="Normal Game">Normal Game</option>
          <option value="BlackHolePong Mode">BlackHolePong Mode</option>
        </select>
      </div>
      {selectedOption === "Normal Game" ?
        <PlayOutline className="playBtn" onClick={e => { play(); setPopUp(true) }} />
        : <PlayOutline className="playBtn" onClick={e => { playGamemode(); setPopUp(true) }} />
      }
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