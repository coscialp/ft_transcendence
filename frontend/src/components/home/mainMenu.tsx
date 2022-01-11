import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { io, Socket } from "socket.io-client";
import { isLogged } from "../../utils/isLogged";
import './mainMenu.css'

const ip = window.location.hostname;

type MessageType = {
	id: number;
	sentAt: string;
	sender: string;
	body: string;
	avatar: string;
}

type User = {
	id: string,
	username: string,
	password: string | null,
	firstName: string,
	lastName: string,
	nickName: string,
	isLogged: boolean,
	profileImage: string,
	email: string,
}

function useForceUpdate() {
	// eslint-disable-next-line
	const [value, setValue] = useState(0);
	return () => setValue(value => ++value);
}

export function MainMenu() {
	const [cookies] = useCookies();
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [messageInput, setMessageInput] = useState<string>('');
	// eslint-disable-next-line
	const [channels, setChannels] = useState<string[]>(['General']);
	const [channelName, setChannelName] = useState<string>('');
	const [channelPassword, setChannelPassword] = useState<string>('');
	const [popupState, setPopupState] = useState<number>(0);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	// eslint-disable-next-line
	const [scrollTarget, setScrollTarget] = useState();
	const [me, setMe] = useState<User>();
	const [socket, setSocket] = useState<Socket>();

	const forceUpdate = useForceUpdate();


	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setMe(res.me.data); });
			setSocket(io(`ws://${ip}:5001`, { transports: ['websocket'] }));
		}
		return (() => { mount = false; });
	}, [cookies]);

	useEffect(() => {
		let mount = true;
		if (mount) {
			if (socket) {
				socket.on('msg_toClient', (msg: any) => {
					console.log(`msg: ${msg}`);
					messages.push({ id: messages.length, sentAt: msg.sentAt, sender: msg.sender, body: msg.body, avatar: msg.avatar });
					forceUpdate();
				})
			}
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, cookies, messages]);



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
				channels.push(channelName);
				togglePopup();
				setChannelName('');
				setChannelPassword('');
				setPopupState(0);
			}
		}
		e.preventDefault()
	}

	function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
		if (messageInput) {
			console.log(messageInput);
			if (socket) {
				socket.emit('msg_toServer', { sentAt: Date(), body: messageInput });
			}
			setMessageInput('');
		}
		e.preventDefault();
	}


	function changeChannel(e: any) {
		console.log(e.target.innerText);
		setMessages([]);
		e.preventDefault();
	}

	return (
		<div className="MainElement" >
			<div className="Channel List" >{channels.map((channel: any) => (
				<p key={channel} onClick={changeChannel} className="channelName">{channel}</p>
			))}
				<button className="addChannel" onClick={togglePopup}>+</button>
			</div>
			<div className="Message Container" >
				{messages.map((message: any) => (
					<article key={message.id} className='message-container'>
						<div>
							<img className="message-image" style={{ backgroundImage: `url(${message.avatar})` }} alt="" />
						</div>
						<div className="message-body" >
							<header className='message-header'>
								<h4 className='message-sender'>{(me && message.sender === me.username) ? 'You' : message.sender}</h4>
								<span className='message-time'>
									{new Date(message.sentAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
								</span>
							</header>
							<p className='message-text'>{message.body}</p>
						</div>
					</article>
				))}
				<div ref={scrollTarget} />
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
								<form onSubmit={handleCreateNewChannel} >
									<input type="text" className="AJCplaceholder" placeholder="Channel name" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
									<input type="password" className="AJCplaceholder" placeholder="Password (optionnal)" value={channelPassword} onChange={(e) => setChannelPassword(e.target.value)} />
									<input type="submit" className="subbtn" value="Create !" />
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