import React, { ReactElement } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
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
    </main>
    </Router>
  );
}

export default App;
