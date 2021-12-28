import './login.css'
import React from 'react'
import axios, { AxiosResponse } from 'axios';
import { render } from '@testing-library/react';

const ip = window.location.hostname;

export class SignForm extends React.Component<{}, { username: string, password: string, firstname: string, lastname: string, nickname: string, email: string }> {
  constructor(props: { username: string, password: string, firstname: string, lastname: string, nickname: string, email: string }) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      nickname: '',
      email: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: any) {
    console.log("here");

    /*axios.request({
      url: '/auth/signup',
      method: 'post',
      baseURL: `http://${ip}:5000`,
      data: {
        username: this.state.username,
        password: this.state.password,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        nickName: this.state.nickname,
        profileImage: null,
        email: this.state.email,
      }
    }
    ).then((response: AxiosResponse<any, any>) => { window.open(`http://${ip}:3000/signIn/new`, '_self') });*/
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="logs">
          Username<br />
          <input type="text" className="InputStyle" placeholder="Enter your Username" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} />
        </div>
        <div className="logs">
          Password<br />
          <input type="password" className="InputStyle" placeholder="Enter your Password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
        </div>

        <input className="log-button InputStyle" type="submit" value="Sign In" />
      </form>
    );
  }
}

export default SignForm