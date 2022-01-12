import { ArrowSmUp } from 'heroicons-react'
import './privateMessage.css'
import './mainMenu.css'

var privmsg : any = [
    {
        body : "Hey twe",
        sender: "brice",
        id: "fwefewgergr",
        avatar:"./Beluga.jpeg"
    },
    {
        body : "Salut twe",
        sender: "stef",
        id: "fwefewgergrd",
        avatar:"./Beluga.jpeg"
    },
    {
        body : "Coucou twe",
        sender: "angela",
        id: "fwefewgergrfewf",
        avatar:"./Beluga.jpeg"
    },  
]

function Open_Message()
{
    var Message: any = document.getElementById('Message')
    var arrowR: any = document.getElementById('arrowR')
    var arrowL: any = document.getElementById('arrowL')
    if (Message.style.height === '350px')
    {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '50px'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
    }
    else
    {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '350px'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
    }
    
}



export default function PrivateMessage()
{
    return (
        <div id="Message" >
            <div id="OpenMsg" onClick={() => Open_Message()}>
            <ArrowSmUp  id="arrowR" onClick={() => Open_Message()}/>Message
            <ArrowSmUp  id="arrowL" onClick={() => Open_Message()}/>
            </div>
            {   privmsg.map((message: any) => (
               <article key={message.id} id='message-container'>
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
            ))}
        </div>
    )
}
