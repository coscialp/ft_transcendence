import { useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { ip } from "../../App";
import { isLogged } from "../../utils/isLogged";
import { DoubleAuth } from "./double.auth";

export function TwoFA() {

    const TwoFA: any = useRef();
    const [code, setCode] = useState("");
    const [unauthorized, setUnauthorized] = useState(false);
    const [cookies] = useCookies();
    const [me, setMe]: any = useState({});
    
    useEffect(() => {
        let mount = true;
        if (mount) {
            isLogged(cookies).then((res) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });
        }
        return (() => { mount = false; });
    }, [cookies])
    
    useEffect(() => {

        TwoFA.current = new DoubleAuth();
        
        if (unauthorized === false && me?.email !== undefined) {
            TwoFA.current.generate_token();
            
            TwoFA.current.sendAuthToken(me.email);
        }

    }, [me, unauthorized])

    if (!cookies.access_token || unauthorized) {
        return (<Redirect to="/" />);
    }

    function handleSubmit(e: any) {

        if (code) {
            if (TwoFA.current.verifyToken(code) === 0) {
                alert("Bad code !");
            }
            else {
                window.open(`http://${ip}:3000/home`, '_self')
            }
        }

        e.preventDefault();
    }

    return (
        <div>
            <div id="log-box">
                <form onSubmit={handleSubmit}>
                    <div className="logs">
                        2FA Code<br />
                        <input type="text" className="InputStyle" placeholder="Enter your code" value={code} onChange={(e) => { setCode(e.target.value) }} />
                    </div>
                    <input className="log-button InputStyle" type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}