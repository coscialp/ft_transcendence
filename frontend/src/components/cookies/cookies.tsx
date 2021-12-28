import axios from "axios";
import React, { ReactElement } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";

const ip = window.location.hostname;

export function Cookies(props: any): ReactElement {
    const [cookies, setCookie] = useCookies(["access_token"]);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  	const token = urlParams.get("token");

    function HandleCookie(cookies: any): any {
      cookies = null;
      let TwoFactor;
      setCookie("access_token", token, { path: "/" });

      axios.request({
        url: '/user/2FA',
        method: 'get',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${cookies.access_token}`,
        },
        }).then((response: any) => {TwoFactor = response.data.twoFactorAuth})

      return TwoFactor ? <Redirect to="/2fa" /> : <Redirect to="/home" />;
  }

  return (
      <div>
          {HandleCookie(cookies)}
      </div>
  );
}