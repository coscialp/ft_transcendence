import { useEffect, useRef, useState } from "react";

const ip = window.location.hostname;

export function MainMenu() {

    const [messages, setMessages] : any = useState([]);
    const [messageBody, setMessageBody] = useState('');
    
    const MainChat: any = useRef();
    
    useEffect(() => {

      MainChat.current = new WebSocket(`ws://${ip}:5001`);

      MainChat.current.onmessage = function (event: MessageEvent<any>) {
      console.log("OnMessage");
      
      const message = JSON.parse(event.data);
		  setMessages((_messages: any) => [..._messages, message]);
      event.preventDefault()
    }
    return () => { };
}, []);

    function handleSendMessage(e: any) {
      console.log("Submit");

      MainChat.current.send(JSON.stringify({sender: "name", body: messageBody}) );
        setMessageBody("");
        e.preventDefault()
      }

      return (
        <div className="MainElement" >
            <div className="Message Container" >
              {messages.map((message: any) => (
                <article key={message.sentAt} className='message-container'>
                <p className='message-body'>{message.body}</p>
              </article>
				      ))}
            </div>
            <form onSubmit={ handleSendMessage } >
                <input type="text" className="MainSendMessage" placeholder="Message..." value={ messageBody } onChange={(e) => setMessageBody(e.target.value)} />
            </form>
        </div>
    )
}