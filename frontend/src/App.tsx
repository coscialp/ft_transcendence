import React, { ReactElement } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Cookies } from './components/cookies/cookies';
import { Login } from './components/login/login';
import { Register } from './components/login/register';
import { SignUp } from './components/login/signUp';

function App(): ReactElement {
  return (
    <Router>
    <main>
      <Route exact path={'/'} component={ Login }/>
      <Route path={"/oauth/redirect"} component={ Register } />
			<Route exact path={"/signup"} component={ SignUp } />
      <Route path={"/cookies"} component={ Cookies } />
    </main>
    </Router>
  );
}

export default App;
