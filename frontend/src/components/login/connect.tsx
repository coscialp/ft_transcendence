import axios, { AxiosResponse } from "axios";
import { Redirect } from "react-router-dom";
import { ip } from "../../App";

export default function Connect() {

    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const code = urlParams.get("code");
	const err = urlParams.get("error");


	if (err) {
		alert(`Error: ${err} !\nIf you want to connect with 42 you must authorize !`)
		return (<Redirect to={{
			pathname: '/',
			state: { reason: `${err}` }
		  }} />)
	}

    axios.request({
        url: '/auth/api42/signin',
        method: 'post',
        baseURL: `http://${ip}:5000`,
        params: {
            "code": code,
            "nickName": null,
        }
      }
      ).then((response: AxiosResponse<any, any>) =>  {window.open(`http://${ip}:3000/cookies?token=${response.data.accessToken}`, '_self')});

      return (
          <div>
          </div>
      )

}