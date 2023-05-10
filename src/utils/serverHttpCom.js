import Axios from 'axios';
import { getConnectedUser } from './storageUtil';

function postToServer(uri, data, onSuccess, onError){

    let token = getConnectedUser('token');

    if(token)data.token = token;

    Axios.post("https://service.keroman.fr/api/supervision"+uri, data).then(onSuccess)
    .catch(onError)
}

export {postToServer}