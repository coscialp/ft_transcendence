import { useState } from "react";
//import { MessageContainer } from "./messageContainer";

export function MainMenu() {

    const [message, setMessage] = useState("");

    function handleGetMessage(e: any) {
        setMessage(e.target.value)
        e.preventDefault()
    }

    function handleSendMessage(e: any) {
        console.log(message)
        setMessage("");
        e.preventDefault()
      }

    return (
        <div className="MainElement" >
            <div className="Message Container" >
            </div>
            <form onSubmit={ handleSendMessage } >
                <input type="text" className="MainSendMessage" placeholder="Message..." value={ message } onChange={ handleGetMessage } />
            </form>
        </div>
    )
}