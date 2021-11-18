import React from 'react';
import { withCookies } from 'react-cookie';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Cookies } from './components/cookies/cookies';
import { Login } from './components/login/login';
import { Register } from './components/login/register';
import { SignUp } from './components/login/signUp';
import { Home } from './components/home/home';
import { Profile } from './components/profile/profile'
import { Play } from './components/play/play';
import './App.css';

function App() {

  return (
    <Router>
      <main>
      <Route exact path={'/'} component={ Login } />
      <Route path={"/oauth/redirect"} component={ Register } />
			<Route exact path={"/signup"} component={ SignUp } />
      <Route path={"/cookies"} component={ Cookies } />
      <Route exact path={"/home"} component={ Home } />
      <Route exact path={"/play"} component={ Play }/>
      <Route exact path={"/profile"} component={ Profile }/>
    </main>
    </Router>
  );
}

export default withCookies(App);
