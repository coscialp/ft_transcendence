import axios from "axios";
import { useCookies } from "react-cookie";
import { ip } from "../../App";
import {
  UserAdd,
  Ban,
  Pencil,
  CheckCircle,
  ChevronDoubleUp,
  ChevronDoubleDown,
  BadgeCheck,
} from "heroicons-react";
import "./profile.css";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { User } from "../../utils/user.type";
import "../../tooltip.css";
import { ranks } from "../../utils/ranks";

export function Overall(data: any) {
  const [cookies] = useCookies();
  let history = useHistory();
  const [myBlackList, setMyBlackList] = useState<User[]>([]);
  const [stats, setStats]: any = useState({});
  const [rank, setRank]: any = useState();

  useEffect(() => {
    let mount = true;
    if (mount) {
      if (data.user?.PP < 50) {
        setRank(1);
      } else if (data.user?.PP < 200) {
        setRank(2);
      } else if (data.user?.PP < 400) {
        setRank(3);
      } else if (data.user?.PP < 600) {
        setRank(4);
      } else if (data.user?.PP >= 600) {
        setRank(5);
      }
    }
    return () => {
      mount = false;
    };
  }, [cookies, data.user]);

  useEffect(() => {
    let mount = true;

    axios
      .request({
        url: `/user/me/blacklist`,
        method: "get",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      })
      .then((response: any) => {
        if (mount) {
          setMyBlackList(response.data.blackList);
        }
      });
    return () => {
      mount = false;
    };
  }, [cookies]);

  useEffect(() => {
    let mount = true;

    axios.request({
      url: `/user/me/blacklist`,
      method: "get",
      baseURL: `http://${ip}:5000`,
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response: any) => {
        if (mount) {
          setMyBlackList(response.data.blackList);
        }
      });
    return () => {
      mount = false;
    };
  }, [cookies]);

  useEffect(() => {
    let mount = true;

    if (data.user?.username !== undefined) {
      axios
        .request({
          url: `/user/${data.user.username}/statistics`,
          method: "get",
          baseURL: `http://${ip}:5000`,
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        })
        .then((response: any) => {
          if (mount) {
            setStats(response.data);
          }
        });
    }
    return () => {
      mount = false;
    };
  }, [cookies, data.user]);

  function handleAddfriend() {
    axios
      .request({
        url: `/user/friends/request`,
        method: "post",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
        data: {
          newFriendId: data.user.username,
        },
      })
      .then((response: any) => { });
    data.socket?.emit('newNotification', { receiver: data.user.username });
  }

  function handleBlacklist(friendToDelete: any) {
    axios
      .request({
        url: "/user/blacklist/add",
        method: "patch",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
        data: {
          newBlackListId: friendToDelete,
        },
      })
      .then((Response) => {
        axios
          .request({
            url: `/user/friends/remove`,
            method: "delete",
            baseURL: `http://${ip}:5000`,
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
            data: {
              idToDelete: friendToDelete,
            },
          })
          .then((Response) => {
            axios
              .request({
                url: `/user/me/blacklist`,
                method: "get",
                baseURL: `http://${ip}:5000`,
                headers: {
                  Authorization: `Bearer ${cookies.access_token}`,
                },
              })
              .then((response: any) => {
                setMyBlackList(response.data.blackList);
              });
          });
      });
  }

  function handleWhitelist(friendToAdd: any) {
    axios
      .request({
        url: "/user/blacklist/remove",
        method: "delete",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
        data: {
          idToDelete: friendToAdd,
        },
      })
      .then((Response) => {
        axios
          .request({
            url: `/user/me/blacklist`,
            method: "get",
            baseURL: `http://${ip}:5000`,
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          })
          .then((response: any) => {
            setMyBlackList(response.data.blackList);
          });
      });
  }

  function handlePromoteAdmin() {
    axios.request({
      url: `/user/admin/promote/${data.user.username}`,
      method: "patch",
      baseURL: `http://${ip}:5000`,
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
  }

  function handleDemoteAdmin() {
    axios.request({
      url: `/user/admin/demote`,
      method: "patch",
      baseURL: `http://${ip}:5000`,
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
  }

  return (
    <div className="ImgName">
      {data.user?.isAdmin ? <BadgeCheck /> : null}
      {data.user?.username === data.me?.username ?
        <div className="profile-imgpencil">
          <img className="ProfileImage" src={data.user.profileImage} alt="" onClick={(e) => { return history.push(`/settings`); }}></img>
          <Pencil className="profile-pencil"
            onClick={(e) => { return history.push(`/settings`); }} />
        </div> :
        <div className="profile-img">
          <img className="ProfileImage" src={data.user.profileImage} alt=""></img>
        </div>
      }
      <div className="ProfileName">
        {data.user.firstName} "{data.user.nickName}" {data.user.lastName}{data.user.isLogged === "online" ? <div className="userLogged" /> : (data.user.isLogged === "ingame" ? <div className="userInGame" /> : <div className="userNotLogged" />)}
      </div>
      <div className="user management">
        {data.user?.username !== data.me?.username ? (
          myBlackList.find((users) => users.username === data.user.username) ? (
            <CheckCircle onClick={(e) => { handleWhitelist(data.user.username); }} />)
            : (<>
              <UserAdd onClick={handleAddfriend} />
              <Ban onClick={(e) => { handleBlacklist(data.user.username); }} />
            </>
            )
        ) : null}
        {data.me?.isAdmin &&
          data.user.isAdmin === false &&
          data.user.username !== data.me?.username ? (
          <ChevronDoubleUp onClick={handlePromoteAdmin} />
        ) : null}
        {data.me?.isAdmin && data.user.username === data.me?.username ? (
          <ChevronDoubleDown onClick={handleDemoteAdmin} />
        ) : null}
      </div>
      <img
        className="rank-img"
        src={`${process.env.PUBLIC_URL}/${ranks[rank]}`}
        alt=""
      ></img>
      <p id="my-pong-points">{data.user.PP} PP</p>
      <p id="goal-average"> {stats?.GA} GA </p>
      <div className="Stats">
        <p className="normal-Stats">
          {stats?.normal?.played ? stats?.normal?.winrate : "No game"}
          <br />
          {stats?.normal?.played}
        </p>
        <p className="ranked-Stats">
          {stats?.ranked?.played ? stats?.ranked?.winrate : "No game"}
          <br />
          {stats?.ranked?.played}
        </p>
      </div>
    </div>
  );
}
