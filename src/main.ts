class CertPokError extends Error {
    public statusCode: number;
    public payload: any;
    constructor(statusCode: number, message: string, payload: any) {
      super(message);
      this.statusCode = statusCode;
      this.payload = payload;
      this.name = 'CertPokError';
    }
  }
interface Page
{
    id: string;
    name: string;
}
interface Credential
{
    id: string;
    state: 'waitingForApproval' | 'processing' | 'emitted' | 'draft' | 'requestingSignature' | 'signatureRejected' | 'requestingChange' | 'deferred' | 'aborted' | 'revoked';
    viewUrl?: string;
    createdAt?: string;
    credential? :{
        tags: string[];
        emitter: string;
        title: string;
        emissionDate: string;
        emissionType: string;
    };
    receiver? : {
        name: string
        email: string
    }
}
interface Organization
{
    wallet : string;    
    name : string;
    availableCredits:number;
    emittedCredentials: number
    sentCredentials : number
    draftCredentials : number;
    processingCredentials :number;
}
interface TemplatePreview
{
    url: string;
}
interface Template
{
    id: string;
    name: string;
    version?: number;
    customParameters? : {id: string, label: string}[];
}
import axios from 'axios';
export class CertPok 
{
    private live_url : string ='https://api.pok.tech';
    private sandbox_url : string ='https://api.credentity.xyz';
    private api_key? : string; 
    private sandbox? : boolean;
    constructor(api_key: string, sandbox : boolean =false) {
        this.api_key ='ApiKey '+api_key;
        this.sandbox =sandbox;
    }
    credentialImageUrl(id: string) : Promise<string>
    {
        const credential_details_path : string ='/credential/'+id+'/decrypted-image';
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : any = (await this.httpCall('get', credential_details_path))['data'];
                const url : string =http_response['location'];
                resolve(url);
            }
        );
    }
    credential(id: string) : Promise<Credential>
    {
        const credential_details_path : string ='/credential/'+id;
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : Credential = (await this.httpCall('get', credential_details_path))['data'];
                resolve(http_response);
            }
        );
    }
    emitCredential(id: string, emission_type: 'pok' | 'blockchain', emission_date: string, title: string, first_name: string, last_name: string, tags: string[], identification: string, email: string, page_id: string, lang: string ='es-AR', emitter: string ='Excuela') : Promise<Credential>
    {
        const emit_credential_path : string ='/credential';
             const data: string =JSON.stringify({"credential": {
                "tags":tags,
                "emissionType": emission_type,
                "dateFormat": "dd/MM/yyyy",
                "emissionDate": emission_date,
                "title": title,
                "emitter": emitter
            },
            "receiver": {
                "identification": identification,
                "email": email,
                "languageTag": lang,
                "lastName": last_name,
                "firstName": first_name
            },
            "customization": {
              "page": page_id,
              "template": {
                "customParameters": {},
                "id": id
              }
            }
          });
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : Credential = (await this.httpCall('post', emit_credential_path, data))['data'];
                resolve(http_response);
            }
        );
    }
    get organization(): Promise<Organization> {
        const org_path : string ='/organization/me';
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : Organization = (await this.httpCall('get', org_path))['data'];
                resolve(http_response);
            }
        );
    }
    templatePreview(id: string, emission_type: 'pok' | 'blockchain', emission_date: string, title: string, first_name: string, last_name: string, lang: string ='es-AR', emitter: string ='Excuela'): Promise<TemplatePreview> {
        const temp_prev_path : string ='/template/preview';
        const data: string =JSON.stringify({
        "credential": {
            "emissionType": emission_type,
            "dateFormat": "dd/MM/yyyy",
            "emissionDate": emission_date,
            "title": title,
            "emitter": emitter
        },
        "receiver": {
            "languageTag": lang,
            "lastName": last_name,
            "firstName": first_name
        },
        "customization": {
            "template": {
            "customParameters": {},
            "id": id
            }
        }
        });
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : TemplatePreview = (await this.httpCall('post', temp_prev_path, data))['data'];
                resolve(http_response);
            }
        );
    }
    template(id: string): Promise<Template> {
        const temp_path : string ='/template/'+id;
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : Template = (await this.httpCall('get', temp_path))['data'];
                resolve(http_response);
            }
        );
    }
    pages(limit: number =5): Promise<Page[]> {
        const temps_path : string ='/page';
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : any = await this.httpCall('get', temps_path, undefined, {"limit": limit});
                const templates : Template[] = http_response['data']['data'];
                resolve(templates);
            }
        );
    }
    templates(limit: number =5): Promise<Template[]> {
        const temps_path : string ='/template';
        return new Promise(
            async (resolve, reject) =>
            {
                const http_response : any = await this.httpCall('get', temps_path, undefined, {"limit": limit});
                const templates : Template[] = http_response['data']['data'];
                resolve(templates);
            }
        );
    }
    private httpCall(method: 'get' | 'post', path: string, data?: string, params?: any) : Promise<any>
    {
        try
        {
            let config = {
                method: method,
                maxBodyLength: Infinity,
                url: (this.sandbox ? this.sandbox_url : this.live_url)+path,
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', 
                    'Authorization': this.api_key!
                },
                data: data,
                params: params
            };
            return axios.request(config);
        }
        catch(e)
        {
            if (axios.isAxiosError(e))
            {
                const status_code = e.response?.status || 500;
                const payload = e.response?.data || { message: 'An error occurred' };
                throw new CertPokError(status_code, 'Axios request failed', payload);
            } 
            else
            {
                throw new CertPokError(500, 'Unexpected error', e);
            }
        }   
    }
}