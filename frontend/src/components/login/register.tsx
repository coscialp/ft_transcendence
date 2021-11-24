import React from "react";
import { Redirect } from "react-router";
import RegisterForm from "./register.form";

export function Register() {

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const err = urlParams.get("error");


	if (err) {
		alert(`Error: ${err} !\nIf you want to connect with 42 you must authorize !`)
		return (<Redirect to={{
			pathname: '/',
			state: { reason: `${err}` }
		  }} />)
	}

	return (
		<div className="bg">
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<div id="log-box">
				Welcome
				<RegisterForm />
			</div>
		</div>
	);
}