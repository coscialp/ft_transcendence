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
import { GameModSelection } from './components/play/mod_selection'
import { Profile } from './components/profile/profile'
import Particles from 'react-tsparticles';

function App() {

  return (
    <Router>
      <BackGround/>
      <Particles id="tsparticles"
      options={{
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 1,
            },   
            repulse: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#B0E0E6",
          },
          links: {
            color: "#ADD8E6",
            distance: 100,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 125,
          },
          opacity: {
            value: 0.2,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }}/>
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
