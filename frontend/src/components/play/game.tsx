import { useEffect, useState } from "react";
import Unity from "react-unity-webgl";
import { GameManager } from "./gamemanager";
import './duel.css'
import { Redirect } from "react-router-dom";
import { isLogged } from "../../utils/isLogged";
import { User } from "../../utils/user.type";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";
import { ip } from "../../App";

export function InGame() {
  const [player] = useState<GameManager>(new GameManager());
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [me, setMe] = useState<User>();
  const [reload, setReload] = useState<Boolean>(false);
  player.ID = String(localStorage.getItem('playerID'));

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

  function game_focus()
  {
    let test: any = document.getElementsByClassName('game_screen')[0];
    test.focus();
    console.log();
  }

  useEffect(function () {
    player.receive_ball_position();
    player.receive_player_position();
    player.receive_point();
    player.receive_ready_up();
  }, [reload, player]);

  function check_ready(player: any) {
    player.ready_checker();
  }

  setInterval(() => {
    check_ready(player);
  }, 1000);
  setInterval(() => {
    game_focus();
  }, 10);
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
