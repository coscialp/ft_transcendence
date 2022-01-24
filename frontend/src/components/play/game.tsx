import { useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { io, Socket } from "socket.io-client";
import { GameManager } from "./gamemanager";
import './duel.css'
import { Redirect } from "react-router-dom";
import { isLogged } from "../../utils/isLogged";
import { User } from "../../utils/user.type";
import { useCookies } from "react-cookie";

export function InGame() {

    const [player, setPlayer] = useState<GameManager>(new GameManager); const [cookies] = useCookies();
    const [unauthorized, setUnauthorized] = useState(false);
    const [me, setMe] = useState<User>();
    const [reload, setReload] = useState<Boolean>(false);

    useEffect(() => {
        let mount = true;
        if (mount) {
            isLogged(cookies).then((res: any) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
        }
        return (() => { mount = false; });
    }, [cookies])

    
    player.ID = String(localStorage.getItem('playerID'));
    const unityContext = new UnityContext({
        loaderUrl: "./Build/webgl.loader.js",
        dataUrl: "./Build/webgl.data",
        frameworkUrl: "./Build/webgl.framework.js",
        codeUrl: "./Build/webgl.wasm",
    });

    useEffect(function () {
        unityContext.on("setReady", function (ready) {
          player.Socket.emit('ReadyUp', { Pseudo: player.ID });
        });
      });

      useEffect(function () { 
          console.log(`SetBallPos/${player.GameID}`)
        player.Socket.on(`SetBallPos/${player.GameID}`, (posx: number, posy: number) => {
            console.log('hey');
          var posToSend: string = `${posx} ${posy}`;
          if (player.ID === "Player2")
            unityContext.send("Ball", 'setPos', posToSend);
        })
      }, [reload]);

    useEffect(function () {
        unityContext.on("SetBallPos", function (posx, posy) {
            if (player.ID === "Player1")
                player.Socket.emit('SetBallPos', posx, posy)
        });
    });
    
    useEffect(function () {
        let mount = true;
        if (mount) {
            player.Socket.emit("getGameID", '');
        }
        return (() => { mount = false; });
    }, [me]);
    
    useEffect(function () {
        player.Socket.on(`getGameID/${me?.username}`, function (gameID: number) {
            player.GameID = gameID;
            setReload(true);
            console.log(`opponenent: ${player.GameID}`);
        });
    }, [me]);
    
    
    useEffect(function () {
        player.Socket.on(`AddPoint/${player.GameID}`, (Player: string) => {
            if (player.ID === "Player2") {
                if (Player === "add1")
                unityContext.send("HUD", "AddScore", "RightWall");
                else
                unityContext.send("HUD", "AddScore", "LeftWall");
            }
        })
    }, [reload]);

    function check_ready(player: any)
    {       console.log(`${player.P2ready} || ${player.P1ready} || ${player.ID}`)
    if (player.P1ready === true && player.P2ready === true) {
        if (player.ID === "Player2")
        {
          unityContext.send("RemotePaddle", "setID", player.ID);
          unityContext.send("HUD", "setID", player.ID);
          unityContext.send("Ball", "setID", player.ID);
        }
        else if (player.ID === "Player1")
        {
          unityContext.send("LocalPaddle", "setID", player.ID);
          unityContext.send("HUD", "setID", player.ID);
          unityContext.send("Ball", "setID", player.ID);
        }
        unityContext.send("HUD", "gameInit");
        unityContext.send("Ball", "setID", player.ID);
        unityContext.send("LocalPaddle", "setGameStarted", 1);
        unityContext.send("RemotePaddle", "setGameStarted", 1);
        player.P1ready = false;
        player.P2ready = false;
      }
    }
    useEffect(function () {
        player.Socket.on(`ReadyUp/${player.GameID}`, (playerID: any) => {
            console.log(playerID.Pseudo);
            if (playerID.Pseudo === 'Player1')
                player.P1ready = true;
            else if(playerID.Pseudo === 'Player2')
                player.P2ready = true;
        })
    }, [reload]);
    if (!cookies.access_token || unauthorized) {
        return (<Redirect to="/" />);
    }
    setInterval(() => {
        check_ready(player)
      }, 1000);
    return (
        <div>
            <Unity className="game_screen" unityContext={unityContext} />
        </div>
    );
}
