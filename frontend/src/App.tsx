import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Login, GetCode } from './components/login/login';
import { SignUp } from './components/login/signUp';

function App() {
  return (
    <Router>
    <main>
      <Route exact path={'/'} component={ Login }/>
      <Route path={"/oauth/redirect"} component={GetCode} />
			<Route exact path={"/signin"} component={ SignUp } />
    </main>
    </Router>
  );
}

export default App;
