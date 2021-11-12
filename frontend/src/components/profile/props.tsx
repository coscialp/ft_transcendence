import React, { ReactElement } from 'react'
import versus from './img/versus.png'
import { useEffect } from 'react'
import { setInterval } from 'timers'

function Checkwin(gameid:number, result:number)
{
    var element: HTMLElement | null = document.getElementById(String(gameid) + "1")

    console.log(result);
    if (result === 0)
    {
        element?.classList.add("bg-red-400")
    }
    else
    {
        element?.classList.add("bg-green-400")
    }
    element = document.getElementById(String(gameid) + "2")
    if (result === 1)
    {
        element?.classList.add("bg-red-400")
    }
    else
    {
        element?.classList.add("bg-green-400")
    }
}

export function Displayhistory({user1, user2, result, gameid}:{user1: string, user2: string, result:number, gameid:number}): ReactElement
{
    const gameidstr: string = String(gameid);
    useEffect(() => {
      const interval = setInterval(() => {
        Checkwin(gameid, result)
      }, 100);
      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [gameid, result])
    return (
        <div className="relative h-10% w-100% border-b-2">
            <div id={gameidstr + "1"} className="absolute w-50% h-100%"></div>
            <div id={gameidstr + "2"} className="absolute left-50% w-50% h-100%"></div>
            <p className="absolute text-2xl top-30% left-10%"> {user1} </p>
            <img src={versus} alt="error" className="absolute h-80% w-10% left-45% top-10%"></img>
            <p className="absolute text-2xl top-30% right-10%"> {user2} </p>
        </div>
    )
}