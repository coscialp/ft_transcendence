import React, { ReactElement } from 'react'

var online: number = 1
export function GetNews({user, msg}: any): ReactElement {
    return (
        <div className="bg-BoxActuality rounded-Actuality h-40 w-4/5 mx-10% my-5%">
            <p className="text-red-400 mr-40 lg:text-sm text-xs left-50% relative top-80%">from {user}</p>
            <p className="text-black lg:text-xl text-xs relative bottom-8% w-80% left-10%">{msg}</p>
        </div>
    )
}

export function Displayfriend({user, msg}: any): ReactElement
{
    return (
        <div className="text-right right-4%  relative height-10% width-80% text-xl">
            {user} {(online === 1)? "🔵" : "🔴"}
        </div>
    )
}