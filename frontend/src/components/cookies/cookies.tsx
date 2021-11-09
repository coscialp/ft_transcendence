import React from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";

export function Cookies(this: any) {
    const [cookies, setCookie] = useCookies(["access_token"]);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
	const token = urlParams.get("token");

    function HandleCookie(): any {
        setCookie("access_token", token, {
      path: "/"
    });
  }
  return (
      <div>
          {HandleCookie()}
          <Redirect to="/home" />
      </div>
  );
}