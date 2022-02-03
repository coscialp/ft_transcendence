import { useEffect, useRef, useState } from "react";
import Unity from "react-unity-webgl";
import { GameManager } from "./gamemanager";
import './duel.css'
import { Redirect, useHistory } from "react-router-dom";
import { isLogged } from "../../utils/isLogged";
import { User } from "../../utils/user.type";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";
import { ip } from "../../App";

export function InGame() {

  let history = useHistory();
  const [player] = useState<GameManager>(new GameManager());
  const [leave, setLeave] = useState<number>(0);
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [me, setMe] = useState<User>();
  const [reload, setReload] = useState<boolean>(false);
  // eslint-disable-next-line
  const [gameFinish, setGameFinish] = useState<boolean>(false);
  const [leaveTime, setLeaveTime] = useState<number>(0);
  const leaveTimeRef = useRef(leaveTime);
  const [tabTime, setTabTime] = useState<number>(0);
  const leaveRef = useRef(leave);
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
  }

  useEffect(function () {
    player.receive_ball_position();
    player.receive_player_position();
    player.receive_point();
    player.receive_ready_up();
    player.receive_endGame();
  }, [reload, player]);

  function check_ready(player: any) {
    console.log(gameFinish);
    if (gameFinish === true) {
      return history.push('/resume');
    }
    player.ready_checker();
  }

  setInterval(() => {
    if (leaveTimeRef.current === 1)
    {
      setTabTime(tabTime + 1);
    }
    else
    {
      setTabTime(0);
    }
    if (tabTime === 10)
      console.log("you've left the game");
    if (player.GameState === true || leaveRef.current === 2)
      console.log("leave page");
    check_ready(player);
  }, 1000);

  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }
  return (
    <div>
      <Unity className="game_screen" unityContext={player.UnityContext} />
      <div className="testing" onClick={() => setReady(player.ID, player.GameID)}></div>
    </div>
  );
}
