import React, { useContext, useEffect, useState } from "react";
import "./Login.style.css";
import {ReactComponent as LoginIcon} from '../../assets/icons/user-lock.svg';
import {ReactComponent as LockIcon} from '../../assets/icons/lock.svg';
import {ReactComponent as UserIcon} from '../../assets/icons/profile.svg';

import { PopupContext, UserContext } from "../../contexts";
import { POPUP_ERROR } from "../../components/Popup/Popup";
import Axios from "axios";
import { connectToServer } from "../../utils/serverSocketCom";
import { setConnectedUser } from "../../utils/storageUtil";
import { postToServer } from "../../utils/serverHttpCom.js";

function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {setPopupOption} = useContext(PopupContext);
    const {setUser} = useContext(UserContext);

    function handleLogin(e){

        e.preventDefault();


        postToServer('/login',  {
            username,
            password
        }, ({data}) => {

            if(data.valid){
                try {
                    connectToServer(data.user.token, (connected) => {
                        setConnectedUser(data.user)
                        if(connected){
                            setUser(data.user)
                        } else {
                            setUser(null);
                        }
                        console.log("TEST")
                    });
                    console.log("TEST FIN IF");
                } catch (error) {
                    console.error("Erreur lors de la tentative de connexion :", error);
                    setPopupOption({

                        secondaryText: 'Un utilisateur est déja connecté sur ce compte',
                        acceptText: 'Tentez de vous déconnecter',
                        type: POPUP_ERROR,
        
                    })
                }
            }

        }, () => {

            setPopupOption({

                secondaryText: 'Non d\'utilisateur ou mot de passe incorrect',
                acceptText: 'Réessayer',
                type: POPUP_ERROR,

            })

        })
        
    }
    
    useEffect(() => {
        document.title = 'Supervision | Connexion'
    }, [])

    return <form className="login-container" onSubmit={handleLogin}>

            <LoginIcon className="login-icon" />

            <h2>Connexion supervision</h2>

            <div className="input-section-login">
                <h4>Nom d'utilisateur</h4>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="input-credentials" type={"text"}  placeholder={"utilisateur.xy..."} />
                <UserIcon className='icon-input' />

            </div>
            <div className="input-section-login">
                <h4>Mot de passe</h4>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="input-credentials" type={"password"}  placeholder={"m0t_De_p@sse.."}   />
                <LockIcon className='icon-input' />
            </div>
            <input className="submit-credentials" type={"submit"} value={"Se connecter"} />
    </form>


}


export default Login;