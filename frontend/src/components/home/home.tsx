import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router';
import { NavBar } from '../navbar/navbar';
import { Gamemode } from './gamemode';
import { MainMenu } from './mainMenu';
import { Friendlist } from './friendlist';
import './home.css'
import { isLogged } from '../../utils/isLogged';
import PrivateMessage from './privateMessage';

export function Home() {
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => { setUnauthorized(res.unauthorized) });
    }
    return (() => { mount = false; });
  }, [cookies])

  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }

  return (
    <div className="HomePage" >
      <NavBar page="Home" />
      <div className="HomeMain" >
        <Gamemode />
        <MainMenu />
        <Friendlist />
      </div>
      <PrivateMessage />
    </div>
  );
}