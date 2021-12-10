import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router';
import { NavBar } from '../navbar/navbar';
import { Gamemode } from './gamemode';
import { MainMenu } from './mainMenu';
import { Friendlist } from './friendlist';
import './home.css'

const ip = window.location.hostname;

async function isLogged(cookies: any, setUnauthorized: any) {

    await axios.request({
      url: '/user/me',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
      }).then((response: any) => {
        sessionStorage.setItem("me", JSON.stringify(response))
      }).catch(err => {
        if (err.response.status === 401) {          
          setUnauthorized(true);
        }
    });
  setUnauthorized(false);
}

export function Home() {
  const [unauthorized, setUnauthorized] = useState(false);
  const [cookies] = useCookies();
  
  useEffect(()=>{
    isLogged(cookies, setUnauthorized);
  }, [cookies])
  
  if (unauthorized) {
    return (<Redirect to="/" />);
  }

    return (
      <div className="HomePage" >
        <NavBar page="Home" />
        <div className="HomeMain" >
          <Gamemode />
          <MainMenu/>
          {/* <ChannelPrimary /> */}
          <Friendlist />
        </div>
      </div>
    );
}