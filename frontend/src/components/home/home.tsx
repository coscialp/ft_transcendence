import React from 'react';
import History from './history'
import Stream from './stream'
import Actuality from './actuality'
import FriendList from './friendlist'
import Message from './message'

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