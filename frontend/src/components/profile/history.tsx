import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { ip } from '../../App';
import './profile.css'

export function History(data: any) {
    let history = useHistory();
    const [game, setGame]: any = useState({});
    const [cookies] = useCookies();

    useEffect(() => {
        let mount = true;
        if (mount) {

            axios.request({
                url: '/game/me/last',
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
    }, [cookies, data.me])

    if (game.game !== undefined && game?.winner === data.me.username) {
        document.getElementById("History")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
    }

    return (
        <div>
            {game.game !== undefined ?
                <div id="History" onClick={() => { return history.push(`/${data.user.username}/history`) }} >
                    <img className="HistoryImage" style={{ backgroundImage: `url(${game?.game.player1.profileImage})` }} alt="" />
                    <p className="Score"> {game?.game.score1} : {game?.game.score2} <br /> {game?.winner === data.me.username ? <p>WIN</p> : <p>LOSE</p>} </p>
                    <img className="HistoryImage" style={{ backgroundImage: `url(${game?.game.player2.profileImage})` }} alt="" />
                </div>
                :
                <div id="History" onClick={() => { return history.push(`/${data.user.username}/history`) }}>
                    This is your match history ! Launch your first game to see it !
                </div>
            }
        </div>
    )
}