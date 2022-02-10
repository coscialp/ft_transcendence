import axios from "axios";
import React, { ReactElement, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ip } from "../../App";

export function Cookies(props: any): ReactElement {
  // eslint-disable-next-line
  const [cookies, setCookies] = useCookies(["access_token"]);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("token");

  function HandleCookie(): any {
    setCookies("access_token", token, { path: "/" });
    useEffect(() => {

      let mounted = true;
      axios.request({
        url: '/user/2FA/active',
        method: 'get',
        baseURL: `http://${ip}:5000`,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }).then((response: any) => {
        if (mounted) {
          response.data.twoFactorAuth ? window.open(`http://${ip}:3000/2fa`, '_self') : 
          axios.request({
            url: '/user/me/nickname',
            method: 'get',
            baseURL: `http://${ip}:5000`,
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }).then((response: any) => {
            response?.data?.nickname !== null ? window.open(`http://${ip}:3000/home`, '_self') : window.open(`http://${ip}:3000/register?token=${token}`, '_self')
          });
        }
      })
      return (() => {mounted = false})
    }, [])

  }

  return (
    <div>
      {HandleCookie()}
    </div>
  );
}