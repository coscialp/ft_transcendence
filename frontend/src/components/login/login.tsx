import React from "react";
import './login.css'
import { LogForm } from './login.form'

export function Login() {
		return (
			<div className="bg">
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<div id="log-box">
					<LogForm />
					<div className="or-line">
						<div className="line"></div>OR<div className="line"></div>
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
