import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect, useHistory } from 'react-router-dom';
import { ip } from '../../App';
import { isLogged } from '../../utils/isLogged';
import { scoreDifferenceLooser, scoreDifferenceWinner } from '../../utils/scoreDifference';
import './resume.css'


export default function Resume() {
  
    let history = useHistory();
    const [unauthorized, setUnauthorized] = useState(false);
	const [me, setMe]: any = useState({});
    const [cookies, setCookies] = useCookies();
    const [scoreDifference, setScoreDifference] = useState("");
    const [game, setGame]: any = useState();
	
	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });
		}
		return (() => { mount = false; });
	}, [cookies])

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
	}, [cookies, me])


    useEffect(() => {
		let mount = true;
		if (mount) {
			if (game?.winner === me?.username) {
                document.getElementById("resume-all-score")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
                setScoreDifference(scoreDifferenceWinner[game?.scoreDifference]);
                document.getElementById("score-difference")!.style.color = "rgb(54 143 194)";
            } else {
                document.getElementById("resume-all-score")!.style.backgroundColor = "rgb(147 63 63 / 39%)";
                setScoreDifference(scoreDifferenceLooser[game?.scoreDifference]);
                document.getElementById("score-difference")!.style.color = "#fd5454f0";
            }
		}
		return (() => { mount = false; });
	}, [me, game])

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
                        <img className="resume-image" style={{ backgroundImage: `url(${game?.game.player1.profileImage})` }} alt="" />
                        <div className="resume-score"> {game?.game.score1} : {game?.game.score2} </div>
                        <img className="resume-image" style={{ backgroundImage: `url(${game?.game.player2.profileImage})` }} alt="" />
                    </div>
                    <div id='score-difference' > {scoreDifference} </div>
                    {game?.game.ranked === true ?
                    <div id="ranked-points">
                        <div id="actual-points" >{me.PP} PP</div>
                        <div id="new-points" > {game?.winner === me.username ? `+` : `-` } {game?.PPaverage} PP</div>
                    </div> : null }
                    {game?.scoreDifference === 10 && game?.winner !== me.username ?
                        <button className="resume-go-home" onClick={ logout }>Logout</button>
                     :
                        <button className="resume-go-home" onClick={ () => { return history.push("/home") } }>Go home !</button>
                     }
                </div>
            </div>
        </div>
    );
}