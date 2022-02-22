import './home.css'
import { ArrowSmUp } from 'heroicons-react'
import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { isLogged } from '../../utils/isLogged';
import { ip } from "../../App";
import './leaderboard.css'


export function Open_Leaderboard() {

    var Leaderboard: any = document.getElementById('leaderboardMini')
    var LBBodyOpen: any = document.getElementById('LBBodyOpen')
    var arrowR: any = document.getElementById('leadArrowR')
    var arrowL: any = document.getElementById('leadArrowL')
    var leaderboardOrientation: any = document.getElementById('leaderboardOrientation')
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
        leaderboardOrientation.style.transform = 'rotate(-90deg)'
        leaderboardOrientation.style.writingMode = 'vertical-rl'
        leaderboardOrientation.style.textOrientation = 'upright'
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
        leaderboardOrientation.style.transform = 'none'
        leaderboardOrientation.style.writingMode = 'unset'
        leaderboardOrientation.style.textOrientation = 'unset'
    }
}

export function Leaderboard() {
    const [leaders, setLeaders]: any = useState([]);
    const [swich, setSwich] = useState<boolean>(false);
    const [cookies] = useCookies();
    // eslint-disable-next-line
    const [me, setMe]: any = useState({});

    useEffect(() => {
        let mount = true;
        if (mount) {
            isLogged(cookies).then((res) => { if (mount) { setMe(res.me?.data) } });
        }
        return (() => { mount = false; });
    }, [cookies])

    useEffect(() => {
        let mount = true;
        if (mount) {
            axios.request({
                url: `/user/leaderboard/all`,
                method: 'get',
                baseURL: `http://${ip}:5000`,
                headers: {
                    "Authorization": `Bearer ${cookies.access_token}`,
                }
            }).then((response: any) => {
                if (mount) {
                    setLeaders(response.data);
                }
            })
        }
        return (() => { mount = false; });
    }, [cookies])

    useEffect(() => {
        const interval = setInterval(() => {
            if (swich) {
                document.getElementById("leaderboard-slides")!.style.transform = "translateX(-50%)";
            }
            else {
                document.getElementById("leaderboard-slides")!.style.transform = "translateX(0%)";
            }
            setSwich(!swich);
        }, 1200000);
        return () => clearInterval(interval);
    }, [swich]);



    return (
        <div className="LBElement" >
            <div id="leaderboardMini">
                <div id="OpenLeaderboard" onClick={() => { Open_Leaderboard() }}>
                    <ArrowSmUp id="leadArrowR" onClick={() => Open_Leaderboard()} />
                    <p id="leaderboardOrientation">Leaderboard</p>
                    <ArrowSmUp id="leadArrowL" onClick={() => Open_Leaderboard()} />
                </div>
                <div id="LBBodyOpen" >
                    <div id="leaderboard-slides" >
                        <div className="leaderboard" >
                            <div className="profile">
                                {leaders.length >= 2 ?
                                    <div className="person second">
                                        <div className="num">2</div>
                                        <i className="fas fa-caret-up"></i>
                                        <img src={leaders[1]?.profileImage} alt="" className="photo" />
                                        <p className="link">{leaders[1]?.username}</p>
                                        <p className="points">{leaders[1]?.PP}PP</p>
                                    </div> : null
                                }
                                <div className="person first">
                                    <div className="num">1</div>
                                    <i className="fas fa-crown"></i>
                                    <img src={leaders[0]?.profileImage} alt="" className="photo main" />
                                    <p className="link">{leaders[0]?.username}</p>
                                    <p className="points">{leaders[0]?.PP}PP</p>
                                </div>
                                {leaders.length >= 3 ?
                                    <div className="person third">
                                        <div className="num">3</div>
                                        <i className="fas fa-caret-up"></i>
                                        <img src={leaders[2]?.profileImage} alt="" className="photo" />
                                        <p className="link">{leaders[2]?.username}</p>
                                        <p className="points">{leaders[2]?.PP}PP</p>
                                    </div> : null
                                }
                            </div>
                            {leaders.length >= 4 ?
                                leaders.map((leader: any, index: number, array: any) => (
                                    (index >= 3) ?
                                        <div key={leader.id} className="rest">
                                            <div className="others flex">
                                                <div className="rank">
                                                    <i className="fas fa-caret-up"></i>
                                                    <p className="num">{index + 1}</p>
                                                </div>
                                                <div className="info flex">
                                                    <img src={leader?.profileImage} alt="" className="p_img" />
                                                    <p className="link">{leader?.username}</p>
                                                    <p className="points">{leader?.PP}PP</p>
                                                </div>
                                            </div>
                                        </div> : null)) : null
                            }
                        </div>
                    </div>
                </div>
            </div>

            <p className="LBTitle" >Leaderboard</p>
            <div className="LBBody" >
                <div id="leaderboard-slides" >
                    <div className="leaderboard" >
                        <div className="profile">
                            {leaders.length >= 2 ?
                                <div className="person second">
                                    <div className="num">2</div>
                                    <i className="fas fa-caret-up"></i>
                                    <img src={leaders[1]?.profileImage} alt="" className="photo" />
                                    <p className="link">{leaders[1]?.username}</p>
                                    <p className="points">{leaders[1]?.PP}PP</p>
                                </div> : null
                            }
                            <div className="person first">
                                <div className="num">1</div>
                                <i className="fas fa-crown"></i>
                                <img src={leaders[0]?.profileImage} alt="" className="photo main" />
                                <p className="link">{leaders[0]?.username}</p>
                                <p className="points">{leaders[0]?.PP}PP</p>
                            </div>
                            {leaders.length >= 3 ?
                                <div className="person third">
                                    <div className="num">3</div>
                                    <i className="fas fa-caret-up"></i>
                                    <img src={leaders[2]?.profileImage} alt="" className="photo" />
                                    <p className="link">{leaders[2]?.username}</p>
                                    <p className="points">{leaders[2]?.PP}PP</p>
                                </div> : null
                            }
                        </div>
                        {leaders.length >= 4 ?
                            leaders.map((leader: any, index: number, array: any) => (
                                (index >= 3) ?
                                    <div key={leader.id} className="rest">
                                        <div className="others flex">
                                            <div className="rank">
                                                <i className="fas fa-caret-up"></i>
                                                <p className="num">{index + 1}</p>
                                            </div>
                                            <div className="info flex">
                                                <img src={leader?.profileImage} alt="" className="p_img" />
                                                <p className="link">{leader?.username}</p>
                                                <p className="points">{leader?.PP}PP</p>
                                            </div>
                                        </div>
                                    </div> : null)) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}