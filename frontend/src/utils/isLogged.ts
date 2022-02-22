import axios from "axios";
import { ip } from '../App'

export async function isLogged(cookies: any): Promise<{me: any, unauthorized: boolean}> {
    let unauthorized = false;
    let me: any = null;
    
    await axios.request({
      url: '/user/me',
      method: 'get',
      baseURL: `http://${ip}:5000`,
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`,
      }
      }).then((response: any) => { me = response; }
      ).catch(err => {
        if (err.response.status === 401) {   
          unauthorized = true;
        }
    });
  return {me, unauthorized};
}