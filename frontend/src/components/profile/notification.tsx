import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import { gameSocket, ip } from "../../App";
import { isLogged } from "../../utils/isLogged";
import './notifications.css'

export function Notification(data: any) {
    const [cookies] = useCookies();
    const [fromRequest, setFromRequest]: any = useState([]);
    const [unauthorized, setUnauthorized] = useState(false);
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        let mount = true;
        if (mount) {
            isLogged(cookies).then((res) => { setUnauthorized(res.unauthorized) });
        }
        return (() => { mount = false; setMounted(false) });
    }, [cookies])

    function NotifRequest() {
        axios.request({
            url: `/user/me/friends/request`,
            method: 'get',
            baseURL: `http://${ip}:5000`,
            headers: {
                "Authorization": `Bearer ${cookies.access_token}`,
            },
        }).then((response: any) => {
            if (mounted) {
                setFromRequest(response.data.from);
            }
        })
    }

    useEffect(() => {
        let mounted = true;

        if (mounted) { NotifRequest() }

        const interval = setInterval(() => {
            let mounted = true;

            if (mounted) { NotifRequest() }

            return () => { mounted = false }
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [cookies]);

    function AcceptFriend(request: any) {
        axios.request({
            url: `/user/friends/request/accept`,
            method: 'patch',
            baseURL: `http://${ip}:5000`,
            headers: {
                "Authorization": `Bearer ${cookies.access_token}`,
            },
            data: {
                'newFriendId': request.username
            }
        }).then((response: any) => {

            NotifRequest();
        })
    }

    function RefuseFriend(request: any) {
        axios.request({
            url: `/user/friends/request/decline`,
            method: 'patch',
            baseURL: `http://${ip}:5000`,
            headers: {
                "Authorization": `Bearer ${cookies.access_token}`,
            },
            data: {
                'fromId': request.username
            }
        }).then((response: any) => {

            NotifRequest();
        })
    }

    function handleAcceptDuel(username: string) {
        gameSocket.emit('accept_duel')
    }

    function handleDeclineDuel(username: string) {
        gameSocket.emit('refuse_duel')
    }

    if (!cookies.access_token || unauthorized) {
        return (<Redirect to="/" />);
    }

    return (
        <div>
            <div className="AlertsELement" >
                <div className="AlertsMain" >
                    {data.duel.username !== undefined ? <div className="Friend Request Pending" key={data.duel.id} >
                        <div className="NameImg box">
                            <img className="FriendRequestImg" alt="" style={{ backgroundImage: `url(${data.duel.profileImage})` }} />
                            <p className="Name Request">{data.duel.username}</p>
                        </div>
                        <div className="Accept Denie btnbox" >
                            <p className="AcceptBtn" onClick={(e: any) => handleAcceptDuel(data.duel.username)}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Accept
                            </p>
                            <p className="DeclineBtn" onClick={(e: any) => handleDeclineDuel(data.duel.username)}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Decline
                            </p>
                        </div>
                    </div> : null}
                    {fromRequest.length === 0 ? <div className="no alerts">You have no alerts !</div> : fromRequest.map((request: any) => (
                        <div className="Friend Request Pending" key={request.id} >
                            <div className="NameImg box">
                                <img className="FriendRequestImg" alt="" style={{ backgroundImage: `url(${request.profileImage})` }} />
                                <p className="Name Request">{request.username}</p>
                            </div>
                            <div className="Accept Denie btnbox" >
                                <p className="AcceptBtn" onClick={(e: any) => AcceptFriend(request)}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    Accept
                                </p>
                                <p className="DeclineBtn" onClick={(e: any) => RefuseFriend(request)}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    Decline
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}