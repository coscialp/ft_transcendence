import './profile.css'
import { LockClosed, UserAdd, ChevronDoubleUp, AcademicCap, ThumbDown } from 'heroicons-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from '../../App';
import { useCookies } from 'react-cookie';

function Progress_Bar_Security(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFS");
    if (pbf)
        pbf.style.width = achivement?.Security ? `100%` : '0%';
    return (achivement?.Security ? `100%` : '0%');
}

function Progress_Bar_Friend(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFF");
    if (pbf)
        pbf.style.width = `${achivement?.Friend}%`;
    return (`${achivement?.Friend}%`);
}

function Progress_Bar_Climber(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFC");
    if (pbf)
        pbf.style.width = `${achivement?.Climber}%`;
    return (`${achivement?.Climber}%`);
}

function Progress_Bar_Persevering(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFP");
    if (pbf)
        pbf.style.width = `${achivement?.Persevering}%`;
    return (`${achivement?.Persevering}%`);
}

function Progress_Bar_Hater(achivement: any): string {
    var pbf: HTMLElement | null = document.getElementById("PBFH");
    if (pbf)
        pbf.style.width = `${achivement?.Hater}%`;
    return (`${achivement?.Hater}%`);
}

export function Achivements(data: any) {

    const [achivements, setAchivements]: any = useState({})
    const [cookies] = useCookies();

    

    useEffect(() => {
        let mount = true;
        if (mount && data.user.username) {
            axios.request({
                url: `/user/${data?.user?.username}/achievements`,
                method: 'get',
                baseURL: `http://${ip}:5000`,
                headers: {
                    "Authorization": `Bearer ${cookies.access_token}`,
                }
            }).then((response: any) => {
                
                setAchivements(response.data);
            })
        }
        return (() => { mount = false; });
    }, [data.user, cookies])

    

    return (
        <div id="Achievements" >
            <div className="Achievements_contents">
                <p id="Achievement_font">Achievement</p>
                <p><LockClosed className='logo' /> Authentifier</p>
                <div className="Progress_Bar">
                    <span id="PBFS" className="Progress_Bar_Filler">{`${Progress_Bar_Security(achivements)}`} </span>
                </div>
                <p><UserAdd className='logo' /> Friendship</p>
                <div className="Progress_Bar">
                    <span id="PBFF" className="Progress_Bar_Filler">{Progress_Bar_Friend(achivements)}</span>
                </div>
                <p><ChevronDoubleUp className='logo' /> Climber</p>
                <div className="Progress_Bar">
                    <span id="PBFC" className="Progress_Bar_Filler">{Progress_Bar_Climber(achivements)}</span>
                </div>
                <p><AcademicCap className='logo' /> Persevering</p>
                <div className="Progress_Bar">
                    <span id="PBFP" className="Progress_Bar_Filler">{Progress_Bar_Persevering(achivements)}</span>
                </div>
                <p><ThumbDown className='logo' /> Hater</p>
                <div className="Progress_Bar">
                    <span id="PBFH" className="Progress_Bar_Filler">{Progress_Bar_Hater(achivements)}</span>
                </div>
            </div>
        </div>
    )
}