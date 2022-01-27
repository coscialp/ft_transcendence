import { ArrowSmUp, Backspace } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useForceUpdate } from '../../utils/forceUpdate'
import { MessageType } from '../../utils/message.type'
import { RequestApi } from '../../utils/RequestApi.class'
import { ip } from '../../App'
import { Conversation } from '../../utils/conversation.type'

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


export default function PrivateMessage({currentChat, setCurrentChat, me, socket}: any) {
    const [isConvOpen, setisConvOpen] = useState<any>(false);
    const [conversations, setConversations] = useState<MessageType[]>();
    const [property, setProperty] = useState<Conversation[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [cookies] = useCookies();
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
    
    useEffect(() => {
		let mount = true;
		if (mount) {
				requestApi.get(`channel/privmessages/${me?.username}`).then((response: any) => {
                    console.log(response)
					response.messages.map((msg: any) =>
						property.push({ property: msg.property, sender: msg.sender, reciver: msg.reciver })
					);
					forceUpdate();
				})
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies, property]);
    
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
    console.log(property);

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
