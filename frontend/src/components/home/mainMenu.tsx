import { useEffect, useRef, useState } from "react";
import './mainMenu.css'

const ip = window.location.hostname;
const me = JSON.parse(sessionStorage.getItem("me") || '{}');



export function MainMenu() {

	const [messages, setMessages]: any = useState([]);
	const [messageBody, setMessageBody] = useState('');
	const [channelList, setChannel] = useState(["General"]);
	const [showPopup, setShowPopup] = useState(false);

	const MainChat: any = useRef();
	const scrollTarget: any = useRef(null);

	function togglePopup() {
		setShowPopup(!showPopup);
	}

	useEffect(() => {
		if (scrollTarget.current) {
			scrollTarget.current.scrollIntoView();
		}
	}, [messages.length]);

	useEffect(() => {

		MainChat.current = new WebSocket(`ws://${ip}:8081`);

		MainChat.current.onmessage = function (event: MessageEvent<any>) {

			const message = JSON.parse(event.data);
			setMessages((_messages: any) => [..._messages, message]);
			event.preventDefault()
		}
		return () => { };
	}, []);

	function AddChannelPopup() {
		return (
			<div className="Popup inner">
				<div className="Chan Popup">
					<div className="AJCbtn" >
						<button className="AddJoinChan" > <img className="AddJoinImg" alt="" src="img/CreateServer.svg" />Create your channel</button>
						<button className="AddJoinChan" > <img className="AddJoinImg" alt="" src="img/JoinServer.svg" />Join a channel</button>
					</div>
					<button className="Cancelbtn" onClick={togglePopup} >Cancel</button>
				</div>
			</div>
		)
	}

	function handleSendMessage(e: any) {
		MainChat.current.send(JSON.stringify({ sender: me.data.nickName, body: messageBody }));
		setMessageBody("");
		e.preventDefault()
	}

	function handleAddChannel(e: any) {
		setChannel((_channel: any) => [..._channel, _channel + "."]);
		togglePopup();
	}

	function changeChannel(event: any): any {
		console.log(event.target.innerText);
		setMessages([]);
	}

	return (
		<div className="MainElement" >
			<div className="Channel List" >{channelList.map((channel: any) => (
				<p key={channel} onClick={changeChannel} className="channelName">{channel}</p>
			))}
				<button className="addChannel" onClick={handleAddChannel}>+</button>
			</div>
			<div className="Message Container" >
				{messages.map((message: any) => (
					<article key={message.sentAt} className='message-container'>
						<div>
							<img className="message-image" style={{ backgroundImage: `url(${localStorage.getItem("ProfilePicture")})` }} alt="" />
						</div>
						<div className="message-body" >
							<header className='message-header'>
								<h4 className='message-sender'>{message.sender === me.data.nickName ? 'You' : message.sender}</h4>
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
				<input type="text" className="MainSendMessage" placeholder="Message..." value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
			</form>
			{showPopup ? <AddChannelPopup /> : null}
		</div>
	)
}