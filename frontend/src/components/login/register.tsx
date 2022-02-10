import React from "react";
import RegisterForm from "./register.form";

export function Register() {

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