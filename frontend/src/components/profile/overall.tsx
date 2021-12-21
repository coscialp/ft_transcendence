import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ip } from '../../App';
import './profile.css'

export function Overall(data: any) {
	const userProfile = window.location.pathname.split('/')[1];
	const [user, setUser]: any = useState({});
	const [cookies] = useCookies();
	// const [me, setMe]: any = useState({});

	useEffect(() => {
		axios.request({
			url: `/user/${userProfile}`,
			method: 'get',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		}).then((response: any) => {
			setUser(response.data);
		})
	}, [userProfile, cookies]);

	// useEffect(() => {
	// 	axios.request({
	// 		url: `/user/me`,
	// 		method: 'get',
	// 		baseURL: `http://${ip}:5000`,
	// 		headers: {
	// 			"Authorization": `Bearer ${cookies.access_token}`,
	// 		}
	// 	}).then((response: any) => {
	// 		setMe(response.data);
	// 	})
	// }, [cookies]);


	function handleAddfriend() {
		axios.request({
			url: `/user/friends/request`,
			method: 'post',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
			data: {
				'newFriendId': user.username,
			}
		}).then((response: any) => {
			console.log(response);
		})
	}

	return (
		<div className="ImgName" >
			{console.log(data.me)}
			<div>
				<img className="ProfileImage" style={{ backgroundImage: `url(${user.profileImage})` }} alt="" />
				{user.isLogged ? <div className='userLogged' /> : <div className='userNotLogged' />}
			</div>
			<p className="ProfileName" > {user.firstName} "{user.nickName}" {user.lastName} </p>
			<p className="Stats" >
				Rank : (insert rank)<br />
				Winrate : (insert winrate ratio)%<br />
				Point Average : (insert KDA ratio)
			</p>
			{user.username !== data.me.username ? <img className="Add friend" src="/img/AddFriend.png" alt="" onClick={handleAddfriend} /> : null}
		</div>
	)
}