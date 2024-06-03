import { load } from 'gapi-script';

export const initializeGapiClient = (apiKey, clientId, discoveryDocs, scope) => {
    return new Promise((resolve, reject) => {
        load('client:auth2', () => {
            window.gapi.client.init({
                apiKey,
                clientId,
                discoveryDocs,
                scope,
            }).then(() => {
                resolve(window.gapi);
            }).catch(error => {
                reject(error);
            });
        });
    });
};
