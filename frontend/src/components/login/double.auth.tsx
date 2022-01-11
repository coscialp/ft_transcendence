import { AES } from 'crypto-js'
import {send, init} from "emailjs-com";


export class DoubleAuth
{
    private token: string;
    private user_id: string;
    private email_template: string;
    private service_id: string;
    constructor()
    {
        this.token = "";
        this.user_id = "user_Ux9k0vdzGXxIHfcSFxgen";
        this.email_template = "send_email";
        this.service_id = "gmail";
    }

    public generate_token()
    {
        const n1 = Math.floor(1 + (Math.random() * (9-1)));
        const n2 = Math.floor(1 + (Math.random() * (9-1)));
        const n3 = Math.floor(1 + (Math.random() * (9-1)));
        const n4 = Math.floor(1 + (Math.random() * (9-1)));
        console.log(`number : ${n1}${n2}${n3}${n4}`)
        this.token = AES.encrypt(`${n1}${n2}${n3}${n4}`, 'AuthToken').toString();
    }
    public setMail(mail: string)
    {

    }
    public sendAuthToken(email: string)
    {
        console.log("my email : " + email)
        var bytes: string = AES.decrypt(this.token, 'AuthToken').toString();
        
        //console.log(`${this.user_id}${this.email_template}`)
        var decryptedData: string = bytes.toString()
        var param = {
            message: `${decryptedData[1]}${decryptedData[3]}${decryptedData[5]}${decryptedData[7]}`,
            dest: email,
        }
        console.log("ma bite : " + param.dest);
        init(this.user_id);
        send(this.service_id, this.email_template, param);
    }
    public verifyToken(token: string): number
    {
        var bytes: string = AES.decrypt(this.token, 'AuthToken').toString();
        var decryptedData: string = bytes.toString()
        console.log(this.token + "salut")
        console.log(`real code : ${decryptedData[1]}${decryptedData[3]}${decryptedData[5]}${decryptedData[7]}`)
        console.log(`my code : ${token}`)
        if (token === `${decryptedData[1]}${decryptedData[3]}${decryptedData[5]}${decryptedData[7]}`)
            return 1;
        else
            return 0;
    }

}