import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Login, GetCode } from './components/login/login';
import { SignUp } from './components/login/signUp';
import { Home } from './components/home/home';
import { BackGround } from './components/background/BackGround'
import { NavBar } from './components/navbar/navbar'
import { GameModSelection } from './components/play/mod_selection'
function App() {
  return (
    <Router>
      <BackGround />
      <NavBar />
      <main>
        <Route exact path={'/'} component={Login} />
        <Route path={"/oauth/redirect"} component={GetCode} />
        <Route exact path={"/signin"} component={SignUp} />
        <Route exact path={"/home"} component={Home} />
        <Route exact path={"/play"} component={GameModSelection}/>
      </main>
    </Router>
  );
}

export default App;
