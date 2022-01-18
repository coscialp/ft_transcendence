import { ArrowSmUp, Backspace } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'
import { useState } from 'react'

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


export default function PrivateMessage() {
    const [isConvOpen, setisConvOpen] = useState<any>(false);
    console.log(isConvOpen);
    return (
        <div id="Message" >
            <div id="OpenMsg" onClick={() => Open_Message()}>
                <ArrowSmUp id="arrowR" onClick={() => Open_Message()} />Message
                <ArrowSmUp id="arrowL" onClick={() => Open_Message()} />
            </div>
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
                )) : <div id='returnprivmsg'>
                    <Backspace />
                    <p className='message-send'><span className='message-send-background'>salut</span></p>
                    <p className='message-received'><img className="private-message-img" style={{ backgroundImage: `url(/img/beluga.jpeg)` }} alt="" /><span className='message-received-background'>salut a toi le collegue comment va tu salut a toi je pense que ca ne fonctionne pas si bien que ca coucou twe coucou twe</span></p>
                    <p className='message-send'  ><span className='message-send-background'>salut a toi le collegue comment va tu salut a toi je pense que ca ne fonctionne pas si bien que ca coucou twe coucou twe</span></p>
                    <p className='message-received'><span className='message-received-background'>salut</span></p>
                </div>}
        </div>
    )
}
