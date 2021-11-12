import React from 'react';
import History from './history'
import Stream from './stream'
import Actuality from './actuality'
import FriendList from './friendlist'
import Message from './message'
import '../utils/tailwind.generated.css'
//function Checkconnected()
//{
//  const [cookies, setCookie] = useCookies(["access_token"]);
//  var test = cookies.access_token;
//  console.log(test.lenght)
//
//}
//
//window.onbeforeunload = function () {
//  Checkconnected();
//}

export class Home extends React.Component {
  render() {
    return (
      <div>
        <History />
        <Actuality />
        <FriendList />
        <Stream />
        <Message />
    </div>
    );
  }
}