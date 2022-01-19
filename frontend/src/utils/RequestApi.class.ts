export class RequestApi {
    private readonly baseUrl: string;
    private readonly headers: Headers;

    constructor(
        accessToken: string,
        ip: string = 'localhost',
    ) {
        this.baseUrl = `http://${ip}:5000`;
        this.headers = new Headers();
        this.headers.append('Authorization', `Bearer ${accessToken}`);
    }

    setContentType(newType: string): void {
        this.headers.set('Content-Type', newType);
    }

    private getUrl(endpoint: string, params?: {}): string {
        let url: string;
        let urlParams: URLSearchParams;
        
        if (params) {
            urlParams = new URLSearchParams(params);
            url = `${this.baseUrl}/${endpoint}?${urlParams}`;
        } else {
            url = `${this.baseUrl}/${endpoint}`;
        }

        return url;
    }

    private async call(method: string, endpoint: string,  data: {params?: {}, body?: {}, contentType?: string}) {
        if (data.contentType) {
            this.setContentType(data.contentType);
        }
        
        let url: string = this.getUrl(endpoint, data.params);

        console.log(this.headers.get('Content-Type'));
        console.log(url);

        const request = new Request(
            url,
            {
                method: method,
                headers: this.headers,
                body: data.body ? JSON.stringify(data.body) : undefined,
            })

        await fetch(request)
        .then((response) => {
                if (response.status === 200) {
                    return response.json;
                }
          })
          .then(response => {
            console.debug(response);
          }).catch(error => {
            console.error(error);
          });
    }

    async get(endpoint: string, data: {params?: {}, body?: {}, contentType?: string}) {
        return await this.call('GET', endpoint, data);
    }

    async post(endpoint: string, data: {params?: {}, body?: {}, contentType?: string}) {
        return await this.call('POST', endpoint, data);
    }

    async delete(endpoint: string, data: {params?: {}, body?: {}, contentType?: string}) {
        return await this.call('DELETE', endpoint, data);
    }

}