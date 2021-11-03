import './login.css'
import React from 'react'
import axios from 'axios';
import { Redirect } from 'react-router';

export class RegisterForm extends React.Component<{}, { username: string, password: string }> {
    constructor(props: {username: string, password: string}) {
      super(props);
      this.state = {username: '', password: ''};
  
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeUser(event: any) {
      this.setState({username: event.target.value});
    }

  
    handleSubmit(event: any) {
        
        const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const code = urlParams.get("code");

      console.log('NickName: ' + this.state.username)
      axios.request({
        url: '/auth/api42/signin',
        method: 'post',
        baseURL: 'http://localhost:5000',
        params: {
            "code": code,
            "nickName": this.state.username,
        }
      }
      )
      event.preventDefault();
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="logs">
				Username<br/>
				<input type="text" placeholder="Enter your Username" value={this.state.username} onChange={this.handleChangeUser} />
			</div>
            <input className="log-button" type="submit" value="Register" />
        </form>
      );
    }
  }

export default RegisterForm