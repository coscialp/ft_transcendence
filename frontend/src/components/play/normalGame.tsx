// import axios from "axios"
// import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
import "./normalGame.css";
import { PlayOutline } from 'heroicons-react';

export function Normal() {
    // const [cookies] = useCookies();
  
    // function play(): void {
    //     axios.request({
    //       url: '/auth/logout',
    //       method: 'patch',
    //       baseURL: `http://${ip}:5000`,
    //       headers: {
    //         "Authorization": `Bearer ${cookies.access_token}`,
    //       }
    //     });
    //     setCookie("access_token", "");
    //     history.push("/");
    //   }
  
  
    return (
      <div className="normalElement" >
        <p className="normalTitle" >Normal Game</p>
        <PlayOutline className="playBtn"/>
        <p> Game played : 20 (12W/8L)</p>
      </div>
    )
  }