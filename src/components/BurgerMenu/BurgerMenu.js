import { useNavigate, useLocation } from "react-router-dom";
import "./BurgerMenu.style.css";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../contexts";
import { getAuthorization, getConnectedUser } from "../../utils/storageUtil";

function BurgerMenu({paths, visible, setVisible}){


    function handleBackgroundClick(){
        setVisible(false);
    }

    return <>
        <div onClick={handleBackgroundClick}  className={"dim-background "+(visible? "visible" : "hidden")}></div>
        <div className={"burger-menu-container "+(visible? "visible" : "hidden")}>

            {paths.filter((path) => {
                if(path.secure)return getAuthorization(path.secure);
                return true;
            }).map((item, index) => <BurgerMenuItem setMenuVisible={setVisible} key={index} path={item.path} name={item.name} Icon={item.Icon} />)}

        </div>
    </>


}


function BurgerMenuItem({path, name, Icon, setMenuVisible}){

    const navigate = useNavigate();

    let location = useLocation();

    const [isActive, setActive] = useState(false);


    useEffect(() => {

        setActive(location.pathname.includes(path))

    }, [location])

    function handleOnClick(){

        setTimeout(() => {
            setMenuVisible(false);
        }, 100)


        navigate(path)

    }

    return <div onClick={handleOnClick} className={"burger-menu-item-container"+(isActive? " active": "")}>
        {Icon && <Icon className={"burger-menu-item-icon"} />}
        <h2>{name}</h2>
    </div>



}

export default BurgerMenu;