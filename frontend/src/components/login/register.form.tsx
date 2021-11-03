import './login.css'
import React from 'react'
import axios from 'axios';

export class RegisterForm extends React.Component<{}, { username: string, password: string }> {
    constructor(props: {username: string, password: string}) {
      super(props);
      this.state = {username: '', password: ''};
  
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleChangePass = this.handleChangePass.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeUser(event: any) {
      this.setState({username: event.target.value});
    }

    handleChangePass(event: any) {
        this.setState({password: event.target.value});
      }
  
    handleSubmit(event: any) {
        
        const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const code = urlParams.get("code");

      console.log('Username: ' + this.state.username)
      console.log('Password: ' + this.state.password)
      axios.request({
        url: '/auth/signin',
        method: 'post',
        baseURL: 'http://localhost:5000',
        params: {
            "code": code,
            "nickname": this.state.username,
            "password": this.state.password,
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
			<div className="logs">
				Password<br/>
				<input type="password" placeholder="Enter your Password" value={this.state.password} onChange={this.handleChangePass} />
			</div>
			
            <input className="log-button" type="submit" value="Register" />
        </form>
      );
    }
  }

export default RegisterForm