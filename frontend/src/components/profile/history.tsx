import './profile.css'

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
    winner: "akerdeka",
    scoreDifference: 10,
    ranked: true,
}

export function History(data : any) {

    if (game.winner === data.me.username) {
        document.getElementById("History")!.style.backgroundColor = "rgba(0, 141, 177, 0.39)";
    }

    return (
            <div id="History" >
                <img className="HistoryImage" style={{backgroundImage: `url(${ game.player1.profileImage })`}} alt="" />
                <p className="Score"> {game.score1} : {game.score2} <br/> {game.winner === data.me.username ? <p>WIN</p> : <p>LOSE</p> } </p>
                <img className="HistoryImage" style={{backgroundImage: `url(${ game.player2.profileImage })`}} alt="" />
			</div>
    )
}