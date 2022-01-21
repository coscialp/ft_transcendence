import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ip } from '../../App';
import { UserAdd, Ban, Pencil, CheckCircle, ChevronDoubleUp, ChevronDoubleDown, BadgeCheck } from 'heroicons-react'
import './profile.css'
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { User } from './profile';


export function Overall(data: any) {
	const [cookies] = useCookies();
	let history = useHistory();
	const [myBlackList, setMyBlackList] = useState<User[]>([]);

	console.log(data.me)
	useEffect(() => {
		let mount = true;
	
		axios.request({
			url: `/user/me/blacklist`,
			method: 'get',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
		}).then((response: any) => {
			console.log(response)
			if (mount) { setMyBlackList(response.data.blackList) }
		})
		return (() => { mount = false; });
	}, [cookies])

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
		axios.request({
			url: '/user/blacklist/add',
			method: 'patch',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
			data: {
				'newBlackListId': friendToDelete
			}
		}).then(Response => {
			axios.request({
				url: `/user/friends/remove`,
				method: 'delete',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				data: {
					'idToDelete': friendToDelete,
				}
			}).then(Response => {
			axios.request({
				url: `/user/me/blacklist`,
				method: 'get',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			}).then((response: any) => {
				setMyBlackList(response.data.blackList)
			})})
		})
	}

	function handleWhitelist(friendToAdd: any) {
		axios.request({
			url: '/user/blacklist/remove',
			method: 'delete',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
			data: {
				'idToDelete': friendToAdd
			}
		}).then(Response => {
			axios.request({
				url: `/user/me/blacklist`,
				method: 'get',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			}).then((response: any) => {
				setMyBlackList(response.data.blackList)
			})
		})
	}

	function handlePromoteAdmin() {
		axios.request({
			url: `/user/admin/promote/${data.user.username}`,
			method: 'patch',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
		})
	}

	function handleDemoteAdmin() {
		axios.request({
			url: `/user/admin/demote`,
			method: 'patch',
			baseURL: `http://${ip}:5000`,
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
		})
	}

	return (
		<div className="ImgName" >
			{(data.user.isAdmin) ? <BadgeCheck /> : null}
			{(data.user.username === data.me.username) ?
				<div className='profile-imgpencil'>
					<img className="ProfileImage" style={{ backgroundImage: `url(${data.user.profileImage})` }} alt="" onClick={e => { return history.push(`/settings`) }} ></img>
					<Pencil className='profile-pencil' onClick={e => { return history.push(`/settings`) }} />
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
			<div className="user management">
				{(data.user.username !== data.me.username) ? (myBlackList.find((users) => users.username === data.user.username) ? <CheckCircle onClick={e => {handleWhitelist(data.user.username)}} /> : <><UserAdd onClick={handleAddfriend} /><Ban onClick={e => { handleBlacklist(data.user.username); } } /></>) : null }
				{(data.me.isAdmin && data.user.isAdmin === false && (data.user.username !== data.me.username)) ? <ChevronDoubleUp onClick={handlePromoteAdmin} /> : null }
				{(data.me.isAdmin && (data.user.username === data.me.username)) ? <ChevronDoubleDown onClick={handleDemoteAdmin} /> : null }
			</div>
		</div>
	)
}