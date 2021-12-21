import React from "react";
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
	popupState: number,
	channelName: string,
	channelPassword: string,
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
			popupState: 0,
			channelName: "",
			channelPassword: "",
		}
		this.socket = io(`ws://${ip}:5001`, { transports: ['websocket'] });

		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.handleGetMessage = this.handleGetMessage.bind(this);
		this.changeChannel = this.changeChannel.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.AddChannelPopup = this.AddChannelPopup.bind(this);
		this.handleCreateNewChannel = this.handleCreateNewChannel.bind(this);
	}

	componentDidMount() {
		this.socket.on('msg_toClient', (msg: any) => {
			this.state.messages.push({ id: this.state.messages.length, sentAt: msg.sentAt, sender: msg.sender, body: msg.body, avatar: msg.avatar });
			this.forceUpdate();
		});
	}

	/*const scrollRef = React.createRef<HTMLInputElement>();
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({behavior: "smooth",});
		}*/

	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}

	handleCreateNewChannel(e: any) {
		if (this.state.channelName === "") {
			window.alert("Channel's name cannot be empty !")
		}
		else {
			if (this.state.channelList.find((name: string) => (name === this.state.channelName))) {
				window.alert("Channel's name already taken !")
			}
			else {
				this.togglePopup();
				this.state.channelList.push(this.state.channelName);
				this.setState({channelName: "", channelPassword: "", popupState: 0});
			}
		}
		e.preventDefault()
	}

	AddChannelPopup() {
		return (
			<div className="Popup inner">
				<div className="Chan Popup">
					{this.state.popupState === 0 ?
						<div className="AJCbtn" >
							<button className="AddJoinChan" onClick={(e) => { this.setState({ popupState: 1 }) }} > <img className="AddJoinImg" alt="" src="img/CreateServer.svg" />Create your channel</button>
							<button className="AddJoinChan" onClick={(e) => { this.setState({ popupState: 2 }) }} > <img className="AddJoinImg" alt="" src="img/JoinServer.svg" />Join a channel</button>
						</div>
						:
						this.state.popupState === 1 ?
							<div className="AddChan">
								<form onSubmit={this.handleCreateNewChannel} >
									<input type="text" className="AJCplaceholder" placeholder="Channel name" value={this.state.channelName} onChange={(e) => this.setState({ channelName: e.target.value })} />
									<input type="password" className="AJCplaceholder" placeholder="Password (optionnal)" value={this.state.channelPassword} onChange={(e) => this.setState({ channelPassword: e.target.value })} />
									<input type="submit" className="subbtn" value="Create !" />
								</form>
								<button className="Backbtn" onClick={(e) => { this.setState({ popupState: 0 }) }} >Back</button>
							</div>
							:
							<div className="JoinChan">
								<form onSubmit={this.handleCreateNewChannel} >
									<input type="text" className="AJCplaceholder" placeholder="Channel name" value={this.state.channelName} onChange={(e) => this.setState({ channelName: e.target.value })} />
									<input type="password" className="AJCplaceholder" placeholder="Password (optionnal)" value={this.state.channelPassword} onChange={(e) => this.setState({ channelPassword: e.target.value })} />
									<input type="submit" className="subbtn" value="Create !" />
								</form>
								<button className="Backbtn" onClick={(e) => { this.setState({ popupState: 0 }) }} >Back</button>
							</div>
					}
					<button className="Cancelbtn" onClick={(e) => { this.togglePopup(); this.setState({ popupState: 0 }) }} >Cancel</button>
				</div>
			</div>
		)
	}

	handleGetMessage(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ messageInput: e.target.value });
		e.preventDefault();
	}

	handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
		if (this.state.messageInput) {
			console.log(this.state.messageInput);
			this.socket.emit('msg_toServer', { sentAt: Date(), body: this.state.messageInput });
			this.setState({ messageInput: '' });
		}
		e.preventDefault();
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
					<button className="addChannel" onClick={this.togglePopup}>+</button>
				</div>
				<div className="Message Container" >
					{this.state.messages.map((message: any) => (
						<article key={message.id} className='message-container'>
							<div>
								<img className="message-image" style={{ backgroundImage: `url(${message.avatar})` }} alt="" />
							</div>
							<div className="message-body" >
								<header className='message-header'>
									<h4 className='message-sender'>{message.sender === me.data.username ? 'You' : message.sender}</h4>
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