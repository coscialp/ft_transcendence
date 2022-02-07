import axios from 'axios';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { ip } from '../../App';
import './profile.css'
import './allHistory.css'

export default function AllHistory() {

    const [cookies] = useCookies();
    const userHistory = window.location.pathname.split('/')[1];
    const [game, setGame]: any = useState([]);

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
    }, [cookies])

    return (
        <div className='ALlHistoryElement' >
            <div className="ALlHistoryMain" >
                {game.map((games: any, index: any, array: any) => (
                    (array.length - 5 <= index) ? 
                        <div id="all-History" key={games?.game.id} style={games?.winner === userHistory ? {backgroundColor: "rgba(0, 141, 177, 0.39)"}: {backgroundColor: "rgb(147 63 63 / 39%)"} } >
                            <img className="all-HistoryImage" style={{ backgroundImage: `url(${games?.game.player1.profileImage})` }} alt="" />
                            <p className="all-Score"> {games?.game.score1} : {games?.game.score2} <br /> {games?.winner === userHistory ? "WIN" : "LOSE"} </p>
                            <img className="all-HistoryImage" style={{ backgroundImage: `url(${games?.game.player2.profileImage})` }} alt="" />
                        </div>
                        : null
                ))
                }
            </div>
        </div>
    )
}