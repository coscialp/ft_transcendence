import { ArrowSmUp } from 'heroicons-react'
import './privateMessage.css'

function Open_Message()
{
    var Message: any = document.getElementById('Message')
    var arrowR: any = document.getElementById('arrowR')
    var arrowL: any = document.getElementById('arrowL')
    console.log("here");
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
        </div>
    )
}