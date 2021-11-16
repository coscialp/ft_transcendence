import React from 'react';
import { withCookies } from 'react-cookie';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Cookies } from './components/cookies/cookies';
import { Login } from './components/login/login';
import { Register } from './components/login/register';
import { SignUp } from './components/login/signUp';
import { Home } from './components/home/home';
import { BackGround } from './components/background/BackGround'
import { NavBar } from './components/navbar/navbar'
import { GameModSelection } from './components/play/mod_selection';
import { Profile } from './components/profile/profile';


function App() {

  return (
    <Router>
      <BackGround/>
      <NavBar />
      <main>
      <Route exact path={'/'} component={ Login } />
      <Route path={"/oauth/redirect"} component={ Register } />
			<Route exact path={"/signup"} component={ SignUp } />
      <Route path={"/cookies"} component={ Cookies } />
      <Route exact path={"/home"} component={Home} />
      <Route exact path={"/play"} component={ GameModSelection }/>
      <Route exact path={"/profile"} component={ Profile }/>
    </main>
    </Router>
  );
}

export default withCookies(App);
