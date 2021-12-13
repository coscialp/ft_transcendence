import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './profile.css'

export function Overall() {

    const me = JSON.parse(sessionStorage.getItem("me") || '{}');
	const userProfile = window.location.pathname.split('/')[1];
	const ip = window.location.hostname;
	const [cookies] = useCookies();
	const [user, setUser]: any = useState([]);	

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
	}, [userProfile, ip, cookies]);

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
				<img className="ProfileImage" style={{backgroundImage: `url(${ user.profileImage })`}} alt="" />
				<p className="ProfileName" > {user.firstName} "{user.nickName}" {user.lastName} </p>
				<p className="Stats" >
					Rank : (insert rank)<br/>
					Winrate : (insert winrate ratio)%<br/>
					Point Average : (insert KDA ratio)
				</p>
				{user.nickName !== me.data.nickName ? <img className="Add friend" src="/img/AddFriend.png" alt="" onClick={handleAddfriend} /> : null}
			</div>
    		)
}