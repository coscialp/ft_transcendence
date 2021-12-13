import React, { MouseEventHandler } from "react";
import { io, Socket } from "socket.io-client";
import './mainMenu.css'

const ip = window.location.hostname;
const me = JSON.parse(sessionStorage.getItem("me") || '{}');

type MessageType = {
	id: number;
	sentAt: string | null;
	sender: string;
	body: string;
	avatar: string;
}

type StateType = {
	messages: MessageType[],
	messageInput: string,
	channelList: string[],
	showPopup: boolean,
	scrollTarget: any,
}

export class MainMenu extends React.Component<any, StateType> {
	private socket: Socket;

	constructor(props: any, socket: Socket) {
		super(props);
		this.state = {
			messages: [],
			messageInput: '',
			channelList: ['General'],
			showPopup: false,
			scrollTarget: null,
		}
		this.socket = io(`ws://${ip}:5001`, { transports: ['websocket'] });

		this.handleAddChannel = this.handleAddChannel.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.handleGetMessage = this.handleGetMessage.bind(this);
		this.changeChannel = this.changeChannel.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.AddChannelPopup = this.AddChannelPopup.bind(this);
	}

	componentDidMount() {
		this.socket.on('msg_toClient', (msg: any) => {
			console.log(`msg: ${msg}`);
			this.state.messages.push({ id: this.state.messages.length, sentAt: msg.sentAt, sender: msg.sender, body: msg.body, avatar: msg.avatar});
			this.forceUpdate();
		});
	}


	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}

	AddChannelPopup() {
		return (
			<div className="Popup inner">
				<div className="Chan Popup">
					<div className="AJCbtn" >
						<button className="AddJoinChan" > <img className="AddJoinImg" alt="" src="img/CreateServer.svg" />Create your channel</button>
						<button className="AddJoinChan" > <img className="AddJoinImg" alt="" src="img/JoinServer.svg" />Join a channel</button>
					</div>
					<button className="Cancelbtn" onClick={this.togglePopup} >Cancel</button>
				</div>
			</div>
		)
	}

	handleGetMessage(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ messageInput: e.target.value });
		e.preventDefault();
	}

	handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
		console.log(this.state.messageInput);
		this.socket.emit('msg_toServer', {sentAt: Date(), sender: me.data.nickName, body: this.state.messageInput, avatar: me.data.profileImage});
		this.setState({ messageInput: '' });
		e.preventDefault();
	}

	handleAddChannel() {
		this.state.channelList.push("TEST");
		this.togglePopup();
	}

	changeChannel(e: any) {
		console.log(e.target.innerText);
		this.setState({ messages: [] });
		e.preventDefault();
	}

	render() {
		return (
			<div className="MainElement" >
				<div className="Channel List" >{this.state.channelList.map((channel: any) => (
					<p key={channel} onClick={this.changeChannel} className="channelName">{channel}</p>
				))}
					<button className="addChannel" onClick={this.handleAddChannel}>+</button>
				</div>
				<div className="Message Container" >
					{this.state.messages.map((message: any) => (
						<article key={message.id} className='message-container'>
							<div>
								<img className="message-image" style={{ backgroundImage: `url(${message.avatar})` }} alt="" />
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
					<div ref={this.state.scrollTarget} />
				</div>
				<form onSubmit={this.handleSendMessage} >
					<input type="text" className="MainSendMessage" placeholder="Message..." value={this.state.messageInput} onChange={(e) => this.setState({ messageInput: e.target.value })} />
				</form>
				{this.state.showPopup ? <this.AddChannelPopup /> : null}
			</div>
		)
	}
}