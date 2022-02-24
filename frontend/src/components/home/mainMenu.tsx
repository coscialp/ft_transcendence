import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { RequestApi } from "../../utils/RequestApi.class";
import './mainMenu.css'

import { useHistory } from "react-router";
import { UserCircle, Play as Challenge, ChevronDoubleUp, Trash, VolumeOff, Cog, ChevronDoubleDown } from "heroicons-react";
import { useForceUpdate } from "../../utils/forceUpdate";
import { ip } from "../../App";
import { MessageType } from "../../utils/message.type";

import axios from "axios";
import { User } from "../../utils/user.type";

export function MainMenu(data: any) {
	let history = useHistory();
	const [cookies] = useCookies();
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [messageInput, setMessageInput] = useState<string>('');
	const [current_channel, setCurrent_Channel] = useState<string>('');
	const [channels] = useState<string[]>([]);
	const [channelAdmin, setChannelAdmin] = useState<User[]>([]);
	const [channelCreator, setChannelCreator] = useState<User>();
	const [channelName, setChannelName] = useState<string>('');
	const [channelPassword, setChannelPassword] = useState<string>('');
	const [popupState, setPopupState] = useState<number>(0);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const [updateAdmin, setUpdateAdmin] = useState<boolean>(false);
	const [myBlackList, setMyBlackList] = useState<User[]>([]);
	const scrollRef = useRef<any>();

	const requestApi = new RequestApi(cookies.access_token, ip);

	const forceUpdate = useForceUpdate();

	useEffect(() => {
		let mount = true;
		if (mount) {
			requestApi.get('user/channels/connected').then((response) => {
				if (mount) {
					response.channelsConnected?.map((chan: any) =>
						channels.push(chan.name)
					)
					forceUpdate();
				}
			})
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies]);

	useEffect(() => {
		let mount = true;
		if (mount && data.socket) {
			data.socket.on('update', () => {
				setUpdateAdmin(!updateAdmin);
			})
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies]);

	useEffect(() => {
		let mount = true;

		axios
			.request({
				url: `/user/me/blacklist`,
				method: "get",
				baseURL: `http://${ip}:5000`,
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((response: any) => {
				if (mount) {
					setMyBlackList(response.data.blackList);
				}
			});
		return () => {
			mount = false;
		};
	}, [cookies]);

	useEffect(() => {
		let mount = true;
		if (mount) {
			if (data.socket) {

				data.socket.on(`msg_toClient/${current_channel}`, (msg: any) => {
					if (myBlackList.findIndex((u) => u.username === msg.sender.username) === -1) {
						messages.push({ id: messages.length, date: msg.sentAt, sender: msg.sender.username, content: msg.body, avatar: msg.sender.profileImage });
						forceUpdate();
					}
				});
				data.socket.on('admin', (admin: any) => {

				});
			}
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.socket, cookies, messages]);

	function togglePopup() {
		setShowPopup(!showPopup);
	}

	function handleCreateNewChannel(e: any) {
		if (channelName === "") {
			window.alert("Channel's name cannot be empty !")
		}
		else {
			if (channels.find((name: string) => (name === channelName))) {
				window.alert("Channel's name already taken !")
			}
			else {
				const channelInfo = {
					name: channelName,
					password: channelPassword,
				}
				requestApi.post('channel/create', { body: channelInfo, contentType: 'application/json' });

				channels.push(channelName);
				if (data.socket) {
					data.socket.emit('change_channel', { channelName: channelName });
					setCurrent_Channel(channelName);
				}
				setMessages([]);
				togglePopup();
				setChannelName('');
				setChannelPassword('');
				setPopupState(0);
			}
		}
		e.preventDefault()
	}

	function handleJoinChannel(e: any) {
		if (channelName === "") {
			window.alert("Channel's name cannot be empty !")
		}
		else {
			const channelInfo = {
				name: channelName,
				password: channelPassword,
			}
			if (channels.findIndex((u) => u === channelName) === -1) {
				axios.request({
					url: `/channel/join`,
					method: "patch",
					baseURL: `http://${ip}:5000`,
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
					data: {
						"name": channelInfo.name,
						"password": channelInfo.password,
					},
				}).then((response) => {
					if (response.status === 200) {
						channels.push(channelName);
						if (data.socket) {
							data.socket.emit('change_channel', { channelName: channelName });
							setCurrent_Channel(channelName);
						}
						setMessages([]);
						togglePopup();
						setChannelName('');
						setChannelPassword('');
						setPopupState(0);
					}
				}).catch((error) => {
					window.alert("Wrong password !");
				})
			}
			else {
				window.alert(`You're already in the channel: ${channelName}`);
			}
		}
		e.preventDefault()
	}

	function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
		if (messageInput) {
			if (data.socket) {
				data.socket.emit('msg_toServer', { sentAt: Date(), body: messageInput, receiver: null });
			}
			setMessageInput('');
		}
		e.preventDefault();
	}

	useEffect(() => {
		let mount = true;
		if (mount) {
			axios.request({
				url: `/channel/${current_channel}`,
				method: 'get',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			}).then((response: any) => { if (mount) { setChannelCreator(response.data.creator); setChannelAdmin(response.data.admin) } })
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies, current_channel, updateAdmin]);

	useEffect(() => {
		let mount = true;
		if (mount) {
			if (current_channel) {
				requestApi.get(`channel/messages/${current_channel}`).then((response) => {
					// eslint-disable-next-line
					response.messages.map((msg: any) => {
						if (myBlackList.findIndex((u) => u.username === msg.sender.username) === -1) {
							messages.push({ id: messages.length, date: msg.date, sender: msg.sender.username, content: msg.content, avatar: msg.sender.profileImage })
						}
					});
					forceUpdate();
				})
			}
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies, messages, current_channel]);


	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length])


	function changeChannel(e: any) {
		if (data.socket) {
			data.socket.emit('change_channel', { channelName: e.target.innerText });
			setCurrent_Channel(e.target.innerText);
		}
		setMessages([]);
		e.preventDefault();
	}

	function handleRedirectToProfile(toGo: string) {
		return history.push(`/${toGo}/profile`)
	}

	function handlePromotion(id: string) {
		if (data.socket) {
			data.socket.emit('promote_admin', { id: id, channelName: current_channel });
		}
	}

	function handleNewPeon(id: string) {
		if (data.socket) {
			data.socket.emit('demote_admin', { id: id, channelName: current_channel });
		}
	}

	function handleMute(username: string) {
		if (data.socket) {
			data.socket.emit('mute_user', { mutedUser: username, channelName: current_channel });
		}
	}

	function handleBan(username: string) {
		if (data.socket) {

			data.socket.emit('ban_user', { id: username, channelName: current_channel });
		}
	}



	return (
		<div className="MainElement" >
			<div className="Channel List" >{channels.map((channel: any) => (
				<p key={channel} onClick={changeChannel} className="channelName">{channel}</p>
			))}
				<button className="addChannel" onClick={togglePopup}>+</button>
			</div>
			<div className="Message Container" >
				{messages.map((message: any) =>
				(
					<article ref={scrollRef} key={message.id} className='message-container'>
						<div className="img-content" >
							<img className="message-image" style={{ backgroundImage: `url(${message.avatar})` }} alt="" />
							<div className="message-body" >
								<header className='message-header'>
									<h4 className='message-sender' onClick={e => handleRedirectToProfile(message.sender)} >{(data.me && message.sender === data.me.username) ? 'You' : message.sender}</h4>
									<span className='message-time'>
										{new Date(message.date).toLocaleTimeString(undefined, { timeStyle: 'short' })}
									</span>
								</header>
								<p className='message-text'>{message.content}</p>
							</div>
						</div>
						<div className="dropdown" >
							<Cog className="dropbtn" />
							<div className="dropdown-content">
								<UserCircle className="chatUserParam" onClick={(e) => { return history.push(`/${message.sender}/profile`) }} />
								<Challenge className="chatUserParam" />
								{channelAdmin?.findIndex((u) => u.username === data.me.username) !== -1 && message.sender !== channelCreator?.username && message.sender !== data.me.username ?
									<>
										{channelCreator?.username === data.me.username ? (channelAdmin?.findIndex((u) => u.username === message.sender) !== -1 ? <ChevronDoubleDown className="chatUserParam" onClick={() => handleNewPeon(message.sender)} /> : <ChevronDoubleUp className="chatUserParam" onClick={() => handlePromotion(message.sender)} />) : null}
										<VolumeOff className="chatUserParam" onClick={() => handleMute(message.sender)} />
										<Trash className="chatUserParam" onClick={() => handleBan(message.sender)} />
									</>
									: null
								}
							</div>
						</div>
					</article>
				))}
			</div>
			<form onSubmit={handleSendMessage} >
				<input type="text" className="MainSendMessage" placeholder="Message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
			</form>
			{showPopup ? <div className="Popup inner">
				<div className="Chan Popup">
					{popupState === 0 ?
						<div className="AJCbtn" >
							<button className="AddJoinChan" onClick={(e) => { setPopupState(1) }}> <img className="AddJoinImg" alt="" src="img/CreateServer.svg" />Create your channel</button>
							<button className="AddJoinChan" onClick={(e) => { setPopupState(2) }} > <img className="AddJoinImg" alt="" src="img/JoinServer.svg" />Join a channel</button>
						</div>
						:
						popupState === 1 ?
							<div className="AddChan">
								<form onSubmit={handleCreateNewChannel} >
									<input type="text" className="AJCplaceholder" placeholder="Channel name" value={channelName} onChange={(e) => { setChannelName(e.target.value) }} />
									<input type="password" className="AJCplaceholder" placeholder="Password (optionnal)" value={channelPassword} onChange={(e) => (setChannelPassword(e.target.value))} />
									<input type="submit" className="subbtn" value="Create !" />
								</form>
								<button className="Backbtn" onClick={(e) => { setChannelName(''); setChannelPassword(''); setPopupState(0) }}>Back</button>
							</div>
							:
							<div className="JoinChan">
								<form onSubmit={handleJoinChannel} >
									<input type="text" className="AJCplaceholder" placeholder="Channel name" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
									<input type="password" className="AJCplaceholder" placeholder="Password (optionnal)" value={channelPassword} onChange={(e) => setChannelPassword(e.target.value)} />
									<input type="submit" className="subbtn" value="Join channel !" />
								</form>
								<button className="Backbtn" onClick={(e) => { setPopupState(0) }} >Back</button>
							</div>
					}
					<button className="Cancelbtn" onClick={(e) => { togglePopup(); setPopupState(0) }} >Cancel</button>
				</div>
			</div> : null}
		</div>
	)
}
