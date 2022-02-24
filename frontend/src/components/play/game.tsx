import { useEffect, useRef, useState } from "react";
import Unity from "react-unity-webgl";
import { GameManager } from "./gamemanager";
import './game.css'
import { Redirect, useHistory } from "react-router-dom";
import { isLogged } from "../../utils/isLogged";
import { User } from "../../utils/user.type";
import { useCookies } from "react-cookie";
import { gameSocket, ip } from "../../App";
import axios from "axios";

export function InGame() {

  let history = useHistory();
  const [player] = useState<GameManager>(new GameManager());
  const [leave, setLeave] = useState<number>(0);
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [me, setMe] = useState<User>();
  const [reload, setReload] = useState<boolean>(false);
  const [gameFinish] = useState<boolean>(false);
  const [leaveTime, setLeaveTime] = useState<number>(0);
  const leaveTimeRef = useRef(leaveTime);
  const [tabTime, setTabTime] = useState<number>(0);
  const tabTimeRef = useRef(tabTime);
  const leaveRef = useRef(leave);
  const [score, setScore] = useState<{
    score1: number,
    score2: number
  }>({ score1: 0, score2: 0 });
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
      player.UnityContext.removeAllEventListeners();
      player.UnityContext.quitUnityInstance();
      gameSocket.off(`ReadyUp/${player.GameID}`);
      gameSocket.off(`finishGame/${player.GameID}`);
      gameSocket.off(`getGameID/${me?.username}`);
      gameSocket.off(`StartParticle/${player.GameID}`);
      gameSocket.off(`UpdatePosition`);
    };
    // eslint-disable-next-line
  }, []);



  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res: any) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });
      player.ID = String(localStorage.getItem('playerID'));
      player.Spectator = String(localStorage.getItem('playerID')) === 'spectator' ? true : false;
      player.GameMod = String(localStorage.getItem('gameMOD')) === 'true' ? 1 : 0;
      if (player.Spectator === true) {
        player.GameID = Number(localStorage.getItem('GameID'));
      }
    }
    return (() => { mount = false; });
  }, [cookies, player]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      axios.request({
        url: `/auth/ingame`,
        method: 'patch',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        }
      })
    }
    return (() => {
      axios.request({
        url: `/auth/online`,
        method: 'patch',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        }
      })
      mount = false;
    });
  }, [cookies]);

  useEffect(function () {
    if (player.GameID !== 0) {
      if (player.Spectator === false) {
        player.send_ready_up();
        player.send_player_position();
        player.send_ball_position();
      }
    }
  }, [player, player.GameID]);
  useEffect(() => {
    if (player.Spectator === false && player.GameID) {
      player.send_point();
    }
    // eslint-disable-next-line
  }, [player.GameID])

  useEffect(function () {
    let mount = true;
    if (mount) {
      player.send_gameid();
      if (me && mount) {
        player.receive_gameID(me.username, setReload);
      }

    }
    return (() => { mount = false; });
  }, [me, player]);

  function setReady() {
    gameSocket.emit('ReadyUp', { player: player.ID, gameId: player.GameID });
    let ready: HTMLElement | null = document.getElementById('button_ready');
    if (ready) {
      ready.style.display = 'none';
    }
  }

  useEffect(function () {
    if (player.GameID !== 0) {
      if (player.Spectator === false) {
        player.receive_game_info();
        player.receive_ready_up();
        player.receive_endGame();
        player.receive_particle();
      }
      else {
        gameSocket.emit('JoinRoom', {gameID: player.GameID});
        player.receive_endGame();
        player.receive_particle();
        player.receive_game_info();
      }
    }
  }, [reload, player, player.GameID]);

  function handleResize() {
    let game: any = document.getElementsByClassName('game_screen')[0];
    if ((window.innerHeight / 900) > (window.innerWidth / 2300) && game) {
      game.style.height = '40vw';
      game.style.width = '100vw';
    }
    else if (game) {
      game.style.height = `${window.innerHeight * 0.5}px`;
      game.style.width = `${window.innerWidth}px`;
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    // eslint-disable-next-line
  }, []);

  function check_ready() {
    if (player.Spectator === false) {
      if (leaveTimeRef.current === 1) {
        setMyTabTime(tabTimeRef.current + 1);
      }
      else {
        setTabTime(0);
      }
      if (tabTimeRef.current === 10 || player.GameState === true || leaveRef.current === 3) {
        if (player.ID === 'Player1') {
          gameSocket.emit('finishGame', { gameId: player.GameID, player: player.ID, score1: 0, score2: 10, date: player.Date });
        }
        else {
          gameSocket.emit('finishGame', { gameId: player.GameID, player: player.ID, score1: 10, score2: 0, date: player.Date });
        }
      }
      if (gameFinish === true || player.Warning === true) {
        return history.push('/resume');
      }
      player.ready_checker();
    }
    else if (gameFinish === true || player.Warning === true) {
      return history.push('/home');

    }


  }
  useEffect(() => {
    const interval = setInterval(() => {
      check_ready();
      if (player.Score1 !== score.score1 || player.Score2 !== score.score2) {
        setScore({ score1: player.Score1, score2: player.Score2 });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let ready: HTMLElement | null = document.getElementById('button_ready');
      if (ready && player.Spectator === false) {
        ready.style.visibility = 'visible';
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.GameMod === 2 && player.GameID !== 0 && player.ID === "Player1") {
        gameSocket.emit('StartParticle', { gameId: player.GameID });
      }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [player.GameID]);


  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }
  return (
    <div className="game_body">
      <p id="game_score"> {score?.score1} : {score?.score2} </p>
      <Unity className="game_screen" unityContext={player.UnityContext} />
      <button id="button_ready" onClick={() => setReady()}>Ready up</button>
    </div>
  );
}
