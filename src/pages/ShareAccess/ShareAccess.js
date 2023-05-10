import "./ShareAccess.style.css"
import QRCode from "react-qr-code";
import React,{ useContext } from "react";
import { UserContext } from "../../contexts";

function ShareAccess(){

    let {user} = useContext(UserContext);


    return <div className="share-access-container">

        <QRCode value={user.code} className="qr-code" />

    </div>

}

export default ShareAccess;