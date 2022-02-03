import axios from "axios"
import { useState } from "react";
// import { useHistory } from 'react-router';
import { useCookies } from "react-cookie";
import "./duel.css";
import { ip } from '../../App';

export function Duel() {
    // let history = useHistory();
    const [cookies] = useCookies();
    const [search, setSearch] = useState("");
    const [searchedUsers, setSearchedUsers]: any = useState([]);
    const [searchingPop, setSearchingPop] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [inviteUsr, setInviteUsr] = useState("");

    function handleInputSearch(e: any) {
      setSearch(e.target.value)
      if (e.target.value) {
        axios.request({
          url: `/user`,
          method: 'get',
          baseURL: `http://${ip}:5000`,
          headers: {
            "Authorization": `Bearer ${cookies.access_token}`,
          },
          params: {
            "search": e.target.value,
          }
        }).then((response: any) => {
          setSearchedUsers(response.data);
        })
        setSearchingPop(true);
      }
      else { setSearchingPop(false); }
    }

    function handleSearch(e: any) {

      if (search) {
        axios.request({
          url: `/user`,
          method: 'get',
          baseURL: `http://${ip}:5000`,
          headers: {
            "Authorization": `Bearer ${cookies.access_token}`,
          },
          params: {
            "search": search,
          }
        }).then((response: any) => {
          setSearchedUsers(response.data);
        })
      }
      e.preventDefault()
    }

    function PopUpDuel() {
      console.log(popUp);
      /*if (e.target.value) {
        axios.request({
          url: `/user`,
          method: 'get',
          baseURL: `http://${ip}:5000`,
          headers: {
            "Authorization": `Bearer ${cookies.access_token}`,
          },
          params: {
            "duel": duel,
          }
        }).then((response: any) => {
          launchDuelGame(response.data);
        })
      }
      e.preventDefault()
      }*/
    }
  
    function SearchingList() {
      return (
        <div className="duelSearching list" >
          {searchedUsers.map((users: any) => (
            <div className="duelList" key={users.username} onClick={(e) => { setInviteUsr(users.username) ; setPopUp(true); PopUpDuel() }} >
              <div className="duelNick list" > {users.nickName}
                <div className="duelUser list"> {users.username} </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  
    return (
      <div className="duelElement" >
        <p className="duelTitle" >Duel</p>
        <div className="prof-duelSearch">
          <form onSubmit={handleSearch} >
            <input type="text" className="duelSearchBar" placeholder="Search" value={search} onChange={handleInputSearch} />
          </form>
        {searchingPop ? <SearchingList /> : null }
        </div>
        <div>
        {popUp === true ? 
          <div className="duelPage">
            <div className="duelPopUp"> 
              <p>Waiting for {inviteUsr} to accept your invite</p>
              <div className="cancel-container">
              <span className='cancel-cross' onClick={e => {setPopUp(false)}} >
                <div className="leftright"></div>
                <div className="rightleft"></div>
                <label className="cancel">cancel</label>
              </span>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
              <div className="duelBox">
	              <button className="button-duelBox" onClick={e => {}}>Go game</button>
              </div>
            </div>
          </div>
        : null}
        </div>
      </div>
    )
  }