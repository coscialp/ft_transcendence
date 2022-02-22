import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router';
import { Leaderboard } from './leaderboard';
import { MainMenu } from './mainMenu';
import { Friendlist } from './friendlist';
import './home.css'
import { isLogged } from '../../utils/isLogged';
import PrivateMessage from './privateMessage';
import { User } from '../../utils/user.type';
import { io, Socket } from 'socket.io-client';
import { ip } from '../../App';

export function Home() {
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);
  const [me, setMe] = useState<User>();
  const [currentChat, setCurrentChat] = useState("");
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => { if (mount) { setMe(res.me?.data); setUnauthorized(res.unauthorized) }});
      setSocket(io(`ws://${ip}:5001`, { transports: ['websocket'] }));
    }
    return (() => { mount = false; });
  }, [cookies])

  useEffect(() => {
    let mount = true;
    if (mount) {
      socket?.on('disconnect' , function(){
      socket.emit('user disconnect');
    });
    }
    return (() => { mount = false; });
  }, [cookies, socket])

  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }

  return (
    <div className="HomePage" >
      <div className="HomeMain" >
        <Leaderboard />
        <MainMenu me={me} socket={socket}/>
        <Friendlist currentChat={currentChat} setCurrentChat={setCurrentChat} />
      </div>
      <PrivateMessage currentChat={currentChat} setCurrentChat={setCurrentChat} me={me} socket={socket}/>
    </div>
  );
}