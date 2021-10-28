import React, { ReactElement } from "react";
import './login.css'
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { LogForm } from './login.form'

function Request_token_42(code: string | null) {
	axios.request({
		url: "/oauth/token",
		method: "post",
		baseURL: "https://api.intra.42.fr",
		auth: {
			username: "3a68ec0578b1ddb8b72705c05b0e73ef78ff5a1775aa2fe801d02e5437c98a79",
			password: "9944807a22d32f2777f88bdbe170d6144548d057ec5e39d5f8a7aec2775f05fc",
		},
		data: {
			"grant_type": "client_credentials",
			"scope": "public"
		}
	}).then(function (res: any) {
		console.log(res.data);
		axios.request({
			url: "/oauth/token/info",
			method: "get",
			baseURL: "https://api.intra.42.fr",
			params: {
				"access_token": `${ res.data.access_token }`
			},
			auth: {
				username: "3a68ec0578b1ddb8b72705c05b0e73ef78ff5a1775aa2fe801d02e5437c98a79",
				password: "9944807a22d32f2777f88bdbe170d6144548d057ec5e39d5f8a7aec2775f05fc"
			},
			headers: { Authorization: `Bearer ${ res.data.access_token }` },
			data: {
				"grant_type": "client_credentials",
				"scope": "public"
			}
		}).then(function (res2: any) {
			console.log(res2.data);
		})
	});
}

export function GetCode(): any {

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const code = urlParams.get("code");
	console.log(code);
	Request_token_42(code);
	return (
		<Redirect to='/' />
	);
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
					<button className="i42-button" onClick={() => window.open("https://api.intra.42.fr/oauth/authorize?client_id=3a68ec0578b1ddb8b72705c05b0e73ef78ff5a1775aa2fe801d02e5437c98a79&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fredirect&response_type=code")}>
						<img className="i42-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/langfr-280px-42_Logo.svg.png" alt="" />
						Connect with 42
					</button><br />
					<a href="signin" rel="noreferrer" className="sign-in">New user ? Sign in</a>
				</div>
			</div>
		);
	}
}