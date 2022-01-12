import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ip } from "../../App";
import { NavBar } from "../navbar/navbar";
import './notifications.css'

export function Notification() {
    const [cookies] = useCookies();
    const [fromRequest, setFromRequest]: any = useState([]);

    function NotifRequest() {
        axios.request({
            url: `/user/me/friends/request`,
            method: 'get',
            baseURL: `http://${ip}:5000`,
            headers: {
                "Authorization": `Bearer ${cookies.access_token}`,
            },
        }).then((response: any) => {
                setFromRequest(response.data.from);
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
            console.log("Friend accepted")
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
            console.log("Friend request declined")
            NotifRequest();
        })
    }

    return (
        <div>
            <NavBar page="Alerts" />
            <div className="AlertsELement" >
                <div className="AlertsMain" >
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