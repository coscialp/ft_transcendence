import React from 'react';
import { withCookies } from 'react-cookie';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Cookies } from './components/cookies/cookies';
import { Login } from './components/login/login';
import { Register } from './components/login/register';
import { SignUp } from './components/login/signUp';
import { Home } from './components/home/home';
import { Play } from './components/play/play';
import './App.css';
import { Profile } from './components/profile/profile';
import { NotFound } from './components/notFound';
import { Settings } from './components/settings/settings';
import { Notification } from './components/profile/notification';
import { TwoFA } from './components/login/TwoFA';
import { InGame } from './components/play/game';
import Resume from './components/play/resume';
import AllHistory from './components/profile/allHistory';
import Connect from './components/login/connect';
import { NavBar } from './components/navbar/navbar';

export const ip = window.location.hostname;


function Menu() {
	const page = window.location.pathname.split('/')[1];
	
	return (
		<>
			<NavBar page={page} />
			<Route exact path={"/home"} component={Home} />
			<Route exact path={"/play"} component={Play} />
			<Route exact path={"/alerts"} component={Notification} />
			<Route path={"/settings"} component={Settings} />
			<Route path={"/:id/profile"} component={Profile} />
			<Route path={"/:id/history"} component={AllHistory} />
		</>
	)
}

function App() {

	return (
		<Router>
			<Switch>
				<Route exact path={'/'} component={Login} />
				<Route path={"/oauth/redirect"} component={Connect} />
				<Route path={"/register"} component={Register} />
				<Route exact path={"/signup"} component={SignUp} />
				<Route path={"/cookies"} component={Cookies} />
				<Route path={"/2fa"} component={TwoFA} />
				<Menu />
				<Route path={"/game"} component={InGame} />
				<Route path={"/resume"} component={Resume} />

				<Route component={NotFound} />
			</Switch>
		</Router>
	);
}

export default withCookies(App);
