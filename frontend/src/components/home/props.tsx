import React, { ReactElement } from 'react'

var online: number = 1
export function GetNews({ user, msg }: any): ReactElement {
    return (
        <div className="bg-BoxActuality rounded-Actuality h-40 w-4/5 mx-10% my-5%">
            <p className="text-red-400 mr-40 lg:text-sm text-xs left-50% relative top-80%">from {user}</p>
            <p className="text-black lg:text-xl text-xs relative bottom-8% w-80% left-10%">{msg}</p>
        </div>
    )
}

export function Displayfriend({ user, msg, img, connect }: { user: string, msg: string, img: string, connect: number }): ReactElement {
    return (
        <div>
            <div className="right-4% relative height-10% width-80% text-xl">
                <img src={img} className="absolute left-10% top-13% rounded-full h-80% w-8%" alt="error"></img>
                <div className="absolute left-22% text-left lg:text-2xl md:text-xl sm:text-sm text-sm">{user} </div> <div className="relative left-47%">{(connect === 1) ? "🔵" : "🔴"} </div>
            </div>
            <hr className="mt-1 mb-1 right-0%"></hr>
        </div>
    )
}