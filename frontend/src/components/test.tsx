import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";

export function Home(): any {

    const [cookies] = useCookies();

	function Test(): any {

		axios.request({
			url: '/user/me',
			method: 'get',
			baseURL: 'http://localhost:5000',
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		  }).then((response: any) => { return(<div>{response.data.username}</div>) })

		  
	}

	return (
		<div>
            {Test()}
		</div>
	);
}
