import { DeviceUUID } from "device-uuid";


function generateUniqueCode(){

    return new DeviceUUID().get();


}

function disconnectUser(){
    localStorage.removeItem('user')
}

function getConnectedUser(param){

    let userDataString = localStorage.getItem('user');
    
    if(userDataString){
        if(param)return JSON.parse(userDataString)[param];
        return JSON.parse(userDataString);
    }

    return null;
}

function getAuthorization(view){

    let user = getConnectedUser();

    if(user){

        try{
            let authInter = JSON.parse(user.authorized_interface);

            return authInter[view] && (authInter[view].add || authInter[view].update || authInter[view].delete || authInter[view].view)

        }catch(err){
            console.log(err)

            let authInter = user.authorized_interface;
            return authInter[view] && (authInter[view].add || authInter[view].update || authInter[view].delete || authInter[view].view)

        }   

       
    }

    return false;

}

function getAuthorizationFor(view, action){

    let user = getConnectedUser();

    if(user){
  
            let authInter = JSON.parse(user.authorized_interface);

            if(!authInter[view])return false;

            return authInter[view][action]
       
    }

    return false;
}

function setConnectedUser(userInfo){

    localStorage.setItem('user', JSON.stringify(userInfo));

}

function getToken(){
    return getConnectedUser('token')
}


export {
    generateUniqueCode,
    getConnectedUser,
    getToken,
    disconnectUser,
    setConnectedUser,
    getAuthorization,
    getAuthorizationFor
}