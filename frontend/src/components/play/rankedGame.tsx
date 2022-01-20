import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./rankedGame.css";
import { PlayOutline } from 'heroicons-react';

export function Ranked() {
    const [cookies] = useCookies();
  

  
  
    return (
      <div className="rankedElement" >
        <p className="rankedTitle" >Ranked Game</p>
        <PlayOutline className="playBtn"/>
        <p> Game played : 20 (12W/8L) 518PP</p>
      </div>
    )
  }