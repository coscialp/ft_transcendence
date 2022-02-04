import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './profile.css'

export function History(data : any) {
	let history = useHistory();
    const [game, setGame]: any = useState({});

    /*if (game.winner === data.me.username) {
        document.getElementById("History")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
    }*/
    
    return (
            <div id="History" onClick={() => {return history.push("/history") } } >
			</div>
    )
}
/*<img className="HistoryImage" style={{backgroundImage: `url(${ game.game.player1.profileImage })`}} alt="" />
<p className="Score"> {game.game.score1} : {game.game.score2} <br/> {game.winner === data.me.username ? <p>WIN</p> : <p>LOSE</p> } </p>
<img className="HistoryImage" style={{backgroundImage: `url(${ game.game.player2.profileImage })`}} alt="" />*/