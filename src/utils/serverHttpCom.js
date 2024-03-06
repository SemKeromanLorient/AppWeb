import Axios from 'axios';
//const Axios = require('axios');
import { getConnectedUser } from './storageUtil';
//const { getConnectedUser } = require ('./storageUtil')
function postToServer(uri, data, onSuccess, onError){
    
    let token = getConnectedUser('token');

    if(token)data.token = token;

    Axios.post("https://service.keroman.fr/api/supervision"+uri, data).then(onSuccess)
    .catch(onError)
}
//https://service.keroman.fr/api/supervision

function getToServer(uri, data, onSuccess, onError){
    let token = getConnectedUser('token');

    if(token)data.token = token;

    Axios.get("https://service.keroman.fr/api/supervision"+uri, data).then(onSuccess)
    .catch(onError)
}
//module.exports = {postToServer, getToServer}
export {postToServer, getToServer}