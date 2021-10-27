import React, { ReactElement } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Login, getCode } from './components/login/login';
import { SignUp } from './components/login/signUp';

function App(): ReactElement {
  return (
    <Router>
    <main>
      <Route exact path={'/'} component={ Login }/>
      <Route path={"/oauth/redirect"} component={ getCode } />
			<Route exact path={"/signin"} component={ SignUp } />
    </main>
    </Router>
  );
}

export default App;
