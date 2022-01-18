import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ip } from '../../App';
import { UserAdd, Ban, Pencil } from 'heroicons-react'
import './profile.css'
import { useHistory } from 'react-router';

export function Overall(data: any) {
	const [cookies] = useCookies();
	let history = useHistory();

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

	function handleBlacklist(friendToDelete: any) {
		console.log(friendToDelete)
		axios.request({
		  url: '/user/blacklist/add',
		  method: 'patch',
		  baseURL: `http://${ip}:5000`,
		  headers: {
			"Authorization": `Bearer ${cookies.access_token}`,
		  },
		  data: {
			'newBlackListId': friendToDelete.username
		  }
		})
	  }

	return (
		<div className="ImgName" >
			{ (data.user.username === data.me.username) ?
			<div className='profile-imgpencil'>
				<img className="ProfileImage" style={{ backgroundImage: `url(${data.user.profileImage})` }} alt=""></img>
				<Pencil className='profile-pencil' onClick={e => {return history.push(`/settings`)}} />
				{data.user.isLogged ? <div className='userLogged' /> : <div className='userNotLogged' />}
			</div> :
			<div className='profile-img'>
				<img className="ProfileImage" style={{ backgroundImage: `url(${data.user.profileImage})` }} alt=""></img>
				{data.user.isLogged ? <div className='userLogged' /> : <div className='userNotLogged' />}
			</div>
			}
			<p className="ProfileName" > {data.user.firstName} "{data.user.nickName}" {data.user.lastName} </p>
			<p className="Stats" >
				Rank : (insert rank)<br />
				Winrate : (insert winrate ratio)%<br />
				Point Average : (insert KDA ratio)
			</p>
			{(data.user.username !== data.me.username) ? <UserAdd onClick={handleAddfriend} /> : null}
			{(data.user.username !== data.me.username) ? <Ban onClick={handleBlacklist} /> : null}
		</div>
	)
}