import './login.css'
import React from 'react'
import axios, { AxiosResponse } from 'axios';
import { ip } from '../../App';

export class LogForm extends React.Component<{}, { username: string, password: string }> {
    constructor(props: any) {
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
      axios.request({
        url: '/auth/signin',
        method: 'post',
        baseURL: `http://${ip}:5000`,
        data: {
          username: this.state.username,
          password: this.state.password,
        }
      }).then((response: AxiosResponse<any, any>) =>  {window.open(`http://${ip}:3000/cookies?token=${response.data.accessToken}`, '_self')});
      event.preventDefault();
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="logs">
				Username<br/>
				<input type="text" className="InputStyle" placeholder="Enter your Username" value={this.state.username} onChange={this.handleChangeUser} />
			</div>
			<div className="logs">
				Password<br/>
				<input type="password" className="InputStyle" placeholder="Enter your Password" value={this.state.password} onChange={this.handleChangePass} />
			</div>
			
            <input className="log-button InputStyle" type="submit" value="Log In" />
        </form>
      );
    }
  }

export default LogForm
