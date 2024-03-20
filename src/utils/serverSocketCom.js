// import { useContext } from "react";
// import { PopupContext } from "../../contexts";
// import { POPUP_ERROR } from "../../components/Popup/Popup";

const { io } = require("socket.io-client");
let socket;
let listenerState;
let activeListeners = []
const SERVER_LOCAL_IP = "http://192.168.130.10/";// const SERVER_LOCAL_IP = "http://192.168.130.102/";
const DISTANT_DNS = "https://service.keroman.fr/";
// const {setPopupOption} = useContext(PopupContext);

function reconnectSavedFlag(){


    for(let listener of activeListeners){

        console.log(listener)
        console.log(activeListeners.length)

        socketFlag(listener.name, listener.function);
    }

}


//Probleme lors de l'utilisation de ceux-ci, si on déco-reco on perds la possibilité de se connecter car 2 comptes co
function connectToServer(token, callback){
    //Avec ce if on créer une connexion unique 
    if(!socket || !socket.connected ){
        console.log('TEST Connexion unique success')
        socket = io("https://service.keroman.fr/", {
            query:  {
                token,
                destination: "BORNE_CONNECTION"
            }
        });

        //console.log("TEST CONNECTOSERVER")
        //console.log("socket : " + JSON.stringify(socket))

        socket.on('ping', () => {
            socket.emit('ping', {alive: true})
        })
    
        socket.on('connect', () => {
            
    
            callback(true)
            if(listenerState)listenerState(true)
        })

    
        socket.on('error', (error) => {
            callback(false)
            if(listenerState)listenerState(false)
        })
    
        socket.on('disconnect', (error) => {
            //On arrive ici pour le problème de l'onglet maitre de port
            console.log(error)
            callback(false)
            if(listenerState)listenerState(false)
        })
    
        socket.on('reconnect', (error) => {
            //console.log("TEST RECONNECT")
            callback(true)
            if(listenerState)listenerState(true)
        })
    
    } else {
        throw new Error("La connexion est déjà établie.");
    }
    
}

function currentServerState(callback){
    listenerState = callback;
    callback(socket.connected)
}

function socketFlag(name, callback){
    if(socket){
        removeSocketFlag(name)

        let index = activeListeners.findIndex((listener, index) => name === listener.name)
        if(index < 0){

            socket.on(name, callback)

            activeListeners.push({
                name: name,
                function: callback
            })
        }
       

    }

}

function removeSocketFlag(flag){
    if(socket){
        socket.off(flag);

        let indexToRemove = activeListeners.findIndex((listener, index) => flag === listener.name)

        if(indexToRemove > -1)activeListeners.splice(indexToRemove, 1)
    }
}

function socketSend(name, data){

    if(socket){
        socket.emit(name, data)
    }

}

function disconnectSocket(){
    if(socket){
        socket.disconnect();
    }
}

export {
    connectToServer,
    socketFlag,
    socketSend,
    currentServerState,
    removeSocketFlag,
    disconnectSocket,
    reconnectSavedFlag
}