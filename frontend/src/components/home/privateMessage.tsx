import { ArrowSmUp, Backspace } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { User } from '../../utils/user.type'
import { isLogged } from '../../utils/isLogged'
import { useCookies } from 'react-cookie'
import { ip } from '../../App'
import { useForceUpdate } from '../../utils/forceUpdate'


function Open_Message() {
    var Message: any = document.getElementById('Message')
    var arrowR: any = document.getElementById('arrowR')
    var arrowL: any = document.getElementById('arrowL')
    if (Message.style.height === '400px') {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '50px'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
    }
    else {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '400px'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
    }

}

function message_select(sender: string, setter: React.Dispatch<any>) {

    setter(true);
}

type MessageType = {
	id: number;
	sentAt: string;
	sender: string | undefined;
	body: string;
	avatar: string | undefined;
    receiver: string | undefined;
}

export default function PrivateMessage() {
    const [isConvOpen, setisConvOpen] = useState<any>(false);
    const [messageInput, setMessageInput] = useState("");
    const [cookies] = useCookies();
    const [me, setMe] = useState<User>();
	const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [receiver, setReceiver] = useState<string>('wasayad');

    const forceUpdate = useForceUpdate();

    useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setMe(res.me.data); });
			setSocket(io(`ws://${ip}:5001`, { transports: ['websocket'] }));
            setMessages([{
                id: 0,
                sentAt: '14',
                sender: 'wasayad',
                body: 'coucou',
                avatar: 'https://cdn.intra.42.fr/users/medium_wasayad.jpg',
                receiver: me?.username,
            }])
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies]);

    useEffect(() => {
		let mount = true;
		if (mount) {
			if (socket) {

				socket.on(`private_message/${me?.username}`, (msg: any) => {
                    console.log(msg);
					messages.push({ id: messages.length, sentAt: msg.sentAt, sender: msg.sender.username, body: msg.body, avatar: msg.sender.profileImage, receiver: msg.receiver.username });
					forceUpdate();
				})
			}
		}
		return (() => { mount = false; });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, cookies, messages]);



    function handleSendMessage(e: any) {
        if (messageInput) {
			if (socket) {
				socket.emit('private_message', { sentAt: Date(), body: messageInput, receiver: receiver });
                messages.push({ id: messages.length, sentAt: Date(), sender: me?.username, body: messageInput, avatar: me?.profileImage, receiver: receiver });
			}
			setMessageInput('');
		}
        e.preventDefault();
    }

    return (
        <div id="Message" >
            <div id="OpenMsg" onClick={() => {Open_Message(); setisConvOpen(false)}}>
                <ArrowSmUp id="arrowR" onClick={() => Open_Message()} />Message
                <ArrowSmUp id="arrowL" onClick={() => Open_Message()} />
            </div>
            {
                isConvOpen === false ? messages.map((message: any) => (
                    <article key={message.id} id='message-container' onClick={(e) => message_select(message.sender, setisConvOpen)}>
                        <div>
                            <img id="message-image" style={{ backgroundImage: `url(${message.avatar})` }} alt="" />
                        </div>
                        <div id="message-body" >
                            <header id='message-header'>
                                <h4 id='message-sender'>{message.sender}</h4>
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
                            <Backspace onClick={e => { setisConvOpen(false) }} />
                            {
                                messages.map((messages: any) => (
                                    messages.sender === "brice" ?
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
    )
}
