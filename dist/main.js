"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertPok = void 0;
class CertPokError extends Error {
    constructor(statusCode, message, payload) {
        super(message);
        this.statusCode = statusCode;
        this.payload = payload;
        this.name = 'CertPokError';
    }
}
const axios_1 = __importDefault(require("axios"));
class CertPok {
    constructor(api_key, sandbox = false) {
        this.live_url = 'https://api.pok.tech';
        this.sandbox_url = 'https://api.credentity.xyz';
        this.api_key = 'ApiKey ' + api_key;
        this.sandbox = sandbox;
    }
    credentialImageUrl(id) {
        const credential_details_path = '/credential/' + id + '/decrypted-image';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = (yield this.httpCall('get', credential_details_path))['data'];
            const url = http_response['location'];
            resolve(url);
        }));
    }
    credential(id) {
        const credential_details_path = '/credential/' + id;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = (yield this.httpCall('get', credential_details_path))['data'];
            resolve(http_response);
        }));
    }
    emitCredential(id, emission_type, emission_date, title, first_name, last_name, tags, identification, email, page_id, lang = 'es-AR', emitter = 'Excuela') {
        const emit_credential_path = '/credential';
        const data = JSON.stringify({ "credential": {
                "tags": tags,
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = (yield this.httpCall('post', emit_credential_path, data))['data'];
            resolve(http_response);
        }));
    }
    get organization() {
        const org_path = '/organization/me';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = (yield this.httpCall('get', org_path))['data'];
            resolve(http_response);
        }));
    }
    templatePreview(id, emission_type, emission_date, title, first_name, last_name, lang = 'es-AR', emitter = 'Excuela') {
        const temp_prev_path = '/template/preview';
        const data = JSON.stringify({
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = (yield this.httpCall('post', temp_prev_path, data))['data'];
            resolve(http_response);
        }));
    }
    template(id) {
        const temp_path = '/template/' + id;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = (yield this.httpCall('get', temp_path))['data'];
            resolve(http_response);
        }));
    }
    pages(limit = 5) {
        const temps_path = '/page';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = yield this.httpCall('get', temps_path, undefined, { "limit": limit });
            const templates = http_response['data']['data'];
            resolve(templates);
        }));
    }
    templates(limit = 5) {
        const temps_path = '/template';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const http_response = yield this.httpCall('get', temps_path, undefined, { "limit": limit });
            const templates = http_response['data']['data'];
            resolve(templates);
        }));
    }
    httpCall(method, path, data, params) {
        var _a, _b;
        try {
            let config = {
                method: method,
                maxBodyLength: Infinity,
                url: (this.sandbox ? this.sandbox_url : this.live_url) + path,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': this.api_key
                },
                data: data,
                params: params
            };
            return axios_1.default.request(config);
        }
        catch (e) {
            if (axios_1.default.isAxiosError(e)) {
                const status_code = ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
                const payload = ((_b = e.response) === null || _b === void 0 ? void 0 : _b.data) || { message: 'An error occurred' };
                throw new CertPokError(status_code, 'Axios request failed', payload);
            }
            else {
                throw new CertPokError(500, 'Unexpected error', e);
            }
        }
    }
}
exports.CertPok = CertPok;
