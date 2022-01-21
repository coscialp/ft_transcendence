import './home.css'

export function Gamemode() {
    return (
        <div className="GMElement" >
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