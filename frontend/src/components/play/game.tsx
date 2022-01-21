import { useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { io, Socket } from "socket.io-client";
import { GameManager } from "./playerSettings";
import './duel.css'

export function InGame()
{
    const [player, setPlayer] = useState<GameManager>(new GameManager);
    player.ID = String(localStorage.getItem('playerID'));
    const unityContext = new UnityContext({
        loaderUrl: "./Build/webgl.loader.js",
        dataUrl: "./Build/webgl.data",
        frameworkUrl: "./Build/webgl.framework.js",
        codeUrl: "./Build/webgl.wasm",
      });
    

    console.log(localStorage.getItem('playerID'));
    return(
        <div>
           <Unity className="test" unityContext={unityContext} />
        </div>
    );
}
