import React, { Component } from 'react';
import Message from '../home/message'
import GameMod from './gamemod'

export class GameModSelection extends Component {
  render() {
    return (
      <div>
          <GameMod />
          <Message />
    </div>
    );
  }
}
