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
import {ReactComponent as BadgeIcon} from './assets/icons/badge.svg'
import {ReactComponent as MeteoIcon} from './assets/icons/meteo.svg'
import {ReactComponent as switchPageIcon} from './assets/icons/switch-page.svg'
import {ReactComponent as PortIcon} from './assets/icons/MaitreDePort2.svg'
import {ReactComponent as RepairIcon} from './assets/icons/repair-icon.svg'

import connectionAnimation from "./assets/lotties/wifi-connection.json";

import { Absences, BorneBalise, Bornecontrol, BorneList, BorneMap, BorneSelection, Consommation, Facturation, Login, Rules, Notification, ShareAccess, UserManager, Badges, SwitchPages, WriteInfo, WriteInfoARN, SwitchPagesARN} from './pages';
import { PopupContext, ToastContext, UserContext, ContextMenuContext, AffichageContextProvider} from "./contexts";
import React,{ useEffect, useMemo, useRef, useState } from "react";
import { connectAutomate, connectToServer, disconnectSocket, reconnectSavedFlag } from "./utils/serverSocketCom";
//import mapboxgl from '!mapbox-gl';
import { disconnectUser, getConnectedUser, setConnectedUser } from "./utils/storageUtil";
import { postToServer } from "./utils/serverHttpCom.js";
import { POPUP_ERROR } from "./components/Popup/Popup";
import ThemeContext, { DARK_THEME, LIGHT_THEME } from "./contexts/ThemeContext";
//mapboxgl.accessToken = 'pk.eyJ1Ijoic2VydmljZXNpIiwiYSI6ImNsODRtaXpiYjAxMmIzc2xkcjhvdzY4MHYifQ.5IFeaz7cElI08IZLGrxiFA';
import * as mapboxgl from 'mapbox-gl';

Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1Ijoic2VydmljZXNpIiwiYSI6ImNsODRtaXpiYjAxMmIzc2xkcjhvdzY4MHYifQ.5IFeaz7cElI08IZLGrxiFA')




function App() {

  const [display,setDisplay] = useState(true)
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [popupOption, setPopupOption] = useState(null);
  const [toastOption, setToastOption] = useState(null);
  const [contextMenuOption, setContextMenuOption] = useState(null);
  const [unlockProtectedPath, setUnlockProtectedPath] = useState(false);
  const [connected, setConnected] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme')? localStorage.getItem('theme') : DARK_THEME);
  const [typeUser, setTypeUser] = useState() // Type user PDP/ARN

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
// --------------------------------------------------------------------------------
  function connect(){
    //On récupere le userConnecté (Set depuis la page login.js)
    let userStorage = getConnectedUser();

    if(getConnectedUser('token')){
      if(!connectedLock.current){
        connectedLock.current = true;
        console.log('Send need-update')
        //Update du profile connecté
        postToServer('/utility/need-upgrade',{}, (({data}) => {
          /**
           * Renvoi un objet de ce type :
           * valid: true,
              user: {
                  access_level: user.access_level,
                  username: user.name,
                  token: token,
                  authorized_interface: user.authorized_interface
              }
           */
          if(data.valid){
            setConnectedUser(data.user)

            switch(data.user.access_level){
              case "Administrateur":
                case 'Dev':
                case 'Opérateur (port)':
                case 'Facture':
                  setTypeUser(1);
                  break;
                case 'Opérateur (ARN)':
                case 'ARN':
                  setTypeUser(2);
                  break;
                default:
                  setTypeUser(1);
                  console.log("Type d'utilisateur non reconnu : " + data.user.access_level);
                  break;
            }

            connectToServer(getConnectedUser('token'), (connected) => {

              if(!connected){
                console.log("RECONNEXION EN COURS")
                connect;
                //TEMPORAIRE : ON ENLEVE LE MESSAGE SE RECONNECTER CAR EMBETANT
                // setPopupOption({
                //   lottie: connectionAnimation,
                //   text: 'Vous avez été déconnecté du serveur.',
                //   secondaryText: 'Ceci peut ce produire lorsqu\'il y a 2 pages ouverte avec les même identifiants.',
                //   acceptText: 'Se reconnecter',
                //   onAccept: connect
                // })
                
              }else{
                reconnectSavedFlag()
                setConnected(true)
                setUser(userStorage)
              }
            

             
  
              console.log("Connection state:", connected)
      
            })
          }

          

        }), () => {
          //Si il y a une erreur alors on déconnecte l'utilisateur
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

    }

    return '/supervision/map'
  }


  return  <div onClick={handleCloseContextMenu} className={"main-container no-select "+(theme)}>
  

            <UserContext.Provider value={userContextValue}>
            <ThemeContext.Provider value={themeContextValue}>
              <PopupContext.Provider value={popupContextValue}>
                <ToastContext.Provider value={toastContextValue}>
                  <ContextMenuContext.Provider value={contextMenuContextValue}>
                    <AffichageContextProvider>
                    {
                      connected ? (<> 

                            { user && typeUser === 1 ? (
                            <>
                              
                                <Router>
                                    <Header paths={[
                                      {name: "Carte des bornes", path: "/supervision/map",Icon: MapIcon, secure: "MAP"},
                                      {name: "Liste des bornes", path: "/supervision/list",Icon: BorneListIcon, secure: "LIST"},
                                      {name: "Balisage", path: "/supervision/balise", Icon: PinIcon, secure: "BALISE"},
                                      {name: "Utilisateurs", path: "/supervision/user-manager", Icon: UsersIcon, secure: "USERS"},
                                      {name: "Règles", path: "/supervision/rules", Icon: RulesIcon, secure: "RULES"},
                                      {name: "Consommation", path: "/supervision/conso", Icon: ConsoIcon, secure: "CONSO"},
                                      {name: "Notification", path: "/supervision/notifications", Icon: SettingsIcon, secure: "NOTIFICATION"},
                                      {name: "Absences", path: "/supervision/absences", Icon: AbsentsIcon, secure: "ABSENCE"},
                                      {name: "Badges", path: "/supervision/badges", Icon: BadgeIcon, secure: "BADGE"},
                                      {name: "SwitchPages", path: "/supervision/SwitchPages", Icon: MeteoIcon, secure: "INFO"},
                                      {name: "Maitre de port", path: "/supervision/WriteInfo", Icon: PortIcon, secure: "INFO"}
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
                                    <Route path="supervision/map/:borne_id/prises" element={<ProtectedRoute useFor={'MAP'} redirect={'/supervision/'}><BorneMap /></ProtectedRoute>} />
                                    <Route path="supervision/rules" element={<ProtectedRoute useFor={'RULES'} redirect={'/supervision/'}><Rules /></ProtectedRoute>}/>
                                    <Route path="supervision/notifications" element={<ProtectedRoute useFor={'NOTIFICATION'} redirect={'/supervision/'}><Notification /></ProtectedRoute>}/>
                                    <Route path="supervision/absences" element={<ProtectedRoute useFor={'ABSENCE'} redirect={'/supervision/'}><Absences /></ProtectedRoute>}/>
                                    <Route path="supervision/absences/page_id" element={<ProtectedRoute useFor={'ABSENCE'} redirect={'/supervision/'}><Absences /></ProtectedRoute>}/> 
                                    <Route path="supervision/list" element={<ProtectedRoute useFor={'LIST'} redirect={'/supervision/'}><BorneList /></ProtectedRoute>}/>
                                    <Route path="supervision/list/:borne_id" element={<ProtectedRoute useFor={'LIST'} redirect={'/supervision/'}><BorneList /></ProtectedRoute>}/>
                                    <Route path="supervision/badges" element={<ProtectedRoute useFor={'BADGE'} redirect={'/supervision/'}><Badges /></ProtectedRoute>}/> 
                                    <Route path="supervision/SwitchPages" element={<ProtectedRoute useFor={'INFO'} redirect={'/supervision/'}><SwitchPages /></ProtectedRoute>}/>
                                    <Route path="supervision/WriteInfo" element={<ProtectedRoute useFor={'INFO'} redirect={'/supervision/'}><WriteInfo /></ProtectedRoute>}/> 

                                </Routes>

                              </div>

                            </Router>
                          
                          
                          </> ): user && typeUser === 2 ? (
                                <>
        
                                <Router>
                                    <Header paths={[
                                      {name: "Carte des bornes", path: "/supervision/map",Icon: MapIcon, secure: "MAP"},
                                      {name: "Liste des bornes", path: "/supervision/list",Icon: BorneListIcon, secure: "LIST"},
                                      {name: "Balisage", path: "/supervision/balise", Icon: PinIcon, secure: "BALISE"},
                                      {name: "Utilisateurs", path: "/supervision/user-manager", Icon: UsersIcon, secure: "USERS"},
                                      {name: "Règles", path: "/supervision/rules", Icon: RulesIcon, secure: "RULES"},
                                      {name: "Consommation", path: "/supervision/conso", Icon: ConsoIcon, secure: "CONSO"},
                                      {name: "Notification", path: "/supervision/notifications", Icon: SettingsIcon, secure: "NOTIFICATION"},
                                      {name: "Absences", path: "/supervision/absences", Icon: AbsentsIcon, secure: "ABSENCE"},
                                      {name: "Badges", path: "/supervision/badges", Icon: BadgeIcon, secure: "BADGE"},
                                      {name: "SwitchPagesARN", path: "/supervision/SwitchPagesARN", Icon: switchPageIcon, secure: "ARN"},
                                      {name: "Maitre de port", path: "/supervision/WriteInfo", Icon: PortIcon, secure: "INFO"},
                                      {name: "OptionAffichageARN", path: "/supervision/WriteInfoARN", Icon: RepairIcon, secure: "ARN"}
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
                                    <Route path="supervision/map/:borne_id/prises" element={<ProtectedRoute useFor={'MAP'} redirect={'/supervision/'}><BorneMap /></ProtectedRoute>} />
                                    <Route path="supervision/rules" element={<ProtectedRoute useFor={'RULES'} redirect={'/supervision/'}><Rules /></ProtectedRoute>}/>
                                    <Route path="supervision/notifications" element={<ProtectedRoute useFor={'NOTIFICATION'} redirect={'/supervision/'}><Notification /></ProtectedRoute>}/>
                                    <Route path="supervision/absences" element={<ProtectedRoute useFor={'ABSENCE'} redirect={'/supervision/'}><Absences /></ProtectedRoute>}/>
                                    <Route path="supervision/absences/page_id" element={<ProtectedRoute useFor={'ABSENCE'} redirect={'/supervision/'}><Absences /></ProtectedRoute>}/> 
                                    <Route path="supervision/list" element={<ProtectedRoute useFor={'LIST'} redirect={'/supervision/'}><BorneList /></ProtectedRoute>}/>
                                    <Route path="supervision/list/:borne_id" element={<ProtectedRoute useFor={'LIST'} redirect={'/supervision/'}><BorneList /></ProtectedRoute>}/>
                                    <Route path="supervision/badges" element={<ProtectedRoute useFor={'BADGE'} redirect={'/supervision/'}><Badges /></ProtectedRoute>}/> 
                                    <Route path="supervision/SwitchPagesARN" element={<ProtectedRoute useFor={'ARN'} redirect={'/supervision/'}><SwitchPagesARN /></ProtectedRoute>}/>
                                    <Route path="supervision/WriteInfo" element={<ProtectedRoute useFor={'INFO'} redirect={'/supervision/'}><WriteInfo /></ProtectedRoute>}/>
                                    <Route path="supervision/WriteInfoARN" element={<ProtectedRoute useFor={'ARN'} redirect={'/supervision/'}><WriteInfoARN /></ProtectedRoute>}/> 


                                </Routes>

                              </div>

                            </Router>
                          
                          
                          </>

                        ):<Login connect={connect}/>}


                          <Toast option={toastOption} setOption={setToastOption} />
                          <Popup option={popupOption} setOption={setPopupOption} />
                          <ContextMenu option={contextMenuOption} setContextMenuOption={setContextMenuOption} />

                          
                      </>)
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
                    </AffichageContextProvider>
                  </ContextMenuContext.Provider>
                </ToastContext.Provider>
              </PopupContext.Provider>
              </ThemeContext.Provider>
            </UserContext.Provider>
          </div>



}

export default App;
