import { useEffect, useRef, useState } from "react";
import Unity from "react-unity-webgl";
import { GameManager } from "./gamemanager";
import './game.css'
import { Redirect, useHistory } from "react-router-dom";
import { isLogged } from "../../utils/isLogged";
import { User } from "../../utils/user.type";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";
import { ip } from "../../App";

const onFocus = (player: GameManager, leave: any, setLeave: any) => {
};

// User has switched away from the tab (AKA tab is hidden)
const onBlur = (player: GameManager, leave: any, setLeave: any) => {
  setLeave(leave + 1);
  if (leave === 3)
    player.Socket.emit('warning');
};

export function InGame() {

  let history = useHistory();
  const [player] = useState<GameManager>(new GameManager());
  const [leave, setLeave] = useState<number>(0);
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [me, setMe] = useState<User>();
  const [reload, setReload] = useState<boolean>(false);
  const [gameFinish, setGameFinish] = useState<boolean>(false);
  const [leaveTime, setLeaveTime] = useState<number>(0);
  const leaveTimeRef = useRef(leaveTime);
  const [tabTime, setTabTime] = useState<number>(0);
  const tabTimeRef = useRef(tabTime);
  const leaveRef = useRef(leave);

  const setMyTabTime = (data: any) => {
    tabTimeRef.current = data;
    setTabTime(data);
  }
  const setMyState = (data: any) => {
    leaveRef.current = data;
    setLeave(data);
  }
  const setMyLeaveTime = (data: any) => {
    leaveTimeRef.current = data;
    setLeaveTime(data);
  }
  player.ID = String(localStorage.getItem('playerID'));


  const onBlur = () => {
      setMyState(leaveRef.current + 1);
      setMyLeaveTime(1);
  };
  const onFocus = () => {
    setMyLeaveTime(0);
};

    useEffect(() => {
        window.addEventListener("blur", onBlur);
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("focus", onFocus);
    };
  });

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res: any) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
      player.Socket = io(`ws://${ip}:5002`, { transports: ['websocket'] });
    }
    return (() => { mount = false; });
  }, [cookies, player]);

  useEffect(function () {
    player.send_ready_up();
    player.send_point();
    player.send_ball_position();
    player.send_player_position();
  }, [player]);

  useEffect(function () {
    let mount = true;
    if (mount) {
      player.send_gameid();
      if (me) {
        player.receive_gameID(me.username, setReload);
      }

    }
    return (() => { mount = false; });
  }, [me, player]);

  function setReady(id: string, gameid: number) {
    player.Socket.emit('ReadyUp', { player: id, gameId: gameid });
    let ready: HTMLElement | null = document.getElementById('button_ready');
    if (ready) {
      ready.style.display = 'none';
    }

  }

  useEffect(function () {
    player.receive_ball_position();
    player.receive_player_position();
    player.receive_point();
    player.receive_ready_up();
    player.receive_endGame();
    player.receive_warning(setGameFinish);
  }, [reload, player]);

  function handleResize()
  {
      let game: any = document.getElementsByClassName('game_screen')[0];
      if ((window.innerHeight / 900) > (window.innerWidth / 2300) && game)
      {
        game.style.height = '40vw';
        game.style.width = '100vw';
      }
      else if (game)
      {
        game.style.height = `${window.innerHeight * 0.5}px`;
        game.style.width = `${window.innerWidth}px`;
      }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
  });

  function check_ready() {
    if (leaveTimeRef.current === 1) {
      console.log(`tab time : ${tabTimeRef.current}`);
      setMyTabTime(tabTimeRef.current + 1);
    }
    else {
      setTabTime(0);
    }
    if (tabTimeRef.current === 1000) {
      player.Socket.emit('warning', {player: player.ID, gameId: player.GameID});
    }
    console.log(`tab number: ${leaveRef.current}`)
    if (player.GameState === true || leaveRef.current === 300) {
      console.log(player.GameID);
      player.Socket.emit('warning', {player: player.ID, gameId: player.GameID});
    }
    console.log(`gameFinish : ${gameFinish}`);
    if (gameFinish === true || player.Warning === true) {
      console.log('error');
      return history.push('/resume');
    }
    player.ready_checker();
  }
useEffect(() => {  setInterval(() => {
  console.log(player.GameID);
  check_ready();
}, 1000);
}, []);


  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }
  return (
    <div className="game_body">
      <Unity className="game_screen" unityContext={player.UnityContext} />
      <button id="button_ready" onClick={() => setReady(player.ID, player.GameID)}>Ready up</button>
    </div> 
  );
}
