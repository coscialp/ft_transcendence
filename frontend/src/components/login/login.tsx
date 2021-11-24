import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import './login.css'
import { LogForm } from './login.form'

const ip = window.location.hostname;

async function isLogged(cookies: any, setUnauthorized: any) {

    await axios.request({
      url: '/user/me',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
      }).catch(err => {
        if (err.response.status === 401) {
          setUnauthorized(true);
		  return;
        }
    });
  setUnauthorized(false);
}

export function Login() {

	const [unauthorized, setUnauthorized] = useState(false);
  	const [cookies] = useCookies();
  
  	useEffect(()=>{
		isLogged(cookies, setUnauthorized);
  	}, [cookies])

  	if (unauthorized === true) {
    	return (<Redirect to="/" />);
  	}

		return (
			<div className="bg">
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<div id="log-box">
					<LogForm />
					<div className="or-line">
						<div className="line"></div>OR<div className="line"></div>
					</div>
					<button className="i42-button" onClick={() => window.open(`https://api.intra.42.fr/oauth/authorize?client_id=3a68ec0578b1ddb8b72705c05b0e73ef78ff5a1775aa2fe801d02e5437c98a79&redirect_uri=http%3A%2F%2F${ip}%3A3000%2Foauth%2Fredirect&response_type=code`, '_self')}>
						<img className="i42-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/langfr-280px-42_Logo.svg.png" alt="" />
						Connect with 42
					</button><br />
					<a href="signup" rel="noreferrer" className="sign-in">New user ? Sign up</a>
				</div>
			</div>
		);
}
