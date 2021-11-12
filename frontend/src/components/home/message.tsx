import React from 'react'
import { ArrowSmUpIcon } from '@heroicons/react/outline'

function Open_Message() {
    var Message: any = document.getElementById('Message')
    var arrowR: any = document.getElementById('arrowR')
    var arrowL: any = document.getElementById('arrowL')

    arrowR.classList.remove('animate-pulse')
    arrowL.classList.remove('animate-pulse')
    if (Message.style.height === '24rem') {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '2.5rem'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
    }
    else {
        Message.style.transition = 'all .5s ease-in-out'
        Message.style.height = '24rem'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
    }

}

function Message() {
    return (
        <div id="Message" className="absolute bottom-0 right-10 h-10 w-96 bg-Banner rounded-t-3xl text-gold font-sans font-semibold focus:animate-pulse" >
            <ArrowSmUpIcon id="arrowR" className="float-left ml-10%  mt-1 max-h-90% h-auto w-10% animate-pulse" onClick={() => Open_Message()} />
            <ArrowSmUpIcon id="arrowL" className="float-right mr-10% mt-1 max-h-90% h-auto w-10% animate-pulse" onClick={() => Open_Message()} />
            <div className="select-none flex items-center justify-center text-2xl" onClick={() => Open_Message()}>Message</div>
        </div>
    )
}

export default Message