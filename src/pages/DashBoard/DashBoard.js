import { useNavigate } from "react-router-dom";
import "./DashBoard.style.css";
import React, { useContext, useEffect } from 'react';
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../../components/Popup/Popup";

function DashBoard(){

    const navigate = useNavigate();

    const {popupOption, setPopupOption} = useContext(PopupContext)

    function handleShareAccess(){
        navigate('/borne/share-access')
    }

    useEffect(() => {

        

    }, [])

    return <div className="dashboard-container">

        <div onClick={handleShareAccess} className="share-access-button">
            <h3>Pargater mon accès</h3>
        </div>

    </div>

}

export default DashBoard;