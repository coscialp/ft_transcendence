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
        if (mount && data?.user.username !== undefined) {

            axios.request({
                url: `/game/${data?.user?.username}/last`,
                method: 'get',
                baseURL: `http://${ip}:5000`,
                headers: {
                    "Authorization": `Bearer ${cookies.access_token}`,
                }
            }).then((response: any) => {
                if (mount) {
                    setGame(response.data);
                }
            })
        }
        return (() => { mount = false; });
    }, [cookies, data.user])

    if (game?.game !== undefined && game?.winner === data?.user?.username) {
        document.getElementById("History")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
    }


    return (
        <div className='HistoryMain'>
            {game.game !== undefined ?
                <div id="History" onClick={() => { return history.push(`/${data.user.username}/history`) }} >
                    <span className='HistoryNames'><img className="HistoryImage" style={{ backgroundImage: `url(${game?.game.player1.profileImage})` }} alt="" />{game?.game.player1.username}</span>
                    <p className="Score"> {game?.game.score1} : {game?.game.score2} <br /> {game?.winner === data?.user?.username ? "WIN" : "LOSE"} <br /> {game?.game.ranked ? game?.winner === data?.user.username ? `+${game?.PPaverage} PP` : `-${game?.PPaverage} PP` : null} </p>
                    <span className='HistoryNames'><img className="HistoryImage" style={{ backgroundImage: `url(${game?.game.player2.profileImage})` }} alt="" />{game?.game.player2.username}</span>
                </div>
                :
                <div id="History">
                    This is your match history ! Launch your first game to see it !
                </div>
            }
        </div>
    )
}