import "./Header.style.css";
import {ReactComponent as PlugIcon} from '../../assets/icons/plug.svg';
import {ReactComponent as UserIcon} from '../../assets/icons/profile.svg';
import {ReactComponent as BurgerMenuIcon} from '../../assets/icons/menu.svg';
import {ReactComponent as CloseBurgerMenuIcon} from '../../assets/icons/close.svg';
import {ReactComponent as NotificationIcon} from '../../assets/icons/notification.svg';
import {ReactComponent as ServerStateIcon} from '../../assets/icons/server-connection.svg';
import {ReactComponent as LightModeIcon} from '../../assets/icons/day-mode.svg';
import {ReactComponent as DarkModeIcon} from '../../assets/icons/dark.svg';
import {ReactComponent as DisconnectIcon} from '../../assets/icons/logout.svg';
import {ReactComponent as UserTypeIcon} from '../../assets/icons/user-group.svg';
import {ReactComponent as MoreInfoIcon} from '../../assets/icons/menu_more.svg';



import React, { useContext, useEffect, useState } from "react";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { PopupContext, ThemeContext, UserContext } from "../../contexts";
import { currentServerState, socketFlag } from "../../utils/serverSocketCom";
import { useNavigate } from "react-router-dom";
import { disconnectUser, getConnectedUser } from "../../utils/storageUtil";
import { getToServer, postToServer } from "../../utils/serverHttpCom.js";
import { disconnectSocket } from "../../utils/serverSocketCom";
import moment from "moment";
import { POPUP_QUESTION } from "../Popup/Popup";

function Header({paths}){

    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(true);
    const [currentPageName, setCurrentPageName] = useState(paths[0].name);
    const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const [serverState, setServerState] = useState(false);
    const [disconnectPromptOpen, setDisconnectPromptOpen] = useState(false);
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifications, setNotifications] = useState([]);
    const [newNotif, setNewNotif] = useState(0);
    const {theme, setTheme} = useContext(ThemeContext);
    const {setPopupOption} = useContext(PopupContext);

    const handleMouseEnter = () => {
        setIsHovering(true);
        setIsVisible(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovering(false);
        setTimeout(() => {
            setIsVisible(false);
          }, 300);
      };

    useEffect(() => {

        let location = window.location.pathname;

        for(let path of paths){
            if(path.path === location){
                setCurrentPageName(path.name)
            }
        }


    }, [burgerMenuOpen])

    useEffect(() => {
        console.log("currentPageName : " + currentPageName)
        fetchNotifAndFilter()
    },[currentPageName])

    useEffect(() => {

        let count = 0;

        let lastChecked = localStorage.getItem('notification-last-checked')

        for(let notification of notifications){

            if(!lastChecked || notification.date > lastChecked){
                count++;
            }

        }

        setNewNotif(count);

    }, [notifications])

    
    useEffect(() => {

        currentServerState(setServerState)

        socketFlag('connection_made', () => {
            console.log('connected')
            setServerState(true)})
        socketFlag('disconnection', () => setServerState(false))


        fetchNotifAndFilter()

    }, [])

    function fetchNotifAndFilter(){
        postToServer('/notificationWeb',{}, (data) => {
        let currentData = data.data;
        //Premier filtre
        currentData = currentData.filter(notification => {
            return notification.user_interface === user.access_level
        })
        //Deuxieme filtre
        currentData = currentData.filter(notification => {
            const pages = notification.page.split(',').map(page => page.trim());
            return pages.includes(currentPageName);
        });            
        setNotifications(currentData)
        }, (err) => {
            console.log("ERROR : "+ err)
        })
    }

    function handleToggleMenu(){

        setBurgerMenuOpen(!burgerMenuOpen)

    }

    function handleDisconnect(){
        
        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Etes-vous sur de vouloir vous déconnecter ?',
            secondaryText: 'Vous pourrez toujours vous reconnecter plus tard',
            acceptText: 'Oui, me déconnecter',
            declineText: 'Non, annuler',
            onAccept: () => {

                disconnectUser();
                setUser(null);
                disconnectSocket()
                navigate("/supervision/")

            }

        })
       
    }

    function handleChangeTheme(){

        setTheme(theme === 'light-theme'? 'dark-theme' : 'light-theme')

    }

    return <>
    {(currentPageName !== "SwitchPages") && (currentPageName !== "SwitchPagesARN") ? (
        <div className="header">
        <div className="left-side">
            <div className={"menu-button "+(burgerMenuOpen? "active" : "")}>
                {burgerMenuOpen?<CloseBurgerMenuIcon onClick={handleToggleMenu} className="burger-menu-close-toggle-icon" /> : <BurgerMenuIcon onClick={handleToggleMenu} className="burger-menu-toggle-icon" />}
            </div>
        
            <h3 className="title-text">{currentPageName}</h3>
        </div>
       
        <BurgerMenu visible={burgerMenuOpen} paths={paths} setVisible={setBurgerMenuOpen}/>

        <div className="right-side">
            <div onClick={() => {
                setNewNotif(0)
                setNotifOpen(true)
                }} className="notification-icon-container">
                <NotificationIcon className={"notification-icon "+(notifications.reduce((prev, curr) => prev + (curr.date > localStorage.getItem('notification-last-checked')? 1 : 0),0 ) > 0? 'new' : '')} />
                {newNotif > 0 && <div className="new-alert">
                    <h5>{newNotif > 9? '9+' : newNotif}</h5>
                </div>}
            </div>

            <div className="user">
                <h3>{user.username}</h3>
                <div className="user-icon-container">
                    <UserIcon className="user-icon" />
                </div>
            </div>

            <div onClick={() => setDisconnectPromptOpen(!disconnectPromptOpen)} className="menu-draw-container">
                {disconnectPromptOpen? <CloseBurgerMenuIcon className="more-info-container" /> : <MoreInfoIcon className="more-info-container" /> }
            </div>

        </div>

       <Notifications setOpen={setNotifOpen} isOpen={notifOpen} notifications={notifications} />


        <div className={"user-simple-info "+(!disconnectPromptOpen? "hidden": "")}>
            
            <div title="Nom d'utilisateur" className="type-container phone-user-info">
                <UserIcon />
                <h4>{getConnectedUser('username')}</h4>
            </div>
            
            
            <div title="Type d'utilisateur" className="type-container">
                <UserTypeIcon />
                <h4>{user.access_level.toLowerCase()}</h4>
            </div>

            <div  title="Changer le thème" className="row-info">

                <div title={"Vous "+(serverState? 'etes connecté au serveur' : 'n\'etes pas connecté au serveur')} className={"info-item "+(serverState? 'connect' : 'disconnect')}>
                    <ServerStateIcon className={"info-icon "} />
                </div>


                <div onClick={handleChangeTheme} className={"info-item theme "+theme}>
                    {theme === 'light-theme'? <LightModeIcon className={"info-icon"} /> : <DarkModeIcon  className={"info-icon"} />}
                </div>
            </div>

            <div onClick={handleDisconnect} className="disconnect-btn">

                <DisconnectIcon />
                <h4>Se déconnecter</h4>

            </div>
        </div>
    </div>
    ) : ( <>

        <div 
            className={`${isHovering ? 'header' : 'header-notHovering'} ${(currentPageName === "SwitchPagesARN") || (currentPageName === "SwitchPages") ? 'white-bg' : ''}`}
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
            >
        { 
        isHovering && (
        <>
            <div className="left-side">
                <div className={"menu-button "+(burgerMenuOpen? "active" : "")}>
                    {burgerMenuOpen?<CloseBurgerMenuIcon onClick={handleToggleMenu} className="burger-menu-close-toggle-icon" /> : <BurgerMenuIcon onClick={handleToggleMenu} className="burger-menu-toggle-icon" />}
                </div>
            
                <h3 className="title-text">{currentPageName}</h3>
            </div>
        
            <BurgerMenu visible={burgerMenuOpen} paths={paths} setVisible={setBurgerMenuOpen}/>

            <div className="right-side">
                <div onClick={() => {
                    setNewNotif(0)
                    setNotifOpen(true)
                    }} className="notification-icon-container">
                    <NotificationIcon className={"notification-icon "+(notifications.reduce((prev, curr) => prev + (curr.date > localStorage.getItem('notification-last-checked')? 1 : 0),0 ) > 0? 'new' : '')} />
                    {newNotif > 0 && <div className="new-alert">
                        <h5>{newNotif > 9? '9+' : newNotif}</h5>
                    </div>}
                </div>

                <div className="user">
                    <h3>{user.username}</h3>
                    <div className="user-icon-container">
                        <UserIcon className="user-icon" />
                    </div>
                </div>

                <div onClick={() => setDisconnectPromptOpen(!disconnectPromptOpen)} className="menu-draw-container">
                    {disconnectPromptOpen? <CloseBurgerMenuIcon className="more-info-container" /> : <MoreInfoIcon className="more-info-container" /> }
                </div>

            </div>

            <Notifications setOpen={setNotifOpen} isOpen={notifOpen} notifications={notifications} />


            <div className={"user-simple-info "+(!disconnectPromptOpen? "hidden": "")}>
                
                <div title="Nom d'utilisateur" className="type-container phone-user-info">
                    <UserIcon />
                    <h4>{getConnectedUser('username')}</h4>
                </div>
                
                
                <div title="Type d'utilisateur" className="type-container">
                    <UserTypeIcon />
                    <h4>{user.access_level.toLowerCase()}</h4>
                </div>

                <div  title="Changer le thème" className="row-info">

                    <div title={"Vous "+(serverState? 'etes connecté au serveur' : 'n\'etes pas connecté au serveur')} className={"info-item "+(serverState? 'connect' : 'disconnect')}>
                        <ServerStateIcon className={"info-icon "} />
                    </div>


                    <div onClick={handleChangeTheme} className={"info-item theme "+theme}>
                        {theme === 'light-theme'? <LightModeIcon className={"info-icon"} /> : <DarkModeIcon  className={"info-icon"} />}
                    </div>
                </div>

                <div onClick={handleDisconnect} className="disconnect-btn">

                    <DisconnectIcon />
                    <h4>Se déconnecter</h4>

                </div>
            </div>
        </>
            )
            
        }  
    </div>
    </>
    )}

    </>

}


function Notifications({isOpen, setOpen,  notifications}){

    useEffect(() => {

        if(isOpen){
            localStorage.setItem('notification-last-checked', moment().format('YYYY-MM-DD HH:mm:ss'))
        }

    }, [isOpen])


    function handleClose(){
        setOpen(false);
    }


    return <div className={"notification-container "+(isOpen? 'open': '')}>
        <div className="notification-header">
            <h3>Notifications</h3>
            <div onClick={handleClose} className="close-notification">
                <CloseBurgerMenuIcon className={"close-notifications "} />
            </div>
        </div>
        <div className="alert-list">
            {notifications.sort((a, b) => {
                if(a.date > b.date )return -1;
                if(a.date < b.date )return 1;
                return 0;
                }).map((item, index) => <NotificationItem key={index} item={item} />)}
        </div>

        {notifications.length <= 0 && <h4 className="empty-alert">Aucune notification</h4>}
    </div>

}

function NotificationItem({item}){

    return <div className={"alert-item-container "+ ((!localStorage.getItem('notification-last-checked') || localStorage.getItem('notification-last-checked') < item.date)? 'new' : '')}>
        <h4>{item.title}</h4>
        <h4>Date: {moment(item.date).format('DD/MM/YYYY HH:mm')}</h4>
        <h5>Détail: {item.content}</h5>
    </div>


}


export default Header;