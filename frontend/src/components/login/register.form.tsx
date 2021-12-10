import './login.css'
import React from 'react'
import axios, { AxiosResponse } from 'axios';

const ip = window.location.hostname;

export class RegisterForm extends React.Component<{}, { username: string, password: string }> {
  constructor(props: {username: string, password: string}) {
      super(props);
      this.state = {username: '', password: ''};
  
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*handleAlreadyLogged() {
      const user = sessionStorage.getItem("me");

      if (user !== null && JSON.parse(user).data.nickName) {
        window.open(`http://${ip}:3000/home`, '_self');
      }
    }*/

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
        baseURL: `http://${ip}:5000`,
        params: {
            "code": code,
            "nickName": this.state.username,
        }
      }
      ).then((response: AxiosResponse<any, any>) =>  {window.open(`http://${ip}:3000/cookies?token=${response.data.accessToken}`, '_self')});
      event.preventDefault();
    }

    render() {
      //this.handleAlreadyLogged();
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="logs">
				Username<br/>
				<input type="text" className="InputStyle" placeholder="Enter your Username" value={this.state.username} onChange={this.handleChangeUser} />
			</div>
            <input className="log-button InputStyle" type="submit" value="Register" />
        </form>
      );
    }
  }

export default RegisterForm