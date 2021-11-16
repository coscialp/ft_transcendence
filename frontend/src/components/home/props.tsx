import React, { ReactElement } from 'react'
import { ChatAltIcon } from '@heroicons/react/outline'

export function GetNews({ user, msg, img, connect }: { user: string, msg: string, img: string, connect: number }): ReactElement {
    return (
        <div className="bg-Banner rounded-xl h-36 w-100% mb-2% overflow-hidden">
            <img src={img} className="text-red-400 w-16 h-16 rounded-full ml-5 mt-6"></img>
            <p className="text-white w-40 h-5 text-left relative ml-24 -mt-16 text-xl font-medium">{user}</p>
            <p className="text-white w-88% h-5 mt-3 text-left relative ml-24 text-gray-300 text-xl">{msg}</p>
        </div>
    )
}

function friendlist_msg(id: string, opt: number)
{
    var element: HTMLElement | null = document.getElementById(id)

    if (opt === 1)
    {
        element?.classList.remove("hidden")
    }
    else
    {
        element?.classList.add("hidden");
    }
}

export function Displayfriend({ user, msg, img, connect }: { user: string, msg: string, img: string, connect: number }): ReactElement {
    return (
        <div>
            <div id={user + msg + connect + img + "1"} className="relative h-16 w-100% text-xl transition duration-500 hover:bg-gray-500 hover:duration-500" onMouseEnter={ () => friendlist_msg(user + msg + connect + img, 1)} onMouseLeave={ () => friendlist_msg(user + msg + connect + img, 0)}>
                <img src={img} className="absolute left-5 top-2 rounded-full h-12 w-12" alt="error"></img>
                <div className="absolute left-20 top-1 text-left text-md">@{user} </div> <div className={(connect ===1) ? "absolute left-20 top-11 text-sm bg-green-400 rounded-full h-2 w-2" : "absolute left-20 top-11 text-sm bg-gray-400 rounded-full h-2 w-2"}></div> <div className={connect === 1 ? "absolute left-24 top-8 text-base" :"absolute left-24 top-8 text-base opacity-50"}>{(connect === 1) ? "online" : "offline"} </div>
                <ChatAltIcon id={user + msg + connect + img} className="absolute h-10 w-10 right-5 top-2 hidden"/>
            </div>
        </div>
    )
}