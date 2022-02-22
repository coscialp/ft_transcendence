import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Socket } from "socket.io-client";
import { gameSocket, ip } from "../../App";
import './home.css'
import { Open_Message } from "./privateMessage";
import { ArrowSmUp } from 'heroicons-react'
//import { gameSocket } from "../../App";

export function Friendlist({currentChat, setCurrentChat}: any) {
  const [cookies] = useCookies();
  const [friends, setFriends] = useState([]);
  // eslint-disable-next-line
  const [socket, setSocket] = useState<Socket>();
  const [random, setRandom] = useState<number>();
  let history = useHistory();

  function FriendRequest() {
    axios.request({
      url: '/user/me/friends',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
    }).then((response: any) => {
      setFriends(response.data.friends);
    })
  }


  useEffect(() => {
    let mounted = true;

    if (mounted) {
      FriendRequest()
      setRandom(Math.floor(Math.random() * 2000000000 - 1));
    }

    const interval = setInterval(() => {
      let mounted = true;

      if (mounted) { FriendRequest() }

      return () => { mounted = false }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [cookies])

  function handleDeleteFriends(friendToDelete: any) {
    axios.request({
      url: '/user/friends/remove',
      method: 'delete',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      },
      data: {
        'idToDelete': friendToDelete.username
      }
    }).then(response => FriendRequest())
  }

  function handleBlacklist(friendToDelete: any) {
    
    axios.request({
      url: '/user/blacklist/add',
      method: 'patch',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      },
      data: {
        'newBlackListId': friendToDelete.username
      }
    }).then(response => FriendRequest())
  }

  useEffect(() => {
    if (socket) {
      socket.on(`getSpectateID/${random}`, (gameID: number) => {
        
        localStorage.setItem('GameID', String(gameID));
        localStorage.setItem('playerID', "spectator");
        return history.push('/game');
      });
    }
  }, [random, socket, history]);

  function goGame(friend: any) {
    if (socket) {
      socket.emit('getSpectateID', { username: friend.username, id: random });
    }
  }

  function Open_FriendList() {
    var FriendList: any = document.getElementById('friendListMini')
    var allFriendListOpen: any = document.getElementById('allFriendListOpen')
    var arrowR: any = document.getElementById('friendArrowR')
    var arrowL: any = document.getElementById('friendArrowL')
    var friendlistOrientation: any = document.getElementById('friendlistOrientation')
    if (FriendList.style.height === '52vh') {
        FriendList.style.transition = 'all .5s ease-in-out'
        FriendList.style.height = '50px'
        FriendList.style.overflowY = 'hidden'
        FriendList.style.transform = 'rotate(-90deg)'
        FriendList.style.right = '-23.5vh'
        FriendList.style.bottom = '50vh'
        FriendList.style.zindex = '1000'
        FriendList.style.width = '50vh'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(0deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(0deg)'
        allFriendListOpen.style.display = 'none'
        friendlistOrientation.style.transform = 'rotate(90deg)' 
        friendlistOrientation.style.writingMode = 'vertical-rl' 
        friendlistOrientation.style.textOrientation = 'upright' 
    }
    else {
        FriendList.style.transition = 'all .5s ease-in-out'
        FriendList.style.height = '52vh'
        FriendList.style.overflowY = 'scroll'
        FriendList.style.overflowX = 'hidden'
        FriendList.style.transform = 'rotate(0deg)'
        FriendList.style.right = '0'
        FriendList.style.bottom = '28vh'
        FriendList.style.zindex = '1000'
        FriendList.style.width = '50vw'
        arrowR.style.transition = 'transform 0.5s ease-in-out'
        arrowR.style.transform = 'rotate(180deg)'
        arrowL.style.transition = 'transform 0.5s ease-in-out'
        arrowL.style.transform = 'rotate(-180deg)'
        allFriendListOpen.style.display = 'flex'
        allFriendListOpen.style.flexDirection = 'column'
        friendlistOrientation.style.transform = 'none' 
        friendlistOrientation.style.writingMode = 'unset' 
        friendlistOrientation.style.textOrientation = 'unset' 
      }

}

  function handleDuel(friend: any) {
      gameSocket.emit('duel', {username: friend.username})
  } 


  return (
    <div className="FriendElement" >
      <div id="friendListMini">
          <div id="OpenFriendList" onClick={() => { Open_FriendList()}}>
            <ArrowSmUp id="friendArrowR" onClick={() => Open_FriendList()} />
            <p id="friendlistOrientation">FriendList</p>
            <ArrowSmUp id="friendArrowL" onClick={() => Open_FriendList()} />
          </div>
          <div id="allFriendListOpen">{friends.map((friend: any) => (
            <details key={friend.id} id={friend.id} >
              <summary className="FriendList"><img className="imgFriendList" src={friend.profileImage} alt=""></img> {friend.username}</summary>
              <nav className="menuFriendList">
                <button className="friendBtn" onClick={e => {document.getElementById(friend.id)?.removeAttribute("open") ; Open_Message(); setCurrentChat(friend.username)}} ><span /><span /><span /><span />Send message</button>
                <button className="friendBtn"  ><span /><span /><span /><span />Invite game</button>
                <button className="friendBtnOut friendBorder" onClick={() => {handleDeleteFriends(friend)}}><span /><span /><span /><span />Delete friend</button>
                <button className="friendBtnOut"  onClick={() => {handleDeleteFriends(friend); handleBlacklist(friend)}}><span /><span /><span /><span />Blacklist</button>
              </nav>
            </details>
          ))}
          </div>
      </div>
      
      <p className="FriendTitle" >FriendList</p>
      <div className="allFriendList">{friends.map((friend: any) => (
        <details key={friend.id} id={friend.id} >
          <summary className="FriendList"><img className="imgFriendList" src={friend.profileImage} alt=""></img> {friend.username}</summary>
          <nav className="menuFriendList">
            <button className="friendBtn" onClick={e => { document.getElementById(friend.id)?.removeAttribute("open"); Open_Message(); setCurrentChat(friend.username) }} ><span /><span /><span /><span />Send message</button>
            <button className="friendBtn" onClick={() => { handleDuel(friend)} } ><span /><span /><span /><span />Invite game</button>
            <button className="friendBtnOut friendBorder" onClick={() => { handleDeleteFriends(friend) }}><span /><span /><span /><span />Delete friend</button>
            <button className="friendBtnOut" onClick={() => { handleDeleteFriends(friend); handleBlacklist(friend) }}><span /><span /><span /><span />Blacklist</button>
            <button className="friendBtn" onClick={() => goGame(friend)}><span /><span /><span /><span />Spectate Game</button>
          </nav>
        </details>
      ))}
      </div>
    </div>
  )
}
