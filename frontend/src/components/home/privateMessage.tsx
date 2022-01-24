import { ArrowSmUp, Backspace } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ip } from '../../App'
import { MessageType } from '../../utils/message.type'

var privmsg: any = [
    {
        body: "Hey twe",
        sender: "brice",
        id: "fwefewgergr",
        avatar: "./Beluga.jpeg"
    },
    {
        body: "Salut twe",
        sender: "stef",
        id: "fwefewgergrd",
        avatar: "./Beluga.jpeg"
    },
    {
        body: "Coucou twe",
        sender: "angela",
        id: "fwefewgergrfewf",
        avatar: "./Beluga.jpeg"
    },
]

function useForceUpdate() {
    // eslint-disable-next-line
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

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

function message_select(sender: string, setter: React.Dispatch<any>) {

    setter(true);
}


export default function PrivateMessage() {
    const [isConvOpen, setisConvOpen] = useState<any>(false);
    const [messageInput, setMessageInput] = useState("");
    const [socket, setSocket] = useState<Socket>();
    const [messages] = useState<MessageType[]>([]);

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        let mount = true;
        if (mount) {
            setSocket(io(`ws://${ip}:5001`, { transports: ['websocket'] }));
        }
        return (() => { mount = false; });
    }, []);

    useEffect(() => {
        let mount = true;
        if (mount) {
            if (socket) {
                // socket.on(`msg_toClient/${current_channel}`, (msg: any) => {
                //     messages.push({ id: messages.length, sentAt: msg.sentAt, sender: msg.sender.username, body: msg.body, avatar: msg.sender.profileImage });
                    forceUpdate();
                // })
            }
        }
        return (() => { mount = false; });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, messages]);

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        /*if (messageInput) {
            console.log(messageInput);
            if (socket) {
                socket.emit('msg_toServer', { sentAt: Date(), body: messageInput, receiver: null });
                console.log(`msg_toClient/${current_channel}`);
            }
            setMessageInput('');
        }*/
        e.preventDefault();
    }

    return (
        <div id="Message" >
            <div id="OpenMsg" onClick={() => { Open_Message(); setisConvOpen(false) }}>
                <ArrowSmUp id="arrowR" onClick={() => Open_Message()} />Message
                <ArrowSmUp id="arrowL" onClick={() => Open_Message()} />
            </div>
            <div className="scrollMessageContainer">
            {
                isConvOpen === false ? privmsg.map((message: any) => ( 
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
                                privmsg.map((messages: any) => (
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
        </div>
    )
}
