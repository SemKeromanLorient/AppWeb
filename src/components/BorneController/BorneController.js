import React, { useContext, useEffect, useRef, useState } from "react";
import "./BorneController.style.css";
import {ReactComponent as ExpandIcon} from '../../assets/icons/arrow.svg';
import {ReactComponent as PlugIcon} from '../../assets/icons/plug.svg';
import {ReactComponent as StartIcon} from '../../assets/icons/start.svg';
import {ReactComponent as StopIcon} from '../../assets/icons/stop.svg';
import {ReactComponent as ElecIcon} from '../../assets/icons/electric-station.svg';
import {ReactComponent as ElecticIcon} from '../../assets/icons/energy.svg';
import {ReactComponent as NoElecIcon} from '../../assets/icons/no-power.svg';
import {ReactComponent as WaterIcon} from '../../assets/icons/tap-water.svg';
import {ReactComponent as LockIcon} from '../../assets/icons/lock-icon.svg';
import {ReactComponent as SearchIcon} from '../../assets/icons/search_icon.svg';
import {ReactComponent as BadgeIcon} from '../../assets/icons/badge.svg';
import {ReactComponent as IssueIcon} from '../../assets/icons/error.svg';
import { socketSend } from "../../utils/serverSocketCom.js";
import { getAuthorization, getAuthorizationFor, getConnectedUser } from "../../utils/storageUtil.js";
import { PopupContext } from "../../contexts/index.js";
import { POPUP_QUESTION } from "../Popup/Popup.js";
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/lotties/loading-animation.json";
import { useNavigate, useParams } from "react-router-dom";
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";
import { currentServerState, socketFlag } from "../../utils/serverSocketCom";


/**
 * 
 * @param {borne} currentlySelected Objet json contenant les données de la borne sélectionner
 * @param {badges} badges List de toutes les badges
 * @returns Un composant BorneControllerNew permettant l'affichage des infos et l'activation des prises des bornes avec un ID > 9
 */
function BorneController({currentlySelected,badges,setBornes}){

    //Booléen pour menu déroulant
    const [isExpand, setExpand] = useState(false);
    //Variable pour la prise sélectionner
    const [currentPriseSelected, setCurrentPriseSelected] = useState(null);
    //Exemples : 1001,1002,1003,1004 stock le num de la prise ici pour borne 10 prise 01,02, ...
    const { prise_id } = useParams();
    //Booléen pour savoir où on doit se situer
    const [pageHub, setPageHub] = useState(true);
    //Variable pour le text optionnel avant activation d'une prise
    const [optionalText, setOptionalText] = useState("");

    useEffect( () => {
        navigate('/supervision/map/'+currentlySelected.display)
        setPageHub(true)
    },[])

    // Réinitialisation d'état lors du changement de borne
    useEffect(() => {
        resetComponentState();
    }, [currentlySelected]);

    const navigate = useNavigate();

    // Réinitalisation d'états du composant
    const resetComponentState = () => {
        setExpand(false);
        setCurrentPriseSelected(null);
        setPageHub(true);
        setOptionalText("");
    };

    //Développement menu via fleche
    function handleExpand(){

        if(isExpand){
            navigate('/supervision/map/'+currentlySelected.display)
        }
        setExpand(!isExpand);
        setPageHub(true)
    }

    //Lancer quand on appuie sur "Retour | borne (num)"
    function handleGoBack(){
        navigate('/supervision/map/'+currentlySelected.display);

        setPageHub(true)

    }

    // Si on active le menu handle, setup la div avec la classe css activer ou non activer 
    return <div className={"borne-container"+ (isExpand? " expand" : " ") + (!currentlySelected? "hidden" : "")}>
        
        {currentlySelected && <>
        
            {!pageHub ? <div onClick={handleGoBack} className="go-back">
                <ExpandIcon className="go-back-icon" />
                <h3 className="third-title">Retour | Borne {currentlySelected.display}</h3>
            </div> : <h3 className="borne-name">Borne {currentlySelected.display}</h3>}

            {!isExpand && <h4 className="capacity">{currentlySelected.capacity -  (currentlySelected.capacity - currentlySelected.available)} prises libre</h4>}
            <div onClick={handleExpand} className={"expand-toggle "}>
                <ExpandIcon className="borne-expand-icon" />
            </div>
            {
                pageHub && (

                    <div className={"prises-section "+(!isExpand? "hidden" : "")}>
                                
                        <div className={"section"}>
                            
                            <div className="title-section-prise">
                                <ElecIcon className="title-icon"/>
                                <h3 className="third-title">Prises électriques</h3>
                            </div>
                            <div className={"prise-list-container"}>

                                {currentlySelected.prises.filter(({type}) => type !== "EAU").map((prise, index) => <PriseItem priseData={prise} onClick={() => {
                                    setCurrentPriseSelected(prise);
                                    setPageHub(false);
                                    
                                    }} 
                                    key={index}
                                    />
                                    )}

                            </div>
                        </div>
                            
                    </div>
                    
                    
                )
            }

            {
                !pageHub && (
                    <PriseControl prises={currentlySelected.prises} borne={currentlySelected} priseData={currentPriseSelected} setPriseData={setCurrentPriseSelected} setBornes={setBornes} badges={badges}/>
                )
            }
        
        </>}


    </div>



}


function PriseControl({prises, borne, setPriseData, setBornes, badges}){

    const connections = [
        { ip: '192.168.150.90', number: 1 }, //Borne 1
        { ip: '192.168.150.91', number: 2  }, //Borne 2
        { ip: '192.168.150.92', number: 3 }, //Borne 3
        { ip: '192.168.150.93', number: 4 }, //Borne 4
        { ip: '192.168.150.94', number: 5 }, //Borne 5
        { ip: '192.168.150.95', number: 6 }, //Borne 6
        { ip: '192.168.150.96', number: 7 }, //Borne 7
        { ip: '192.168.150.97', number: 8 }, //Borne 8
        { ip: '192.168.150.98', number: 9 }, //Borne 9
        { ip: '192.168.150.99', number: 10 }, //Borne 10
        { ip: '192.168.150.100', number: 11 }, //Borne 11
        { ip: '192.168.150.101', number: 12 }, //Borne 12
        { ip: '192.168.150.102', number: 13 }, //Borne 13
        { ip: '192.168.150.103', number: 14 }, //Borne 14 
        { ip: '192.168.150.104', number: 15 }, //Borne 15 
        { ip: '192.168.150.114', number: 25 }, //Borne 25 // Nouvelle
        { ip: '192.168.150.115', number: 26 }, //Borne 26 // Nouvelle
        { ip: '192.168.150.116', number: 27 }, //Borne 27 // Nouvelle
        { ip: '192.168.150.117', number: 28 }, //Borne 28 // Nouvelle
        { ip: '192.168.150.118', number: 29 }, //Borne 29 // Nouvelle 
        { ip: '192.168.150.119', number: 30 }, //Borne 30 // Nouvelle
        { ip: '192.168.150.120', number: 31 }, //Borne 31 // Nouvelle
        { ip: '192.168.150.121', number: 32 }, //Borne 32
        { ip: '192.168.150.122', number: 33 }, //Borne 33
        { ip: '192.168.150.123', number: 34 }, //Borne 34
        { ip: '192.168.150.124', number: 35 }, //Borne 35
        { ip: '192.168.150.126', number: 37 }, //Borne 37
        { ip: '192.168.150.127', number: 38 }, //Borne 38
        { ip: '192.168.150.128', number: 39 }, //Borne 39
        { ip: '192.168.150.129', number: 40 }, //Borne 40
        { ip: '192.168.150.130', number: 41 }, //Borne 41
        { ip: '192.168.150.131', number: 42 }, //Borne 42
        { ip: '192.168.150.132', number: 43 }, //Borne 43
        { ip: '192.168.150.133', number: 44 }, //Borne 44
        { ip: '192.168.150.133', number: 45 }, //Borne 45
        { ip: '192.168.150.133', number: 46 }, //Borne 46
        { ip: '192.168.150.134', number: 47 }, //Borne 47
        { ip: '192.168.150.134', number: 48 }, //Borne 48
        { ip: '192.168.150.134', number: 49 }, //Borne 49
        { ip: '192.168.150.139', number: 50 }, //Borne 50
      ];

    const [optionalUser, setOptionalUser] = useState('');
    const [saveTextPrise, setSaveTextPrise] = useState('');
    const [onWait, setOnWait] = useState(false);
    const [inputError, setInputError] = useState(false);
    //Variable pour le badge selectionné
    const [badge, setBadge] = useState(null);
    //Variable pour le filtre de badge
    const [selectBadgeFilter, setSelectBadgeFilter] = useState("");
    //Variable pour l'information de l'affichage ou non du champ text optionnel
    const [extend, setExtend] = useState(false);
    //Etat de la prise actuellement utilisé
    const [stateGoal, setStateGoal] = useState(0);
    //Variable pour la prise sélectionner, correspondant juste à son id
    const {prise_id} = useParams();
    //Variable contenant les données de la prise sélectionner (pas seulement son id)
    const [currentprise, setCurrentPrise] = useState(null);
    //Booléean contenant l'information de si l'utilisateur est bien connecté au serveur
    const [serverState, setServerState] = useState(false);
    const [borneState, setBorneState] = useState(false)

    const {setPopupOption} = useContext(PopupContext);
    const [defile, setDefile] = useState(false)
    
// ---------------------------------------- USE EFFECT

    useEffect(() => {
        verifConnexionDatabase();
        verifConnexionBorne();
    },[])

    //Dès que la prise sélectionner change ou que la liste des prises change alors setup la nouvelle currentPrise
    useEffect(() => {

        let prise = prises.find((value) => value.name == prise_id)

        if(prise)setStateGoal(prise.state) 

        setCurrentPrise(prise)

    }, [prise_id, prises])

    useEffect(() => {
        if (prise_id){
            let borne = prise_id.slice(0, 2);
            let prise = prise_id.slice(-2);
            getToServer('/prises/' + borne + '/' + prise , {}, ({data}) => {
                setSaveTextPrise(data[0].OptionText)
            }, (err) => {
                console.log("Erreur lors de la récupération des badges : ",err)

            })
        }
    },[prise_id])

    
    useEffect(() => {
        if (badge !== null && badge.username !== undefined){
            setExtend(true)
        } else {
            setExtend(false)
        }
    },[badge])

    useEffect(() => {
        console.log("OPTIONAL USER : " + optionalUser)
    },[optionalUser])

// --------------------------------------------- FIN USE EFFECT

// --------------------------------------------- FONCTION

    function useBadge(){
        navigate('/supervision/map/'+currentlySelected.display+"/prises/")
        
        const selectedBadge = JSON.parse(badge);
        setBadge(selectedBadge);

        setPageHub(false);

    }

    /**
     * Fonction permettant de trier une liste de badges afin de retourner la liste des badges inclues dans le filtre
     * @param {badge} badge Badges à filtrer pour savoir si oui ou non ils sont dans le filtre
     * @returns true si le badge est valide / false si le badge n'est pas valide
     * name/username : Filtrer selon deux champs possible
     */
    function filterFunction(badge){
        if (badge.name) {
            if(selectBadgeFilter !== '' && !badge.name.toUpperCase().includes(selectBadgeFilter.toUpperCase())) return false;
        }

        return true;

    }

    function refresh(){
        //Récupère les infos des bornes et let setup avec setBornes
        postToServer('/bornes/', {}, ({data}) => {
            setBornes(data.filter((borne) => !!borne))
            console.log("Info borne update !")

        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ",err)

        })
    }

    function handleInteract(e){

        e.preventDefault();

        if (serverState && borneState){

            if(stateGoal === currentprise.state){

                if(currentprise.state === 1){

                    setPopupOption({

                        text: 'Ouvrir la prise '+currentprise.prise+' ?',
                        //Regarder a qui sera la conso et l'afficher dans un texte
                        secondaryText: `La facture sera au nom de ${optionalUser ? optionalUser : (badge.name + " - " + badge.username)}`,                    
                        type: POPUP_QUESTION,
                        acceptText: 'Oui, ouvrir la prise', 
                        declineText: 'Non, annuler',
                        onAccept: () => { 

                            //On setup la prise à 4 permettant qu'elle soit compté comme étant en utilisation
                            setStateGoal(4)
                            setOnWait(true);
                            //Envoie du socket commande 'prise_update' avec comme params :
                            socketSend('prise_update', {
                                zone: borne.zone,
                                user: badge.username,
                                borne: borne.borne,
                                prise: currentprise.prise,
                                state: "ON",
                                badge: badge.number,
                                optionalUser: optionalUser ? optionalUser : `${badge.name} - ${badge.username}`
                            })
                            //Délai
                            setTimeout(() => {
                                refresh();
                                setOptionalUser('');
                            }, 3000);           
                        },
            
                    })
                }

                if(currentprise.state === 2){

                    setPopupOption({

                        text: 'Ouvrir la prise '+currentprise.prise+' ?',
                        //Regarder a qui sera la conso et l'afficher dans un texte
                        secondaryText: `La facture sera au nom de ${optionalUser ? optionalUser : badge.username}`,                    
                        type: POPUP_QUESTION,
                        acceptText: 'Oui, ouvrir la prise', 
                        declineText: 'Non, annuler',
                        onAccept: () => { 

                            //On setup la prise à 4 permettant qu'elle soit compté comme étant en utilisation
                            setStateGoal(4)
                            setOnWait(true);
                            //Envoie du socket commande 'prise_update' avec comme params :
                            socketSend('prise_update', {
                                zone: borne.zone,
                                user: badge.username,
                                borne: borne.borne,
                                prise: currentprise.prise,
                                state: "ON",
                                badge: badge.number,
                                optionalUser: optionalUser ? optionalUser : `${badge.name} - ${badge.username}`
                            })
                            //Délai
                            setTimeout(() => {
                                refresh();
                                setOptionalUser('');
                            }, 3000);           
                        },
            
                    })
                }



                if(currentprise.state === 4){
                    setPopupOption({

                        text: 'Fermer la prise '+currentprise.prise+' ?',
                        secondaryText: 'Ceci mettra fin à la consommation',
                        type: POPUP_QUESTION,
                        acceptText: 'Oui, fermer la prise',
                        declineText: 'Non, annuler',
                        onAccept: () => {

                            setStateGoal(1) 
                            setOnWait(true);
                            socketSend('prise_update', {
                                zone: borne.zone,
                                borne: borne.borne,
                                prise: currentprise.prise,
                                state: "OFF",
                                badge: badges[0].number,
                                optionalUser: optionalUser
                            })
                            //Délai
                            setTimeout(() => {
                                refresh();
                                setOptionalUser('');
                            }, 5000);    

                        },
            
                    })
                }


                if(currentprise.state === 3){
                    setPopupOption({

                        text: 'La prise '+currentprise.prise+' est bloqué ?',
                        secondaryText: 'à effectuer uniquement si la prise est bloqué.',
                        type: POPUP_QUESTION,
                        acceptText: 'Oui, forcer ça fermeture',
                        declineText: 'Non, annuler',
                        onAccept: () => {

                            setStateGoal(1)
                            setOnWait(true);
                            socketSend('prise_update', {
                                zone: borne.zone,
                                borne: borne.borne,
                                prise: currentprise.prise,
                                state: "OFF",
                                badge: badge.number,
                                optionalUser: optionalUser
                            })
                            //Délai
                            setTimeout(() => {
                                refresh();
                                setOptionalUser('');
                            }, 3000);    

                        },
            
                    })
                }
    
            }

        } else{
            console.error("Erreur : Impossible de se connecter à la base de donnée")
        }
    }

    function updateCurrentPrise(){
        setPopupOption({
            text: 'Vous souhaitez modifier l utilisateur de la prise ' + currentprise.prise,
            secondaryText: `L'utilisateur ${saveTextPrise ? saveTextPrise : currentprise.use_by} deviendra l'utilisateur ${optionalUser}`,            
            type: POPUP_QUESTION,
            acceptText: 'Oui, je valide la modification',
            declineText: 'Non, annuler',
            onAccept: () => {
                setStateGoal(1)
                setOnWait(true);
                socketSend('current_prise_update', {
                    borne: borne.borne,
                    prise: currentprise.prise,
                    optionalUser: optionalUser
                })
                //Délai
                setTimeout(() => {
                    refresh();
                    setOptionalUser('');
                }, 3000);    

            },

        })
    }

    function verifConnexionDatabase(){
        //Faire un ping à l'adresse du serveur de bdd

        //Vérifie si l'utilisateur est bien connecté à la base de données
        currentServerState(setServerState)
        socketFlag('connection_made', () => {
            console.log('connected')
            setServerState(true)})
        socketFlag('disconnection', () => setServerState(false))



    }

    function verifConnexionBorne(){
        //Vérifie si l'utilisateur peut ping sans erreur la borne
        const connection = connections.find(conn => conn.number === borne.borne);
        if (connection) {
            getToServer('/utility/ping/' + connection.ip, {}, ({data}) => {
                if (data.alive) {
                    console.log(`La borne ${borne.borne} est connectée.`);
                    setBorneState(true)
                } else {
                    console.error(`La borne ${borne.borne} ne répond pas.`);
                    setBorneState(false)
                }
            }, (err) => {
                console.log("Erreur pour ping la borne : ",err)

            })

        }
    }

    const handleSelectBadge = (event) => {
        if (event.target.value !== ''){
            setBadge(JSON.parse(event.target.value));
        } else {
            setBadge('')
        }
    }

    // Définir le gestionnaire d'événements onClick
    const handleSelectClick = () => {
        setDefile(!defile); // Inverser la valeur de defile lors du clic sur le select
    };
// -------------------------------------------------- FIN FONCTION
    
    return <div className={"prise-control-container "+ (!currentprise? "hidden" : "")}>

        {currentprise && 
        <>

            <div className="upper-section">
            {
                currentprise.state === 4 && <>

                    {
                        currentprise.use_by? <>
                            <h2 className="title-prise"> <ElecticIcon className="icon-elec-1" /> Prise {currentprise.prise} : {saveTextPrise !== '[object Object]' &&  saveTextPrise ? saveTextPrise : currentprise.use_by} </h2>
                            <h3 className="third-title">La fermeture de la prise terminera <br/> la consommation.</h3>

                        </> : 
                        <>
                              <h2>La prise semble etre forcé</h2>
                              <h3 className="third-title">Aucune consommation ne sera relevé.</h3>
                        </>

                    }
                  

                </>
            }

            {
                currentprise.state === 8 && <>

                    <h2 className="title-prise"><IssueIcon className="icon-elec-2"/> Prise {currentprise.prise} : en défaut</h2>
                    <h3 className="third-title">Impossible de fermer ou d'ouvrir <br/> la prise</h3>

                </>
            }

            {
                currentprise.state === 2 && <>
    
                    <h2 className="title-prise"><IssueIcon className="icon-elec-2"/> Prise {currentprise.prise} : hors connexion</h2>
                    <h3 className="third-title">La prise est hors connexion</h3>

                </>
            }

            {
                currentprise.state === 1 && <>
                    <h2 className="title-prise" ><NoElecIcon className="icon-elec-3" style={{marginRight:'2%'}}/> Prise {currentprise.prise} : Disponible </h2> 
                    <div>
                        <div className={"section-badge"}>
                            <div className="title-borne"> 
                                <h3 className="text-user"> Badge : </h3> 
                            </div>
                            <div className="title-section-badge"  style={{ display: "flex", justifyContent: "center"}}>
                                {selectBadgeFilter.length <= 0 &&
                                    <SearchIcon className="search-icon" style={{ pointerEvents: 'none' }}/>
                                } <input value={selectBadgeFilter} onChange={({target}) => setSelectBadgeFilter(target.value)}  className="add-info-conso"/>  
                                    <select className="list-section-badges" onClick={handleSelectClick} onChange={handleSelectBadge}> 
                                        <option value="">Selectionner le badge</option>
                                        {badges.filter(filterFunction).map((badge, index) => (
                                            <option key={index} value={JSON.stringify(badge)}>
                                                {`${badge.name} - ${badge.username}`.length > 30 
                                                ? `${`${badge.name} - ${badge.username}`.slice(0, 30)}...`
                                                : `${badge.name} - ${badge.username}`}                             
                                            </option>
                                        ))}
                                    </select>

                                    <ExpandIcon className={"defile-select " + (defile ? "defile-select-expand" : "")} style={{ pointerEvents: 'none' }}/>
                            </div>
                        </div>  
                    </div>
                </>
            }

            {
                currentprise.state === 1 && !extend && <>

                    <h4 style={{marginTop:'5%'}}>Vous devez selectionner un badge pour <br/> continuer</h4>
                </>
            }

            {
                currentprise.state === 1 && extend && <>

                    <h3 className="short-title">Pas de badge ? Indiquer la société à facturer</h3>

                   
                        {getAuthorizationFor('MAP', 'update') &&  <form className="facture-name-container" onSubmit={handleInteract} >
                            <input value={optionalUser} onChange={({target}) => setOptionalUser(target.value)} className={"facturation-name "+(inputError? "error" : "")} type={'text'} placeholder={'Nom du bateau...'} />
                            </form>}
                    
                    
                </>
            }

            </div>

            <div className="middle-section">
                {
                    currentprise.state === 4 && <>
                            <h3 className="short-title">Vous souhaitez indiquer un autre bateau <br/> pour la consommation ?</h3>
                            {getAuthorizationFor('MAP', 'update') && 
                                <input value={optionalUser} onChange={({target}) => setOptionalUser(target.value)} className={"facturation-name "+(inputError? "error" : "")} type={'text'} placeholder={'Nom du bateau...'} />
                            }
                            <div onClick={updateCurrentPrise} className={"validate-btn"}>
                                <h4>Valider</h4>
                            </div>
                    </>
                }
            </div>
           

            {extend && currentprise.state === 1 && currentprise.state !== 5 && currentprise.state !== 8 && <div onClick={handleInteract} className={"control-button "+((currentprise.state === 1)? "toOpen" : "toClose")}>
                {stateGoal !== currentprise.state? <Lottie animationData={loadingAnimation} className={"btn-loading"} /> : <>

                    {(currentprise.state === 1) && <StartIcon className="icon-btn" />}     
                    {currentprise.state === 1 && <h3 className="third-title">Ouvrir la prise</h3>}
                
                </>}
          
        
            </div>
           }

            {!extend && (currentprise.state === 4 || currentprise.state === 3) && currentprise.state !== 5 && currentprise.state !== 8 && <div onClick={handleInteract} className={"control-button "+((currentprise.state === 1)? "toOpen" : "toClose")}>
                    {stateGoal !== currentprise.state? <Lottie animationData={loadingAnimation} className={"btn-loading"} /> : <>

                        {(currentprise.state === 4 || currentprise.state === 3) && <StopIcon/>}    
                        {currentprise.state === 4? (currentprise.use_by?  <h3 className="third-title">Fermer la prise</h3> : <h3 className="third-title">Tenter de fermer</h3> ) : null}
                    
                    </>}
            
            
                </div>
            }

            {extend && (currentprise.state === 4 || currentprise.state === 3) && currentprise.state !== 5 && currentprise.state !== 8 && <div onClick={handleInteract} className={"control-button "+((currentprise.state === 1)? "toOpen" : "toClose")}>
                    {stateGoal !== currentprise.state? <Lottie animationData={loadingAnimation} className={"btn-loading"} /> : <>
                    {(currentprise.state === 4 || currentprise.state === 3) && <StopIcon/>}    
                    {currentprise.state === 4? (currentprise.use_by?  <h3 className="third-title">Fermer la prise</h3> : <h3 className="third-title">Tenter de fermer</h3> ) : null}
                    
                    </>}
            
            
                </div>
            }

        </>}

        

    </div>

}

function PriseItem({priseData, onClick}){


    const navigate = useNavigate();
    const {borne_id} = useParams();

    const [textPrise, setTextePrise] = useState();

    useEffect(() => {
        console.log("JSON.stringify priseItem : " + JSON.stringify(priseData))
    },[])

    useEffect(() => {
        if (priseData){
            let borne = priseData.name.slice(0, 2);
            let prise = priseData.name.slice(-2);
            getToServer('/prises/' + borne + '/' + prise , {}, ({data}) => {
                setTextePrise(data[0].OptionText)
            }, (err) => {
                console.log("Erreur lors de la récupération des badges : ",err)

            })
        }
    },[priseData])

    

    function handleClick(){

            onClick(priseData);
            
            navigate('/supervision/map/'+borne_id+'/'+priseData.name)
        
    }


    return <div onClick={handleClick} className={"prise-access "+("state-"+priseData.state)}>
        <h2>Prise : {priseData.prise} {priseData.state_label === "Ouvert" && textPrise && textPrise !== '[object Object]' ? "| " + textPrise : ""} {priseData.state_label === "Ouvert" && (!textPrise || textPrise === '[object Object]') ? "| " +  priseData.use_by : ""} </h2>
        <h4>{priseData.type} | {priseData.state !== 2 ? priseData.state_label : 'Prise hors connexion'} {priseData.state_label === "Ouvert" && priseData.use_by && textPrise && textPrise !== '[object Object]'  ? "| " +  priseData.use_by : ""}</h4>

       <ExpandIcon className="go-to-icon" />


    </div>

}

export default BorneController;
