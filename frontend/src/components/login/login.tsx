import React from "react";
import './login.css'
import { LogForm } from './login.form'
import axios from "axios";


export async function Request_token_42(code: string | null): Promise<any> {
	await axios.request({
		url: "/oauth/token",
		method: "post",
		baseURL: "https://api.intra.42.fr",
		params: {
			"grant_type": "authorization_code",
			"client_id": "3a68ec0578b1ddb8b72705c05b0e73ef78ff5a1775aa2fe801d02e5437c98a79",
			"client_secret": "9944807a22d32f2777f88bdbe170d6144548d057ec5e39d5f8a7aec2775f05fc",
			"code": code,
			"redirect_uri": "http://localhost:3000/oauth/redirect",
		}
	}).then((res: any) => console.log(res));
}

export class Login extends React.Component {
	render() {
		return (
			<div className="bg">
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<div id="log-box">
					<LogForm />
					<div className="or-line">
						<hr className="line"></hr>OR<hr className="line"></hr>
					</div>
					<button className="i42-button" onClick={() => window.open("https://api.intra.42.fr/oauth/authorize?client_id=3a68ec0578b1ddb8b72705c05b0e73ef78ff5a1775aa2fe801d02e5437c98a79&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fredirect&response_type=code", '_self')}>
						<img className="i42-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/langfr-280px-42_Logo.svg.png" alt="" />
						Connect with 42
					</button><br />
					<a href="signup" rel="noreferrer" className="sign-in">New user ? Sign up</a>
				</div>
			</div>
		);
	}
}
