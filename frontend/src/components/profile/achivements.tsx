import './profile.css'
import { LockClosed, UserAdd, Support, ChevronDoubleUp, AcademicCap, ThumbDown } from 'heroicons-react';


function Progress_Bar_Security(SecurityLvl: number): string
{
    var numberauth: number = 2;
    var pbf: HTMLElement | null =  document.getElementById("PBFS");
    if (SecurityLvl === 1)
    {
        if (pbf)
            pbf.style.width = `${numberauth / 3 * 100}%`;
            return (`${Math.floor(numberauth / 3 * 100)}%`);
    }
    else if (SecurityLvl === 2)
    {
        if (pbf)
            pbf.style.width =  `${numberauth / 10 * 100}%`;
        return (`${Math.floor(numberauth / 10 * 100)}%`);
    }
    else
    {
        if (pbf)
            pbf.style.width =  `100%`;
    }
    return ('100%');
}  

function Progress_Bar_Friend(FriendLvl: number) : string
{
    var numberfriend: number = 2;
    var pbf: HTMLElement | null =  document.getElementById("PBFF");
    if (FriendLvl === 1)
    {
        if (pbf)
            pbf.style.width = `${numberfriend / 10 * 100}%`;
        return (`${Math.floor(numberfriend / 10 * 100)}%`);
    }
    if (FriendLvl === 2)
    {
        if (pbf)
            pbf.style.width =  `${numberfriend / 30 * 100}%`;
        return (`${Math.floor(numberfriend / 30 * 100)}%`);
    }
    return ('100%');
}  

function Progress_Bar_Guardian(GuardianLvl: number) : string
{
    var win0goal: number = 1;
    var pbf: HTMLElement | null =  document.getElementById("PBFG");
    if (GuardianLvl === 1)
    {
        if (pbf)
            pbf.style.width = `${win0goal / 3 * 100}%`;
        return (`${Math.floor(win0goal / 3 * 100)}%`);
    }
    if (GuardianLvl === 2)
    {
        if (pbf)
            pbf.style.width =  `${win0goal / 7 * 100}%`;
        return (`${Math.floor(win0goal / 7 * 100)}%`);
    }
    return ('100%');
}  

function Progress_Bar_Climber(ClimberLvl: number) : string
{
    var Rank: number = 87;
    var pbf: HTMLElement | null =  document.getElementById("PBFC");
    if (ClimberLvl === 1)
    {
        if (pbf)
            pbf.style.width = `${10 / Rank * 100}%`;
        return (`${Math.floor(10 / Rank * 100)}%`);
    }
    if (ClimberLvl === 2)
    {
        if (pbf)
            pbf.style.width =  `${3 / Rank * 100}%`;
        return (`${Math.floor(3 / Rank * 100)}%`);
    }
    return ('100%');
}  

function Progress_Bar_Persevering(PerseveringLvl: number) : string
{
    var NbGame: number = 17;
    var pbf: HTMLElement | null =  document.getElementById("PBFP");
    if (PerseveringLvl === 1)
    {
        if (pbf)
            pbf.style.width = `${NbGame / 50 * 100}%`;
        return (`${Math.floor(NbGame / 50 * 100)}%`);
    }
    if (PerseveringLvl === 2)
    {
        if (pbf)
            pbf.style.width =  `${NbGame / 150 * 100}%`;
        return (`${Math.floor(NbGame / 150 * 100)}%`);
    }
    return ('100%');
}  

function Progress_Bar_Hater(HaterLvl: number) : string
{
    var NbBlackList: number = 4;
    var pbf: HTMLElement | null =  document.getElementById("PBFH");
    if (HaterLvl === 1)
    {
        if (pbf)
            pbf.style.width = `${NbBlackList / 10 * 100}%`;
        return (`${Math.floor(NbBlackList / 10 * 100)}%`);
    }
    if (HaterLvl === 2)
    {
        if (pbf)
            pbf.style.width =  `${NbBlackList / 25 * 100}%`;
        return (`${Math.floor(NbBlackList / 25 * 100)}%`);
    }
    return ('100%');
}  

export function Achivements() {
    var SecurityLvl: number = 1;
    var FriendLvl: number = 1;
    var GuardianLvl: number = 1;
    var ClimberLvl: number = 1;
    var PerseveringLvl: number = 1;
    var HaterLvl: number = 1;
    
    return (
            <div id="Achievements" >
                <div className="Achievements_contents">
                   <p id="Achievement_font">Achievement</p> 
                    <p><LockClosed className='logo'/> Authentifier Lvl: {SecurityLvl} </p>
                    <div className="Progress_Bar">
                        <span id="PBFS" className="Progress_Bar_Filler">{`${Progress_Bar_Security(SecurityLvl)}`} </span>
                    </div>
                    <p><UserAdd className='logo'/> Friendship Lvl: {SecurityLvl} </p>
                    <div className="Progress_Bar">
                        <span id="PBFF" className="Progress_Bar_Filler">{Progress_Bar_Friend(FriendLvl)}</span>
                    </div>
                    <p><Support className='logo' /> Guardian Lvl: {GuardianLvl} </p>
                    <div className="Progress_Bar">
                        <span id="PBFG" className="Progress_Bar_Filler">{Progress_Bar_Guardian(GuardianLvl)}</span>
                    </div>
                    <p><ChevronDoubleUp className='logo' /> Climber Lvl: {ClimberLvl} </p>
                    <div className="Progress_Bar">
                        <span id="PBFC" className="Progress_Bar_Filler">{Progress_Bar_Climber(ClimberLvl)}</span>
                    </div>
                    <p><AcademicCap className='logo'/> Persevering Lvl: {ClimberLvl} </p>
                    <div className="Progress_Bar">
                        <span id="PBFP" className="Progress_Bar_Filler">{Progress_Bar_Persevering(PerseveringLvl)}</span>
                    </div>
                    <p><ThumbDown className='logo' /> Hater Lvl: {ClimberLvl} </p>
                    <div className="Progress_Bar">
                        <span id="PBFH" className="Progress_Bar_Filler">{Progress_Bar_Hater(HaterLvl)}</span>
                    </div>
                </div>
		    </div>
    )
}