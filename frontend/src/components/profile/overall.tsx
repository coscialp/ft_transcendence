import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ip } from '../../App';
import './profile.css'

export function Overall(data: any) {
	const [cookies] = useCookies();

	function handleAddfriend() {
		axios.request({
			url: `/user/friends/request`,
			method: 'post',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
			data: {
				'newFriendId': data.user.username,
			}
		}).then((response: any) => {
			console.log(response);
		})
	}

	return (
		<div className="ImgName" >
			<div>
				<img className="ProfileImage" style={{ backgroundImage: `url(${data.user.profileImage})` }} alt="" />
				{data.user.isLogged ? <div className='userLogged' /> : <div className='userNotLogged' />}
			</div>
			<p className="ProfileName" > {data.user.firstName} "{data.user.nickName}" {data.user.lastName} </p>
			<p className="Stats" >
				Rank : (insert rank)<br />
				Winrate : (insert winrate ratio)%<br />
				Point Average : (insert KDA ratio)
			</p>
			{(data.user.username !== data.me.username) ? <img className="Add friend" src="/img/AddFriend.png" alt="" onClick={handleAddfriend} /> : null}
		</div>
	)
}