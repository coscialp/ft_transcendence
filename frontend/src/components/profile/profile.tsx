import React from 'react'
import { Historymatch } from './history'
import { User } from './user'



export class Profile extends React.Component {
    render() {
      return (
        <div>
            <Historymatch />
            <User />
        </div>
      );
    }
  }