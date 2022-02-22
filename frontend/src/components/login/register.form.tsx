import "./login.css";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { ip } from "../../App";

export class RegisterForm extends React.Component<
  {},
  { username: string; password: string }
> {
  constructor(props: { username: string; password: string }) {
    super(props);
    this.state = { username: "", password: "" };

    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUser(event: any) {
    this.setState({ username: event.target.value });
  }

  handleSubmit(event: any) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    axios
      .request({
        url: "/channel/General",
        method: "get",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((response) => {
          axios.request({
            url: "/channel/create",
            method: "post",
            baseURL: `http://${ip}:5000`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              name: 'General',
              password: ''
            }
          });
      });
      
      axios.request({
        url: "/channel/join",
        method: "patch",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: 'General',
          password: ''
        }
      });

      axios
      .request({
        url: "/user/me/nickname",
        method: "patch",
        baseURL: `http://${ip}:5000`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          nickname: this.state.username,
        },
      })
      .then((response: AxiosResponse<any, any>) => {
        window.open(`http://${ip}:3000/home`, "_self");
      });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="logs">
          Username
          <br />
          <input
            type="text"
            className="InputStyle"
            placeholder="Enter your Username"
            value={this.state.username}
            onChange={this.handleChangeUser}
          />
        </div>
        <input
          className="log-button InputStyle"
          type="submit"
          value="Register"
        />
      </form>
    );
  }
}

export default RegisterForm;
