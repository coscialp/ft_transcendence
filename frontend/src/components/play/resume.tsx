import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect, useHistory } from 'react-router-dom';
import { ip } from '../../App';
import { isLogged } from '../../utils/isLogged';
import { scoreDifferenceLooser, scoreDifferenceWinner } from '../../utils/scoreDifference';
import './resume.css'

let game = {
    player1: {
        profileImage: "https://cdn.intra.42.fr/users/akerdeka.jpg",
        username: "akerdeka"
    },
    score1: "11",
    player2: {
        profileImage: "https://cdn.intra.42.fr/users/wasayad.jpg",
        username: "wasayad"
    },
    score2: "2",
    winner: "wasayad",
    scoreDifference: 10,
    ranked: true,
}


export default function Resume() {

    let history = useHistory();
    const [unauthorized, setUnauthorized] = useState(false);
	const [me, setMe]: any = useState({});
    const [cookies, setCookies] = useCookies();
    const [scoreDifference, setScoreDifference] = useState("");
	
	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
		}
		return (() => { mount = false; });
	}, [cookies])


    useEffect(() => {
		let mount = true;
		if (mount) {
            console.log(me)
			if (game.winner === me.username) {
                document.getElementById("resume-all-score")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
                setScoreDifference(scoreDifferenceWinner[game.scoreDifference]);
            } else {
                setScoreDifference(scoreDifferenceLooser[game.scoreDifference]);
            }
		}
		return (() => { mount = false; });
	}, [me])

    if (!cookies.access_token || unauthorized) {
		return (<Redirect to="/" />);
	}

    function logout(): void {
        axios.request({
          url: '/auth/logout',
          method: 'patch',
          baseURL: `http://${ip}:5000`,
          headers: {
            "Authorization": `Bearer ${cookies.access_token}`,
          }
        });
        setCookies("access_token", "");
        history.push("/");
      }

    return (
        <div>
            <div className="ResumeElement">
                <div id="ResumeMain">
                    <div id='resume-all-score' >
                        <img className="resume-image" style={{ backgroundImage: `url(${game.player1.profileImage})` }} alt="" />
                        <p className="resume-score"> {game.score1} : {game.score2} </p>
                        <img className="resume-image" style={{ backgroundImage: `url(${game.player2.profileImage})` }} alt="" />
                    </div>
                    <p className='score-difference' > {scoreDifference} </p>
                    {game.ranked ?
                    <div id="ranked-points">
                        <p id="actual-points" >587 PP</p>
                        <p id="new-points" >+18 PP</p>
                    </div> : null }
                    {game.scoreDifference === 10 && game.winner !== me.username ?
                        <button className="neonTextNF" onClick={ logout }>Logout...</button>
                     :
                        <button className="neonTextNF" onClick={ () => { return history.push("/") } }>Go home !</button>
                     }
                </div>
            </div>
        </div>
    );
}