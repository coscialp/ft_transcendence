import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { isLogged } from "../../utils/isLogged";
import { NavBar } from "../navbar/navbar";
import { Normal } from "./normalGame";
import { Ranked } from "./rankedGame";
import { Duel } from "./duel";
import "./play.css";

export function Play() {
  const [cookies] = useCookies();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let mount = true;
    if (mount) {
      isLogged(cookies).then((res) => { setUnauthorized(res.unauthorized) });
    }
    return (() => { mount = false; });
  }, [cookies])

  if (!cookies.access_token || unauthorized) {
    return (<Redirect to="/" />);
  }

  return (
    <div>
      <NavBar page="Play" />
      <div className="PlayMain" >
        <Normal />
        <Ranked />
        <Duel />
      </div>
    </div>
  )
}