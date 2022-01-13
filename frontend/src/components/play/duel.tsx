import axios from "axios"
import { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import { useCookies } from "react-cookie";
import "./duel.css";
import { PlayOutline } from 'heroicons-react';
import { ip } from '../../App';

export function Duel() {
    let history = useHistory();
    const [cookies] = useCookies();
    const [search, setSearch] = useState("");
    const [searchedUsers, setSearchedUsers]: any = useState([]);
    const [searchingPop, setSearchingPop] = useState(false);

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
  
    function SearchingList() {
      return (
        <div className="duelSearching list" >
          {searchedUsers.map((users: any) => (
            <div className="duelList" key={users.username} onClick={(e) => { history.push(`/${users.username}/profile`) }} >
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
      </div>
    )
  }