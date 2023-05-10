import React, { useEffect, useState } from "react"
import "./ContextMenu.style.css";
import {ReactComponent as ArrowIcon} from '../../assets/icons/arrow.svg';

function ContextMenu({setOption, option}){

    function calcPosition(){





    }




    return <div id="context_menu" style={option? {top: option.position? option.position.y : 0, left: option.position? option.position.x : 0} : {}} className={"context-menu "+(option? "open" : "")}>

        {option && option.menuItems && option.menuItems.map((item, index) => <MenuItem item={item} key={index}/>)}
    
    </div>
}


function MenuItem({item}){

    const [isSubMenuShow, setSubMenuShow] = useState(false);

    function RenderIcon(){
        if(!item.Icon)return null;
        return new item.Icon({className:'menu-item-icon'});
    }

    function handleMouseEnter(){
        setSubMenuShow(true)
    }

    function handleMouseExit(){
        setSubMenuShow(false)
    }

    return <div onClick={item.onClick} className="menu-item">

    <RenderIcon  />
    <h4>{item.text}</h4>
    {item.subMenu && <ArrowIcon className={"sub-menu-icon"} />}
    {item.subMenu && <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit} className={"sub-menu "+(isSubMenuShow? "open" : "")}>
            {item.subMenu.map((item, index) => <MenuItem item={item} key={index}/>)}
    </div>}


</div>
}

export default ContextMenu;

