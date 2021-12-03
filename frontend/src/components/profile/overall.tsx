import './profile.css'

export function Overall() {

    const user = JSON.parse(localStorage.getItem("me") || '{}');

    return (
            <div className="ImgName" >
				<img className="ProfileImage" style={{backgroundImage: `url(${ localStorage.getItem("ProfilePicture") })`}} alt="" />
				<p className="ProfileName" > {user.data.firstName} "{user.data.nickName}" {user.data.lastName} </p>
				<p className="Stats" >
					Rank : (insert rank)<br/>
					Winrate : (insert winrate ratio)%<br/>
					Point Average : (insert KDA ratio)
				</p>
			</div>
    )
}