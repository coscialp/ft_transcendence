import { ArrowSmUp, Backspace } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'
import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useForceUpdate } from '../../utils/forceUpdate'
import { MessageType } from '../../utils/message.type'
import { RequestApi } from '../../utils/RequestApi.class'
import { ip } from '../../App'
import { Conversation } from '../../utils/conversation.type'
import { User } from '../../utils/user.type'
import axios from 'axios'

export function Open_Message() {
    let Message: any = document.getElementById('Message')
    let arrowR: any = document.getElementById('arrowR')
    let arrowL: any = document.getElementById('arrowL')
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


export default function PrivateMessage({ currentChat, setCurrentChat, me, socket }: any) {
    const [isConvOpen, setisConvOpen] = useState<any>(false);
    // eslint-disable-next-line
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [cookies] = useCookies();
    // eslint-disable-next-line
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [receiver, setReceiver] = useState<string>("");
    const [newDmNotif, setNewDmNotif] = useState<boolean>();
    const [myBlackList, setMyBlackList] = useState<User[]>();

    const forceUpdate = useForceUpdate();
    const scrollRef = useRef<any>();

    const requestApi = new RequestApi(cookies.access_token, ip);

    useEffect(() => {
        if (currentChat !== "") {
            setReceiver(currentChat);
            setisConvOpen(true);
        }
    }, [currentChat]);

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
            requestApi.get(`channel/privmessages/${me?.username}`).then((response: any) => {
                if (mount) {
                    // eslint-disable-next-line
                    response.messages?.map((msg: any) => {
                        if ((myBlackList && myBlackList?.findIndex((u) => u.username === msg?.property?.username) === -1)) {
                            conversations.push({ property: msg.property, conversations: msg.conversations })
                        }
                    }
                    );
                    forceUpdate();
                }
            })
        }
        return (() => { mount = false; });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies, conversations, myBlackList]);

    useEffect(() => {
        let mount = true;
        if (mount) {
            if (socket && me && cookies && messages) {
                socket.on(`private_message`, (msg: any) => {
                    let convIndex = conversations?.findIndex((obj => msg.sender.username === obj.property.username));
                    if (myBlackList?.findIndex((u) => u.username === msg?.sender?.username) === -1) {
                        setNewDmNotif(true);
                        if (conversations && convIndex !== -1) {
                            conversations[convIndex!].conversations.push({ id: conversations[convIndex!].conversations.length, date: Date(), sender: msg.sender.username, content: msg.body, avatar: msg.sender.profileImage, receiver: msg.receiver.username })
                            messages.push({ id: messages.length, date: Date(), sender: msg.sender.username, content: msg.body, avatar: msg.sender.profileImage, receiver: msg.receiver.username })
                        } else {
                            conversations.push({ property: msg.sender, conversations: [] });
                            convIndex = conversations?.findIndex((obj => msg.sender.username === obj.property.username));
                            conversations[convIndex!].conversations.push({ id: conversations[convIndex!].conversations.length, date: Date(), sender: msg.sender.username, content: msg.body, avatar: msg.sender.profileImage, receiver: msg.receiver.username })
                        }
                        forceUpdate();
                    }
                }
                )
            }
        }
        return (() => { mount = false; });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, me, cookies, messages]);

    function handleSendMessage(e: any) {
        if (messageInput) {
            if (socket) {
                const indexOfConv = conversations.findIndex(obj => obj.property.username === receiver);
                socket.emit('private_message', { sentAt: Date(), sender: me, body: messageInput, receiver: receiver });
                conversations[indexOfConv]?.conversations.push({ id: messages.length, date: Date(), sender: me?.username, content: messageInput, avatar: me?.profileImage, receiver: receiver });
                messages.push({ id: messages.length, date: Date(), sender: me?.username, content: messageInput, avatar: me?.profileImage, receiver: receiver })
            }
            setMessageInput('');
        }
        e.preventDefault();
    }

    useEffect(() => {
        let mount = true;
        if (mount) {
            const indexOfConv = conversations.findIndex(obj => obj.property.username === receiver)
            // eslint-disable-next-line
            conversations[indexOfConv]?.conversations.map((allMessages: any) => {
                if (myBlackList?.findIndex((u) => u.username === allMessages?.sender?.username) === -1) {
                    messages.push({ id: allMessages.id, date: new Date(allMessages.date).toLocaleTimeString(undefined, { timeStyle: 'short' }), sender: allMessages.sender.username, content: allMessages.content, avatar: allMessages.sender.profileImage, receiver: allMessages.receiver.username })
                }
            })
            forceUpdate();
        }
        return (() => { mount = false; });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies, conversations, receiver]);

    function handleSelectConversation(r: string) {
        receiver !== r && setMessages([]);
        setReceiver(r);
        setisConvOpen(true);
    }



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [isConvOpen, messages.length])

    return (
        <div id="Message" >
            <div id="OpenMsg" onClick={() => { Open_Message(); setNewDmNotif(false); setCurrentChat(""); setisConvOpen(false) }}>
                <ArrowSmUp id="arrowR" /><span>Message {newDmNotif ? <span id="DmNotif">●</span> : null}</span>
                <ArrowSmUp id="arrowL" />
            </div>
            <div className="scrollMessageContainer">
                {
                    //conversations?.length === 0 ? "You have no messages" :
                    isConvOpen === false ? conversations?.map((message: any) => (
                        <article key={message.property.id} id='message-container' onClick={(e) => handleSelectConversation(message.property.username)}>
                            <div>
                                <img id="message-image" style={{ backgroundImage: `url(${message.property.profileImage})` }} alt="" />
                            </div>
                            <div id="message-body" >
                                <header id='message-header'>
                                    <h4 id='message-sender'>{message.property.username}</h4>
                                    <span id='message-time'>
                                        {new Date(message.conversations[message.conversations.length - 1].date).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                                    </span>
                                </header>
                                <p id='message-text'>{message.conversations[message.conversations.length - 1].content}</p>
                            </div>
                        </article>
                    )) :
                        <div>
                            <Backspace onClick={e => { setCurrentChat(""); setisConvOpen(false) }} />
                            <section className='discussion' >
                                {
                                    messages.map((message: any) => (
                                        message.sender === me.username ?
                                            <div ref={scrollRef} key={message.id} className="bubble sender"> {message.content} </div> :
                                            <div ref={scrollRef} key={message.id} className="bubble recipient"> {message.content} </div>
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
