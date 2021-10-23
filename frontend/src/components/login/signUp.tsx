import { SignForm } from './sign.form'
import './login.css'

export function SignUp() {
    return (
		<div className="bg">
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		    <div id="log-box">
				<div>Create your account</div>
			    <SignForm />
				<a href="/" rel="noreferrer" className="log-in">Already user ? Log in</a>
		    </div>
		</div>
	)
}
