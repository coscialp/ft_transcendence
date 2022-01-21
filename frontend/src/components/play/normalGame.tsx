import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./normalGame.css";
import { PlayOutline } from 'heroicons-react';
import { io, Socket } from "socket.io-client";
import { isLogged } from "../../utils/isLogged";

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

const ip = window.location.hostname;



export function Normal() {
    const [cookies] = useCookies();
    const [socket, setSocket] = useState<Socket>();
    const [me, setMe] = useState<User>();

    useEffect(() => {
      let mount = true;
      if (mount) {
        isLogged(cookies).then((res) => { setMe(res.me.data); });
        setSocket(io(`ws://${ip}:5002`, { transports: ['websocket'] }));
      }
      return (() => { mount = false; });
    }, [cookies]);

    useEffect(() => {
      let mount = true;
      if (mount) {
        if (socket) {
          console.log(`startgame/${me?.username}`);
          socket.on(`startgame/${me?.username}`, (msg: any) => {
            console.log('bug');
          })
        }
      }
      return (() => { mount = false; });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, cookies, me]);
    function play(): void {
        if (socket)
          socket.emit('matchmaking', '');
      }
    return (
      <div className="normalElement" >
        <p className="normalTitle" >Normal Game</p>
        <PlayOutline className="playBtn" onClick={play}/>
        <p> Game played : 20 (12W/8L)</p>
      </div>
    )
  }