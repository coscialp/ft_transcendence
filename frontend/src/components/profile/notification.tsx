import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { NavBar } from "../navbar/navbar";
import './notifications.css'

export function Notification() {

    const ip = window.location.hostname;
    const [cookies] = useCookies();
    const [fromRequest, setFromRequest]: any = useState([]);

    useEffect(() => {
        let mounted = true;
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

        return () => {mounted = false}
    }, [ip, cookies, fromRequest]);

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
        })
    }

    return (
        <div>
            <NavBar page="Alerts" />
            <div className="AlertsELement" >
                <div className="AlertsMain" >
                    {fromRequest.map((request: any) => (
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