import { ArrowSmUp, ScaleOutline } from 'heroicons-react'
import './privateMessage.css'

var privmsg : any = [
    {
        test : "Hey twe",
        user: "brice",
    },
    {
        test : "Salut twe",
        user: "stef",
    },
    {
        test : "Coucou twe",
        user: "angela",
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
            {privmsg.map((users: any) => (
                <div className='privmsg'>
                    <p className='privmsg_content'>{users.test}</p>
                    <p className='privmsg_from'>{users.user}</p>
                </div>
            ))}
        </div>
    )
}
