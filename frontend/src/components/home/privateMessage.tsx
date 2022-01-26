import { ArrowSmUp, Backspace } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useCookies } from 'react-cookie'
import { ip } from '../../App'
import { useForceUpdate } from '../../utils/forceUpdate'
import { MessageType } from '../../utils/message.type'
import { RequestApi } from '../../utils/RequestApi.class'

export function Open_Message() {
    var Message: any = document.getElementById('Message')
    var arrowR: any = document.getElementById('arrowR')
    var arrowL: any = document.getElementById('arrowL')
    if (Message.style.height === '400px') {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '50px'
        Message.style.overflowY = 'hidden'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
    }
    else {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '400px'
        Message.style.overflowY = 'scroll'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
    }
}


export default function PrivateMessage({currentChat, setCurrentChat, me}: any) {
    const [isConvOpen, setisConvOpen] = useState<any>(false);
    const [conversations, setConversations] = useState<MessageType[]>();
    const [messageInput, setMessageInput] = useState("");
    const [cookies] = useCookies();
	const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<MessageType[]>([]);

    const forceUpdate = useForceUpdate();

    const requestApi = new RequestApi(cookies.access_token, ip);
    
    useEffect(() => {
        if (currentChat !== "") {
            setisConvOpen(true);
        }
	}, [currentChat]);
    
    useEffect(() => {
        let mount = true;
		if (mount) {
            setSocket(io(`ws://${ip}:5001`, { transports: ['websocket'] }));
            setConversations([]);
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies]);
    
    useEffect(() => {
        let mount = true;
		if (mount) {
            if (socket) {
				socket.on(`private_message/${me?.username}`, (msg: any) => {
                    console.log(conversations)
                    const convIndex = conversations?.findIndex((obj => obj.receiver === currentChat));
                    console.log(convIndex);
                    if (convIndex === -1) {
					    conversations?.push({ id: messages.length, sentAt: msg.sentAt, sender: msg.sender.username, body: msg.body, avatar: msg.receiver.profileImage, receiver: msg.receiver.username });
					    forceUpdate();
                    } else if (conversations) {
                        conversations[convIndex!].body = msg.body;
                    }
				})
			}
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, cookies, messages]);
    
    /*useEffect(() => {
		let mount = true;
		if (mount) {
			if (currentChat) {
				requestApi.get(`channel/messages/${currentChat}`).then((response: any) => {
					response.messages.map((msg: any) =>
						messages.push({ id: messages.length, sentAt: msg.date, sender: msg.sender.username, body: msg.content, avatar: msg.sender.profileImage })
					);
					forceUpdate();
				})
			}
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies, messages, currentChat]);*/
    
    function handleSendMessage(e: any) {
        if (messageInput) {
			if (socket) {
				socket.emit('private_message', { sentAt: Date(), body: messageInput, receiver: currentChat });
                messages.push({ id: messages.length, sentAt: Date(), sender: me?.username, body: messageInput, avatar: me?.profileImage, receiver: currentChat });
			}
			setMessageInput('');
		}
        e.preventDefault();
    }

    function handleSelectConversation(receiver: string) {
        if (socket) {
            socket.emit('change_conversation', {conversationName: receiver});
            setCurrentChat(receiver);
        }
        setMessages([]);
        setisConvOpen(true);
    }

    return (
        <div id="Message" >
            <div id="OpenMsg" onClick={() => { Open_Message(); setCurrentChat(""); setisConvOpen(false) }}>
                <ArrowSmUp id="arrowR" />Message
                <ArrowSmUp id="arrowL" />
            </div>
            <div className="scrollMessageContainer">
            {
                isConvOpen === false ? conversations?.map((message: any) => (
                    <article key={message.id} id='message-container' onClick={(e) => handleSelectConversation(message.receiver)}>
                            <div>
                                <img id="message-image" style={{ backgroundImage: `url(${message.avatar})` }} alt="" />
                            </div>
                            <div id="message-body" >
                                <header id='message-header'>
                                    <h4 id='message-sender'>{message.receiver}</h4>
                                    <span id='message-time'>
                                        {new Date(message.sentAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                                    </span>
                                </header>
                                <p id='message-text'>{message.body}</p>
                            </div>
                    </article>
                    
                )) :
                    <div>
                        <section className='discussion' >
                            <Backspace onClick={e => { setCurrentChat(""); setisConvOpen(false) }} />
                            {
                                messages.map((messages: any) => (
                                    messages.sender === me.username ?
                                        <div className="bubble sender"> {messages.body} </div> :
                                        <div className="bubble recipient"> {messages.body} </div>
                                ))
                            }
                        </section>
                        <form onSubmit={handleSendMessage} >
                            <input type="text" className="privateMessageInput" placeholder="Message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                        </form>
                    </div>
            }
            </div>
        </div>
    )
}
