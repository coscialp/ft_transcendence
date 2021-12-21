import { useState } from "react"

function NewUserForm() {

    const [Firstname, setFirstname] = useState("");
    const [Lastname, setLastname] = useState("");
    const [Nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");

    function handleSubmit(e :any) {
        console.log(Firstname , Lastname , Nickname , email)
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="logs">
                Firstname<br />
                <input type="text" className="InputStyle" placeholder="Enter your Username" value={Firstname} onChange={(e) => { setFirstname(e.target.value) }} />
            </div>
            <div className="logs">
                Lastname<br />
                <input type="text" className="InputStyle" placeholder="Enter your Password" value={Lastname} onChange={(e) => { setLastname(e.target.value) }} />
            </div>
            <div className="logs">
                Nickname<br />
                <input type="text" className="InputStyle" placeholder="Enter your Password" value={Nickname} onChange={(e) => { setNickname(e.target.value) }} />
            </div>
            <div className="logs">
                e-mail<br />
                <input type="text" className="InputStyle" placeholder="Enter your Password" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            </div>
            <input className="log-button InputStyle" type="submit" value="Sign In" />
        </form>
    )
}

export function NewUser() {

    return (
        <div className="bg">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div id="log-box">
                <div>Create your account</div>
                <NewUserForm />
            </div>
        </div>
    )
}