import { useEffect, useState } from "react";
import Unity from "react-unity-webgl";
import { GameManager } from "./gamemanager";
import './duel.css'
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
  console.log('test');
  console.log(`${leave}`);
  if (leave === 3)
    player.Socket.emit('warning');
};

export function InGame() {

  let history = useHistory();
  const [player] = useState<GameManager>(new GameManager());
  const [leave, setLeave] = useState<Number>(0);
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [me, setMe] = useState<User>();
  const [reload, setReload] = useState<Boolean>(false);
  const [gameFinish, setGameFinish] = useState<Boolean>(false);
  player.ID = String(localStorage.getItem('playerID'));

  useEffect(() => {
    window.addEventListener("focus",() =>  onFocus(player, leave, setLeave));
    window.addEventListener("blur",() => onBlur(player, leave, setLeave));

    return () => {
        player.Socket.emit('leave');
        window.removeEventListener("focus", () => onFocus(player, leave, setLeave));
        window.removeEventListener("blur", () => onBlur(player, leave, setLeave));
    };
});

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res: any) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
      player.Socket = io(`ws://${ip}:5002`, { transports: ['websocket'] });
    }
    return (() => { mount = false; });
  }, [cookies, player])

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
    player.receive_endgame(setGameFinish);
  }, [reload, player]);

  function check_ready(player: any) {
    console.log(gameFinish);
    if (gameFinish === true) {
      return history.push('/resume');
    }
    player.ready_checker();
  }

  setInterval(() => {
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
