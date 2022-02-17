import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";
import { ip } from "../../App";
import { isLogged } from "../../utils/isLogged";
import { useForm } from "react-hook-form";
import './settings.css'




export function Settings() {
	const [cookies] = useCookies();
	const [unauthorized, setUnauthorized] = useState(false);
	const [me, setMe]: any = useState({});
	const [newNick, setNewNick] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newAvatar, setNewAvatar] = useState("");
	const [previewAvatar, setPreviewAvatar] = useState<any>();
	const { handleSubmit } = useForm({
		mode: "onChange"
	});
	const onSubmit = (data:any) => {
		console.log(data);
	};

	function avatarChange(e:any) {
		setNewAvatar(e.target.files[0].name);
		e.setState({
			selectedFile: e.target.files[0],
            filename: (document.getElementById('file') as HTMLInputElement).value
		})
	  };

	useEffect(() => {
		let mount = true;
		if (mount) {
			isLogged(cookies).then((res) => { setMe(res.me?.data); setUnauthorized(res.unauthorized) });
		}
		return (() => { mount = false; });
	}, [cookies])

	if (!cookies.access_token || unauthorized) {
		return (<Redirect to="/" />);
	}


	function handleNewNickname(e: any) {
		if (newNick !== "") {
			axios.request({
				url: '/user/me/nickname',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				data: {
					"nickname": newNick,
				}
			})
			window.alert("Nickname successfully changed to " + newNick + " !")
			setNewNick("");
			e.preventDefault();
		}
	}

	function handleNewEmail(e: any) {
		if (newEmail !== "") {
			axios.request({
				url: '/user/me/email',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				data: {
					"email": newEmail,
				}
			})
			window.alert("Email successfully changed to " + newEmail + " !")
			setNewEmail("");
			e.preventDefault();
		}
	}

	const fileUploadHandler = (e:any) => {
		e.preventDefault() // Stop form submit
		let formData = new FormData();

        formData.append('name', e.state.name);
        formData.append('price', e.state.price);
        formData.append('filename', e.state.filename);
        formData.append('file', e.state.selectedFile);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        axios.post("http://localhost:3000", formData, config)
        .then (res => {
            console.log(res.data);
            console.log(e.state.filename);
            console.log(formData);
        })
	}

	/*
	
		console.log(newAvatar)
		console.log(previewAvatar)

		console.log(previewAvatar);
		const formData = new FormData();

		formData.append('file', previewAvatar);
		if (newAvatar !== "") {
			axios.request({
				url: '/upload/',
				method: 'post',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
					"Content-Type": "multipart/form-data; boundary=123",
				},
				data: formData,
			}).then((response: any) => {
				axios.request({
					url: '/user/me/avatar',
					method: 'patch',
					baseURL: `http://${ip}:5000`,
					headers: {
						"Authorization": `Bearer ${cookies.access_token}`,
					},
					data: {
						"avatar":  '/Users/coscialp/Project/transcendance/backend/' + response.data.path,
					}
				});
			})
			window.alert("Avatar successfully changed to " + newAvatar + " !")
			//setNewAvatar("");
			//setPreviewAvatar(e.target.null);
			//e.preventDefault();
	*/

	function handle2FA() {
		
		me.twoFactorAuth ?
			axios.request({
				url: '/user/2FA/deactivate',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			})
			:
			axios.request({
				url: '/user/2FA/activate',
				method: 'patch',
				baseURL: `http://${ip}:5000`,
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			})
	}

	return (
		<div>
			<div className="SettingsElement">
				<div className="SettingsMain">
					<div className="change Nickname">
						Change your Nickname !
						<div className="change Nick input" >
							<input type="text" className="changeNickPlaceholder" placeholder="New Nickname..." value={newNick} onChange={(e) => { setNewNick(e.target.value) }} />
							<button className="changeNickbtn" onClick={handleNewNickname} >Change !</button>
						</div>
					</div>
					<div className="change Nickname">
						Change your Email !
						<div className="change Nick input" >
							<input type="text" className="changeNickPlaceholder" placeholder="New Email..." value={newEmail} onChange={(e) => { setNewEmail(e.target.value) }} />
							<button className="changeNickbtn" onClick={handleNewEmail} >Change !</button>
						</div>
					</div>
					<div className="change Nickname">
						Change your Avatar !
						<form className="change Nick input" encType="multipart/form">
							<label form="file" className="avatarLabel">
								New Avatar...
								<input id="avatar" type="file" className="avatarInput" accept='image/png' onChange={(e) => avatarChange(e)} />
							</label>
							<button className="changeNickbtn" onClick={e => {fileUploadHandler(e)}} >Change !</button>
						</form>
						{previewAvatar && (
								<img
								src={URL.createObjectURL(previewAvatar)}
								alt="Thumb"
								width="64px"
								height="64px"
							  />
							)}
					</div>
					<div className="change Nickname">
						{me?.twoFactorAuth ?
						<div>
							Disable the 2FA !
							<input className="ToggleSwitchON" type="checkbox" id="switch" onClick={handle2FA} />
							<label className="ToggleSLabelON" htmlFor="switch"></label>
						</div>
						:
						<div>
							Enable the 2FA !
							<input className="ToggleSwitchOFF" type="checkbox" id="switch" onClick={handle2FA} />
							<label className="ToggleSLabelOFF" htmlFor="switch"></label>
						</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}