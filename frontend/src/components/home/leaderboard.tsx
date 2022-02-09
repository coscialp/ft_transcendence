import './home.css'
import { ArrowSmUp } from 'heroicons-react'
import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { isLogged } from '../../utils/isLogged';
import { ip } from "../../App";

export function Open_Leaderboard() {
    
    var Leaderboard: any = document.getElementById('leaderboardMini')
    var LBBodyOpen: any = document.getElementById('LBBodyOpen')
    var arrowR: any = document.getElementById('leadArrowR')
    var arrowL: any = document.getElementById('leadArrowL')
    if (Leaderboard.style.height === '52vh') {
        Leaderboard.style.transition = 'all .5s ease-in-out'
        Leaderboard.style.height = '50px'
        Leaderboard.style.overflowY = 'hidden'
        Leaderboard.style.transform = 'rotate(90deg)'
        Leaderboard.style.left = '-23.5vh'
        Leaderboard.style.bottom = '50vh'
        Leaderboard.style.zindex = '1000'
        Leaderboard.style.width = '50vh'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
        LBBodyOpen.style.display = 'none' 
    }
    else {
        Leaderboard.style.transition = 'all .5s ease-in-out'
        Leaderboard.style.height = '52vh'
        Leaderboard.style.overflowY = 'scroll'
        Leaderboard.style.transform = 'rotate(0deg)'
        Leaderboard.style.left = '0'
        Leaderboard.style.bottom = '28vh'
        Leaderboard.style.zindex = '1000'
        Leaderboard.style.width = '50vw'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
        LBBodyOpen.style.display = 'flex'
        LBBodyOpen.style.flexDirection = 'column'
    }
}

export function Leaderboard() {
    const [leaders, setLeaders]: any = useState([]);
    const [cookies, setCookie] = useCookies();
    const [me, setMe]: any = useState({});
    
    useEffect(() => {
        let mount = true;
        axios.request({
            url:`/user`,
            method: 'get',
            baseURL: `http://${ip}:5000`,
            headers: {
                "Authorization": `Bearer ${cookies.access_token}`,
            }
        }).then((response: any) => {
                setLeaders(response.data);
        })
        if (mount) {
          isLogged(cookies).then((res) => { setMe(res.me?.data) });
        }
        return (() => { mount = false; });
      }, [cookies])

    return (
        <div className="LBElement" >
            <div id="leaderboardMini">
                <div id="OpenLeaderboard" onClick={() => { Open_Leaderboard()}}>
                    <ArrowSmUp id="leadArrowR" onClick={() => Open_Leaderboard()} />Leaderboard
                    <ArrowSmUp id="leadArrowL" onClick={() => Open_Leaderboard()} />
                </div>
                <div id="LBBodyOpen" >{leaders.map((users: any) => (
                    <details key={users.username} id={users.username}>
                        <summary className="leaderboardList">{users.username}</summary>
                        <nav className="menuLeaderboard">
                            <p className="rules">Rules:</p>
                            <p className="rules ">This is a solo player mode, you will play against a wall, the goal is to train yourself and to beat your highscore !</p>
                            <div className="leaderboardBorder"></div>
                            <button className="friendBtn"><span /><span /><span /><span />go survival mode</button>
                        </nav>
                    </details>
                    ))}
                </div>
            </div>
            
            <p className="LBTitle" >Leaderboard</p>
            <div className="LBBody" >{leaders.map((users: any) => (
                <details key={users.username} id={users.username}>
                    <summary className="leaderboardList"><img className="imgFriendList" src={users.profileImage} alt=""></img>{users.username}</summary>
                </details>
                ))}
            </div>
        </div>
    )
}