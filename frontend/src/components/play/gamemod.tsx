import React from 'react'
import { PlayIcon } from '@heroicons/react/outline'
import solopong from './img/solopong.png'
import duopong from './img/duopong.png'
import superpong from './img/superpong.png'
import { Link } from 'react-router-dom'
import './gamemod.css'

function SelectGameMod(GameMod: number) {
    var table: string[] = ["000", "001", "002", "003", "004", "005", "006", "007", "008", "009"]
    var id: HTMLElement | null = document.getElementById(table[GameMod])
    id?.classList.remove("text-gray-400")
    id?.classList.add("text-gold")
    id = document.getElementById("PlayButton")
    if (!(id?.classList.contains("text-gold"))) {
        id?.classList.remove("hidden")
        id?.classList.add("text-gold")
        id?.classList.add("animate-pulse")
    }
    for (var i: number = 1; i < 10; i++) {
        if (i !== GameMod) {
            id = document.getElementById(table[i])
            if (id?.classList.contains("text-gold")) {
                id?.classList.remove("text-gold")
                id.classList.add("text-gray-400")
            }
        }
    }
}

function GameMod() {
    return (
        <div className="h-full w-full">
            <div className="absolute h-60% w-22% bg-Banner ml-7% top-20% opacity-95">
                <img className="h-40% w-50% ml-25% mt-10%" src={solopong} alt="Error" />
                <p className="justify-center flex mt-10% text-4xl text-white font-small tracking-widest"> Solo </p>
                <div className="mt-5% line1"></div>
                <ul className="mt-10% list-disc list-inside text-3xl">
                    <li id="001" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(1)}>Training</button>
                    </li>
                    <li id="002" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(2)}>Normal</button>
                    </li>
                    <li id="003" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(3)}>Ranked</button>
                    </li>
                </ul>
            </div>
            <div className="absolute h-60% w-22% bg-Banner ml-39% top-20% opacity-95">
                <img className="flex center justify-center h-40% w-50% ml-25% mt-10%" src={duopong} alt="Error" />
                <p className="justify-center flex mt-10% text-4xl text-white font-small tracking-widest"> Duo </p>
                <div className="mt-5% line1"></div>
                <ul className="mt-10% list-disc list-inside text-3xl">
                    <li id="004" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(4)}>Training</button>
                    </li>
                    <li id="005" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(5)}>Normal</button>
                    </li>
                    <li id="006" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(6)}>Ranked</button>
                    </li>
                </ul>
            </div>
            <div className="absolute h-60% w-22% bg-Banner ml-71% top-20% opacity-95">
                <img className="flex center justify-center h-40% w-50% ml-25% mt-10%" src={superpong} alt="Error" />
                <p className="justify-center flex mt-10% text-4xl text-white font-small tracking-widest"> Super Mega Pong </p>
                <div className="mt-5% line1"></div>
                <ul className="mt-10% list-disc list-inside text-3xl">
                    <li id="007" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(7)}>Training</button>
                    </li>
                    <li id="008" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(8)}>Normal</button>
                    </li>
                    <li id="009" className="text-gray-400 ml-25% p-1">
                        <button className="text-white" onClick={() => SelectGameMod(9)}>Ranked</button>
                    </li>
                </ul>
            </div>
            <Link to="Pong"><PlayIcon id="PlayButton" className="hidden absolute bottom-5% left-40% h-10% w-20% text-gray-400" onClick={() => SelectGameMod(1)} /> </Link>
        </div>
    )
}

export default GameMod