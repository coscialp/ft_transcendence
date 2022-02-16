import axios from 'axios';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { ip } from '../../App';
import './profile.css'
import './allHistory.css'
import { isLogged } from '../../utils/isLogged';
import { Redirect, useHistory } from 'react-router-dom';
import { NavBar } from '../navbar/navbar';

export default function AllHistory() {

    let history = useHistory();
    const [cookies] = useCookies();
    const userHistory = window.location.pathname.split('/')[1];
    const [game, setGame]: any = useState([]);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        let mount = true;
        if (mount) {
            isLogged(cookies).then((res) => { setUnauthorized(res.unauthorized) });
        }
        return (() => { mount = false; });
    }, [cookies])

    useEffect(() => {
        let mount = true;
        if (mount) {

            axios.request({
                url: `/game/${userHistory}`,
                method: 'get',
                baseURL: `http://${ip}:5000`,
                headers: {
                    "Authorization": `Bearer ${cookies.access_token}`,
                }
            }).then((response: any) => {
                setGame(response.data);
            })
        }
        return (() => { mount = false; });
    }, [cookies, userHistory])

    if (!cookies.access_token || unauthorized) {
        return (<Redirect to="/" />);
    }

    return (
        <div>
            <div className='ALlHistoryElement' >
                <div className="ALlHistoryMain" >
                    {game.map((games: any, index: any, array: any) => (
                        (array.length - 6 <= index) ?
                            <div id="all-History" key={games?.game.id} style={games?.winner === userHistory ? { backgroundColor: "rgba(0, 141, 177, 0.39)" } : { backgroundColor: "rgb(147 63 63 / 39%)" }} >
                                <img className="all-HistoryImage" onClick={(e) => { return history.push(`/${games?.game.player1.username}/profile`) }} style={{ backgroundImage: `url(${games?.game.player1.profileImage})` }} alt="" />
                                <p className="all-Score"> <span style={{ fontSize: `2vh` }} >{new Date(games?.game.date).toLocaleTimeString(undefined, { timeStyle: 'short' })}</span> <br/> {games?.game.score1} : {games?.game.score2} <br /> {games?.winner === userHistory ? "WIN" : "LOSE"} </p>
                                <img className="all-HistoryImage" onClick={(e) => { return history.push(`/${games?.game.player2.username}/profile`) }} style={{ backgroundImage: `url(${games?.game.player2.profileImage})` }} alt="" />
                            </div>
                            : null
                    ))
                    }
                </div>
            </div>
        </div>
    )
}