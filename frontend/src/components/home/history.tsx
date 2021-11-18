import React from 'react'
import './font.css'

function History()
{ //md:w-80 h-44 md:h-52
    return (
        <div className="absolute h-60% w-15% bg-Banner top-13% left-5% rounded-2xl text-5xl overflow-hidden opacity-60">
        <div className=" text-center horror mt-8%">
            Survival mod
        </div>
        <div className="absolute bg-yellow-100 h-60 w-60 top-25% left-17% transform rotate-12 postit horror">
            <div className="test">Rules</div>
            <div className="text-left mt-2 ml-2">1: Survive</div>
            <div className="text-left mt-2 ml-2">2: Dead End</div>
            <div className="text-left mt-2 ml-2">3: Random</div>
        </div>
        <a href="/test" className="animated-button1 horror1">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Start
        </a>
        </div>
    )
}

export default History