import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import "./App.style.css";
import { Header, Popup, Toast, Loader, ProtectedRoute, ContextMenu } from "./components";
import {ReactComponent as PlugIcon} from './assets/icons/plug.svg';
import {ReactComponent as DashBoardIcon} from './assets/icons/dashboard.svg';
import {ReactComponent as ConsoIcon} from './assets/icons/speedometer.svg';
import {ReactComponent as MapIcon} from './assets/icons/map.svg';
import {ReactComponent as PinIcon} from './assets/icons/pin.svg';
import {ReactComponent as UsersIcon} from './assets/icons/people.svg';
import {ReactComponent as RulesIcon} from './assets/icons/rules.svg';
import {ReactComponent as SettingsIcon} from './assets/icons/setting.svg';
import {ReactComponent as FacturesIcon} from './assets/icons/facture.svg';
import {ReactComponent as AbsentsIcon} from './assets/icons/absent.svg';
import {ReactComponent as BorneListIcon} from './assets/icons/table-grid.svg';
import {ReactComponent as TicketIcon} from './assets/icons/ticket.svg';

import connectionAnimation from "./assets/lotties/wifi-connection.json";

import { Absences, BorneBalise, Bornecontrol, BorneList, BorneMap, BorneSelection, Consommation, DashBoard, Facturation, Login, Rules, Settings, ShareAccess, Tickets, UserManager } from './pages';
import { PopupContext, ToastContext, UserContext, ContextMenuContext } from "./contexts";
import React,{ useEffect, useMemo, useRef, useState } from "react";
import { connectAutomate, connectToServer, disconnectSocket, reconnectSavedFlag } from "./utils/serverSocketCom";
import mapboxgl from '!mapbox-gl';
import { disconnectUser, getConnectedUser, setConnectedUser } from "./utils/storageUtil";
import { postToServer } from "./utils/serverHttpCom";
import { POPUP_ERROR } from "./components/Popup/Popup";
import ThemeContext, { DARK_THEME, LIGHT_THEME } from "./contexts/ThemeContext";
mapboxgl.accessToken = 'pk.eyJ1Ijoic2VydmljZXNpIiwiYSI6ImNsODRtaXpiYjAxMmIzc2xkcjhvdzY4MHYifQ.5IFeaz7cElI08IZLGrxiFA';




function App() {

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [popupOption, setPopupOption] = useState(null);
  const [toastOption, setToastOption] = useState(null);
  const [contextMenuOption, setContextMenuOption] = useState(null);
  const [unlockProtectedPath, setUnlockProtectedPath] = useState(false);
  const [connected, setConnected] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme')? localStorage.getItem('theme') : DARK_THEME);

  const userContextValue = useMemo(() => ({user, setUser}), [user])
  const notificationContextValue = useMemo(() => ({user, setUser}), [user])

  const popupContextValue = useMemo(() => ({popupOption, setPopupOption}), [popupOption])
  const toastContextValue = useMemo(() => ({toastOption, setToastOption}), [toastOption])
  const contextMenuContextValue = useMemo(() => ({contextMenuOption, setContextMenuOption}), [contextMenuOption])
  const themeContextValue = useMemo(() => ({theme, setTheme}), [theme])

  useEffect(() => {

    localStorage.setItem('theme', theme)

  }, [theme])

  const connectedLock = useRef(false);
 
  function connect(){

    let userStorage = getConnectedUser();

    if(getConnectedUser('token')){

      if(!connectedLock.current){
        connectedLock.current = true;

        console.log('Send need-update')

        postToServer('/need-upgrade',{}, (({data}) => {

          console.log(data)

          if(data.valid){

            console.log(data)

            setConnectedUser(data.user)

            connectToServer(getConnectedUser('token'), (connected) => {
  

              if(!connected){
                setPopupOption({
                  lottie: connectionAnimation,
                  text: 'Vous avez été déconnecté du serveur.',
                  secondaryText: 'Ceci peut ce produire lorsqu\'il y a 2 pages ouverte avec les même identifiants.',
                  acceptText: 'Se reconnecter',
                  onAccept: connect
                })
                
              }else{
                reconnectSavedFlag()
                setConnected(true)
                setUser(userStorage)
              }
            

             
  
              console.log("Connection state:", connected)
      
            })
          }

          

        }), () => {

          disconnectUser();
          setConnected(false)
          setUser(null);

        })


        
      }
      

    }else{

      setConnected(true);

    }

  }

  useEffect(() => {

    connect()
   
    let handleClose = (event) => {
        event.preventDefault()
        disconnectSocket();
    }


    window.addEventListener('beforeunload', handleClose);


    return () => {
      window.removeEventListener('beforeunload', handleClose);
      disconnectSocket();

    }

  }, [])


  useEffect(() => {

    if(user)connectedLock.current = false;

  }, [user])

  function handleCloseContextMenu(event){
    setContextMenuOption(null);
  }

  function defaultRedirection(){

    let interfaces = JSON.parse(getConnectedUser('authorized_interface'))

    switch(Object.keys(interfaces)[0]){
      case 'CONSO':
        return '/supervision/conso'
      case 'FACTURE':
        return '/supervision/factures'
      case 'USERS':
        return '/supervision/user-manager'
      case 'TICKET':
        return '/supervision/ticket'

    }

    return '/supervision/map'
  }
// <Route path="supervision/factures" element={<ProtectedRoute useFor={'FACTURE'} redirect={'/supervision/'}><Facturation /></ProtectedRoute>}/>
// Header paths = [ {name: "Facturation", path: "/supervision/factures", Icon: FacturesIcon, secure: "FACTURE"},
  return  <div onClick={handleCloseContextMenu} className={"main-container no-select "+(theme)}>
  

            <UserContext.Provider value={userContextValue}>
            <ThemeContext.Provider value={themeContextValue}>
              <PopupContext.Provider value={popupContextValue}>
                <ToastContext.Provider value={toastContextValue}>
                  <ContextMenuContext.Provider value={contextMenuContextValue}>

                  {
                    connected? <>

                          {user?  <>

                          <Router>

                            <Header paths={[

                              {name: "Carte des bornes", path: "/supervision/map",Icon: MapIcon, secure: "MAP"},
                              {name: "Liste des bornes", path: "/supervision/list",Icon: BorneListIcon, secure: "LIST"},
                              {name: "Balisage", path: "/supervision/balise", Icon: PinIcon, secure: "BALISE"},
                              {name: "Utilisateurs", path: "/supervision/user-manager", Icon: UsersIcon, secure: "USERS"},
                              {name: "Règles", path: "/supervision/rules", Icon: RulesIcon, secure: "RULES"},
                              {name: "Consommation", path: "/supervision/conso", Icon: ConsoIcon, secure: "CONSO"},
                              {name: "Paramètres", path: "/supervision/settings", Icon: SettingsIcon, secure: "SETTINGS"},
                              {name: "Absences", path: "/supervision/absences", Icon: AbsentsIcon, secure: "ABSENCE"},
                              {name: "Tickets", path: "/supervision/tickets", Icon: TicketIcon, secure: "TICKET"}

                            ]}/>

                            <div className="pages-container">

                              <Routes>

                                  <Route path="/supervision/" element={<Navigate replace to={defaultRedirection()} />} />
                                  <Route path="supervision/conso" element={<ProtectedRoute useFor={'CONSO'} redirect={'/supervision/'} ><Consommation /></ProtectedRoute>} />
                                  <Route path="supervision/balise" element={<ProtectedRoute useFor={'BALISE'} redirect={'/supervision/'} ><BorneBalise /></ProtectedRoute>} />
                                  <Route path="supervision/user-manager" element={<ProtectedRoute useFor={'USERS'} redirect={'/supervision/'} ><UserManager /></ProtectedRoute>} />
                                  <Route path="supervision/map" element={<ProtectedRoute useFor={'MAP'} redirect={'/supervision/'}><BorneMap /></ProtectedRoute>} />
                                  <Route path="supervision/map/:borne_id" element={<ProtectedRoute useFor={'MAP'} redirect={'/supervision/'}><BorneMap /></ProtectedRoute>} />
                                  <Route path="supervision/map/:borne_id/:prise_id" element={<ProtectedRoute useFor={'MAP'} redirect={'/supervision/'}><BorneMap /></ProtectedRoute>} />
                                  <Route path="supervision/rules" element={<ProtectedRoute useFor={'RULES'} redirect={'/supervision/'}><Rules /></ProtectedRoute>}/>
                                  <Route path="supervision/settings" element={<ProtectedRoute useFor={'SETTINGS'} redirect={'/supervision/'}><Settings /></ProtectedRoute>}/>
                                  
                                  <Route path="supervision/absences" element={<ProtectedRoute useFor={'ABSENCE'} redirect={'/supervision/'}><Absences /></ProtectedRoute>}/>
                                  <Route path="supervision/absences/page_id" element={<ProtectedRoute useFor={'ABSENCE'} redirect={'/supervision/'}><Absences /></ProtectedRoute>}/> 
                                  <Route path="supervision/list" element={<ProtectedRoute useFor={'LIST'} redirect={'/supervision/'}><BorneList /></ProtectedRoute>}/>
                                  <Route path="supervision/list/:borne_id" element={<ProtectedRoute useFor={'LIST'} redirect={'/supervision/'}><BorneList /></ProtectedRoute>}/>
                                  <Route path="supervision/tickets" element={<ProtectedRoute useFor={'TICKET'} redirect={'/supervision/'}><Tickets /></ProtectedRoute>}/> 

                              </Routes>

                            </div>

                          </Router>
                        
                        </> : <Login />}


                        <Toast option={toastOption} setOption={setToastOption} />
                        <Popup option={popupOption} setOption={setPopupOption} />
                        <ContextMenu option={contextMenuOption} setContextMenuOption={setContextMenuOption} />

                        
                    </>
                    :
                    <Loader option={{
                      text: "Chargement...",
                      duration: "infinite",
                      timeout: {
                        time: 10000,
                        message: "Impossible de se connecter",
                        redirection: "/supervision/register-device"
                      }
                    }} />
                  }

                  </ContextMenuContext.Provider>
                </ToastContext.Provider>
              </PopupContext.Provider>
              </ThemeContext.Provider>
            </UserContext.Provider>
          </div>



}

export default App;