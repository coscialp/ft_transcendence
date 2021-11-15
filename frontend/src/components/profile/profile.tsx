import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router';
import { Historymatch } from './history'
import { User } from './user'

async function isLogged(cookies: any, setUnauthorized: any) {
  
	await axios.request({
		url: '/user/me',
		method: 'get',
		baseURL: 'http://localhost:5000',
		headers: {
			"Authorization": `Bearer ${cookies.access_token}`,
		}
		}).catch(err => {
			if (err.response.status === 401) {          
				setUnauthorized(true);
			}
	});
	setUnauthorized(false);
}

export function Profile() {

	const [unauthorized, setUnauthorized] = useState(false);
  const [cookies] = useCookies();
  
  useEffect(()=>{
    isLogged(cookies, setUnauthorized);
  }, [cookies])

  if (unauthorized) {
    return (<Redirect to="/" />);
  } 

		return (
			<div>
				<Historymatch />
				<User />
			</div>
		);
}