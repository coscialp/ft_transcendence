import React, { useEffect, useState } from 'react';
import History from './history'
import Stream from './stream'
import Actuality from './actuality'
import FriendList from './friendlist'
import Message from './message'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router';
//async function isLogged(cookies: any, setUnauthorized: any) {
//  
//    await axios.request({
//      url: '/user/me',
//      method: 'get',
//      baseURL: 'http://localhost:5000',
//      headers: {
//        "Authorization": `Bearer ${cookies.access_token}`,
//      }
//      }).catch(err => {
//        if (err.response.status === 401) {          
//          setUnauthorized(true);
//        }
//    });
//  setUnauthorized(false);
//}

export function Home() {
  //const [unauthorized, setUnauthorized] = useState(false);
  //const [cookies] = useCookies();
  
  //useEffect(()=>{
  //  isLogged(cookies, setUnauthorized);
  //}, [cookies])

  //if (unauthorized) {
  //  return (<Redirect to="/" />);
  //} 

    return (
      <div>
        
        <History />
        <Actuality />
        <FriendList />
        <Message />
    </div>
    );
}