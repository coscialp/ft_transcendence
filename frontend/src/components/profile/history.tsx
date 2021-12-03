import './profile.css'

export function History() {

    return (
            <div className="History" >
                <img className="HistoryImage" style={{backgroundImage: `url(${ localStorage.getItem("ProfilePicture") })`}} alt="" />
                <p className="Score"> 11 : 5 <br/> WIN </p>
                <img className="HistoryImage" style={{backgroundImage: `url(${ localStorage.getItem("ProfilePicture") })`}} alt="" />
			</div>
    )
}