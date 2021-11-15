import React, { ReactElement } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";

export function Cookies(props: any): ReactElement {
    const [cookies, setCookie] = useCookies(["access_token"]);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  	const token = urlParams.get("token");

    function HandleCookie(cookies: any): any {
      cookies = null;
      setCookie("access_token", token, { path: "/" });
      return (<Redirect to="/home" />);
  }

  return (
      <div>
          {HandleCookie(cookies)}
      </div>
  );
}