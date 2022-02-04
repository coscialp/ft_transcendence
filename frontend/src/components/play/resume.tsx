import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect, useHistory } from 'react-router-dom';
import { ip } from '../../App';
import { isLogged } from '../../utils/isLogged';
import { scoreDifferenceLooser, scoreDifferenceWinner } from '../../utils/scoreDifference';
import './resume.css'

/*let game = {
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
}*/


export default function Resume() {
  
    let history = useHistory();
    const [unauthorized, setUnauthorized] = useState(false);
	const [me, setMe]: any = useState({});
    const [cookies, setCookies] = useCookies();
    const [scoreDifference, setScoreDifference] = useState("");
    // eslint-disable-next-line
    const [game, setGame]: any = useState({});
	
	useEffect(() => {
		let mount = true;
		if (mount) {
            console.log("Test de Julien a nouveau")
			isLogged(cookies).then((res) => { setMe(res.me.data); setUnauthorized(res.unauthorized) });
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
                  console.log(response);
                    setGame(response.data);
              })
		}
		return (() => { mount = false; });
	}, [cookies, me])


    useEffect(() => {
		let mount = true;
		if (mount) {
			if (game?.winner === me.username) {
                document.getElementById("resume-all-score")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
                setScoreDifference(scoreDifferenceWinner[game?.scoreDifference]);
                document.getElementById("score-difference")!.style.color = "rgb(54 143 194)";
            } else {
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
      console.log(game);
    return (
        <div>
            {/* <div className="ResumeElement">
                <div id="ResumeMain">
                    <div id='resume-all-score' >
                        <img className="resume-image" style={{ backgroundImage: `url(${game?.game.player1.profileImage})` }} alt="" />
                        <p className="resume-score"> {game?.game.score1} : {game?.game.score2} </p>
                        <img className="resume-image" style={{ backgroundImage: `url(${game?.game.player2.profileImage})` }} alt="" />
                    </div>
                    <p id='score-difference' > {scoreDifference} </p>
                    {game?.game.ranked ?
                    <div id="ranked-points">
                        <p id="actual-points" >{me.PP} PP</p>
                        <p id="new-points" >+18 PP</p>
                    </div> : null }
                    {game?.scoreDifference === 10 && game?.winner !== me.username ?
                        <button className="resume-go-home" onClick={ logout }>Logout</button>
                     :
                        <button className="resume-go-home" onClick={ () => { return history.push("/") } }>Go home !</button>
                     }
                </div>
            </div> */}
        </div>
    );
}