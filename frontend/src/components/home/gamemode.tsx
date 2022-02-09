import './home.css'
import { ArrowSmUp } from 'heroicons-react'

export function Open_Gamemode() {
    var Gamemode: any = document.getElementById('gamemodeMini')
    var GMBodyOpen: any = document.getElementById('GMBodyOpen')
    var arrowR: any = document.getElementById('gameArrowR')
    var arrowL: any = document.getElementById('gameArrowL')
    if (Gamemode.style.height === '52vh') {
        Gamemode.style.transition = 'all .5s ease-in-out'
        Gamemode.style.height = '50px'
        Gamemode.style.overflowY = 'hidden'
        Gamemode.style.transform = 'rotate(90deg)'
        Gamemode.style.left = '-23.5vh'
        Gamemode.style.bottom = '50vh'
        Gamemode.style.zindex = '1000'
        Gamemode.style.width = '50vh'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
        GMBodyOpen.style.display = 'none' 
    }
    else {
        Gamemode.style.transition = 'all .5s ease-in-out'
        Gamemode.style.height = '52vh'
        Gamemode.style.overflowY = 'scroll'
        Gamemode.style.transform = 'rotate(0deg)'
        Gamemode.style.left = '0'
        Gamemode.style.bottom = '28vh'
        Gamemode.style.zindex = '1000'
        Gamemode.style.width = '50vw'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
        GMBodyOpen.style.display = 'flex'
        GMBodyOpen.style.flexDirection = 'column'
    }

}

export function Gamemode() {

    return (
        <div className="GMElement" >
            <div id="gamemodeMini">
                <div id="OpenGamemode" onClick={() => { Open_Gamemode()}}>
                    <ArrowSmUp id="gameArrowR" onClick={() => Open_Gamemode()} />Gamemode
                    <ArrowSmUp id="gameArrowL" onClick={() => Open_Gamemode()} />
                </div>
                <div id="GMBodyOpen" >
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