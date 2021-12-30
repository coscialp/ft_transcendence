import './login.css'
import './signup.css'
import React, { useState } from 'react'
import axios from 'axios';

const ip = window.location.hostname;

export function SignForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  /*function FirstSlideNext() {
    if (username !== "" && password !== "") {
      document.getElementById("slides")!.style.transform = "translateX(-33%)"
    }
    else {
      document.getElementById("InputStyle")!.style.boxShadow = "1px 1px 5px red";
    }
  }*/

  function handleSubmit(event: any) {
    console.log("here");

    axios.request({
      url: '/auth/signup',
      method: 'post',
      baseURL: `http://${ip}:5000`,
      data: {
        username: username,
        password: password,
        firstName: firstname,
        lastName: lastname,
        nickName: nickname,
        profileImage: null,
        email: email,
      }
    }
    ).then((response) => { console.log(response); window.open(`http://${ip}:3000/`, '_self') });
    event.preventDefault();
  }

  return (
    <div id='slides' >

      <div className='single slide'>
        <div className="logs">
          Username<br />
          <input type="text" className="InputStyle" placeholder="Enter your Username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
        </div>
        <div className="logs">
          Password<br />
          <input type="password" className="InputStyle" placeholder="Enter your Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
        </div>
        <button className='btn Next' onClick={(e) => { document.getElementById("slides")!.style.transform = "translateX(-33%)" }} >Next</button>
      </div>

      <div className='single slide'>
        <div className="logs">
          Firstname<br />
          <input type="text" className="InputStyle" placeholder="Enter your Firstname" value={firstname} onChange={(e) => { setFirstname(e.target.value) }} />
        </div>
        <div className="logs">
          Lastname<br />
          <input type="text" className="InputStyle" placeholder="Enter your Lastname" value={lastname} onChange={(e) => { setLastname(e.target.value) }} />
        </div>
        <button className='btn Next' onClick={(e) => { document.getElementById("slides")!.style.transform = "translateX(0%)" }} >Back</button>
        <button className='btn Next' onClick={(e) => { document.getElementById("slides")!.style.transform = "translateX(-66%)" }} >Next</button>
      </div>

      <div className='single slide'>
        <div className="logs">
          Nickname<br />
          <input type="text" className="InputStyle" placeholder="Enter your Nickname" value={nickname} onChange={(e) => { setNickname(e.target.value) }} />
        </div>
        <div className="logs">
          Email<br />
          <input type="text" className="InputStyle" placeholder="Enter your Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <button className='btn Next' onClick={(e) => { document.getElementById("slides")!.style.transform = "translateX(-33%)" }} >Back</button>
        <button className='btn Next' onClick={handleSubmit} >Submit</button>
      </div>

    </div>
  );
}
