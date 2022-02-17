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

  function playGamemode(): void {
    if (player?.Socket)
      player.Socket.emit('matchmaking', '');
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
      width: 200,
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
          <option selected disabled>
            {selectedOption}
          </option>
          <option value="Normal Game">Normal Game</option>
          <option value="BlackHolePong Mode">BlackHolePong Mode</option>
        </select>
      </div>
      {selectedOption === "normalGame" ?
        <PlayOutline className="playBtn" onClick={e => {play(); setPopUp(true)}} />
        : <PlayOutline className="playBtn" onClick={e => {playGamemode(); setPopUp(true)}} />
      }
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
      <p> Game played : {data.stats?.normal?.played}</p>
    </div>
  )
}