import React, { ReactElement } from 'react';
import { useCookies, withCookies } from 'react-cookie';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Cookies } from './components/cookies/cookies';
import { Login } from './components/login/login';
import { Register } from './components/login/register';
import { SignUp } from './components/login/signUp';
import { Home } from './components/test';

function App(): ReactElement {
  return (
    <Router>
    <main>
      <Route exact path={'/'} component={ Login }/>
      <Route path={"/oauth/redirect"} component={ Register } />
			<Route exact path={"/signup"} component={ SignUp } />
      <Route path={"/cookies"} component={ Cookies } />
      <Route exact path={"/home"} component={ Home } />
    </main>
    </Router>
  );
}

export default withCookies(App);
