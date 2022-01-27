import './home.css'
import { ArrowSmUp, Backspace } from 'heroicons-react'
import { useEffect, useState } from 'react'

function useForceUpdate() {
    // eslint-disable-next-line
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export function Open_Gamemode() {
    var Gamemode: any = document.getElementById('gamemodeMini')
    var arrowR: any = document.getElementById('gameArrowR')
    var arrowL: any = document.getElementById('gameArrowL')
    if (Gamemode.style.height === '400px') {
        Gamemode.style.transition = 'all .5s ease-in-out'
        Gamemode.style.height = '50px'
        Gamemode.style.overflowY = 'hidden'
        Gamemode.style.transform = 'rotate(90deg)'
        Gamemode.style.left = '-23.4vw'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
    }
    else {
        Gamemode.style.transition = 'all .5s ease-in-out'
        Gamemode.style.height = '400px'
        Gamemode.style.overflowY = 'scroll'
        Gamemode.style.transform = 'rotate(0deg)'
        Gamemode.style.left = '0'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
    }

}

export function Gamemode() {
    const forceUpdate = useForceUpdate();

    return (
        <div className="GMElement" >
            <div id="gamemodeMini">
                <div id="OpenGamemode" onClick={() => { Open_Gamemode()}}>
                    <ArrowSmUp id="gameArrowR" onClick={() => Open_Gamemode()} />Gamemode
                    <ArrowSmUp id="gameArrowL" onClick={() => Open_Gamemode()} />
                </div>
            </div>
            
            <p className="GMTitle" >Gamemode</p>
            <div className="GMBody" >
                <details>
                    <summary className="gamemodeList">{"Survival mode"}</summary>
                    <nav className="menuGamemode">
                        <p className="rules">Rules:</p>
                        <p className="rules ">This is a solo player mode, you will play against a wall, the goal is to train yourself and to beat your highscore !</p>
                        <div className="gamemodeBorder"></div>
                        <button className="friendBtn"><span /><span /><span /><span />go survival mode</button>
                    </nav>
                </details>
                <p className="comingSoonMode">Coming soon...</p>
            </div>
        </div>
    )
}