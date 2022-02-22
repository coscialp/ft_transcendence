import './profile.css'
import { LockClosed, UserAdd, Support, ChevronDoubleUp, AcademicCap, ThumbDown } from 'heroicons-react';
import { useEffect, useState } from 'react';

const achivement = {
    Security: {
        level: 2,
        progression: 10,
    },
    Friend: {
        level: 1,
        progression: 60,
    },
    Guardian: {
        level: 1,
        progression: 60,
    },
    Climber: {
        level: 1,
        progression: 60,
    },
    Persevering: {
        level: 1,
        progression: 60,
    },
    Hater: {
        level: 1,
        progression: 60,
    },
}

function Progress_Bar_Security(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFS");
    if (pbf)
        pbf.style.width = `${achivement?.Security?.progression}%`;
    return (`${achivement?.Security?.progression}%`);
}

function Progress_Bar_Friend(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFF");
    if (pbf)
        pbf.style.width = `${achivement?.Friend?.progression}%`;
    return (`${achivement?.Friend?.progression}%`);
}

function Progress_Bar_Guardian(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFG");
    if (pbf)
        pbf.style.width = `${achivement?.Guardian?.progression}%`;
    return (`${achivement?.Guardian?.progression}%`);
}

function Progress_Bar_Climber(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFC");
    if (pbf)
        pbf.style.width = `${achivement?.Climber?.progression}%`;
    return (`${achivement?.Climber?.progression}%`);
}

function Progress_Bar_Persevering(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFP");
    if (pbf)
        pbf.style.width = `${achivement?.Persevering?.progression}%`;
    return (`${achivement?.Persevering?.progression}%`);
}

function Progress_Bar_Hater(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFH");
    if (pbf)
        pbf.style.width = `${achivement?.Hater?.progression}%`;
    return (`${achivement?.Hater?.progression}%`);
}

export function Achivements() {

    const [achivements, setAchivements]: any = useState({})

    useEffect(() => {
        let mount = true;
        if (mount) {
            setAchivements(achivement);
        }
        return (() => { mount = false; });
    }, [])

    

    return (
        <div id="Achievements" >
            <div className="Achievements_contents">
                <p id="Achievement_font">Achievement</p>
                <p><LockClosed className='logo' /> Authentifier Lvl: {achivements?.Security?.level} </p>
                <div className="Progress_Bar">
                    <span id="PBFS" className="Progress_Bar_Filler">{`${Progress_Bar_Security(achivements)}`} </span>
                </div>
                <p><UserAdd className='logo' /> Friendship Lvl: {achivements?.Friend?.level} </p>
                <div className="Progress_Bar">
                    <span id="PBFF" className="Progress_Bar_Filler">{Progress_Bar_Friend(achivements)}</span>
                </div>
                <p><Support className='logo' /> Guardian Lvl: {achivements?.Guardian?.level} </p>
                <div className="Progress_Bar">
                    <span id="PBFG" className="Progress_Bar_Filler">{Progress_Bar_Guardian(achivements)}</span>
                </div>
                <p><ChevronDoubleUp className='logo' /> Climber Lvl: {achivements?.Climber?.level} </p>
                <div className="Progress_Bar">
                    <span id="PBFC" className="Progress_Bar_Filler">{Progress_Bar_Climber(achivements)}</span>
                </div>
                <p><AcademicCap className='logo' /> Persevering Lvl: {achivements?.Persevering?.level} </p>
                <div className="Progress_Bar">
                    <span id="PBFP" className="Progress_Bar_Filler">{Progress_Bar_Persevering(achivements)}</span>
                </div>
                <p><ThumbDown className='logo' /> Hater Lvl: {achivements?.Hater?.level} </p>
                <div className="Progress_Bar">
                    <span id="PBFH" className="Progress_Bar_Filler">{Progress_Bar_Hater(achivements)}</span>
                </div>
            </div>
        </div>
    )
}