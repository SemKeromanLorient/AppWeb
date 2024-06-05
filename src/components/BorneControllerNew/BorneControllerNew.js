import React, { useContext, useEffect, useRef, useState } from "react";
import "./BorneControllerNew.style.css";
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
import { socketSend } from "../../utils/serverSocketCom";
import { getAuthorization, getAuthorizationFor, getConnectedUser } from "../../utils/storageUtil";
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../Popup/Popup";
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/lotties/loading-animation.json";
import { useNavigate, useParams } from "react-router-dom";
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";


/**
 * 
 * @param {borne} currentlySelected Objet json contenant les données de la borne sélectionner
 * @param {badges} badges List de toutes les badges
 * @returns Un composant BorneControllerNew permettant l'affichage des infos et l'activation des prises des bornes avec un ID > 9
 */
function BorneControllerNew({currentlySelected,badges,setBornes}){

    //Variable regardant si le menu déroulant est on ou off
    const [isExpand, setExpand] = useState(false);
    //Variable stockant la prise sélectionner
    const [currentPriseSelected, setCurrentPriseSelected] = useState(null);
    //Exemples : 1001,1002,1003,1004 stock le num de la prise ici pour borne 10 prise 01,02, ...
    const { prise_id } = useParams();
    //Variable booleen indiquant où on doit se situer
    const [pageHub, setPageHub] = useState(true);
    //Variable stockant le text optionnel avant l'activation d'une prise
    const [optionalText, setOptionalText] = useState("");

    useEffect( () => {
        navigate('/supervision/map/'+currentlySelected.display)
        setPageHub(true)
    },[])

    // Effet pour réinitialiser les états lors du changement de borne
    useEffect(() => {
        resetComponentState();
    }, [currentlySelected]);

    const navigate = useNavigate();

    // Fonction pour réinitialiser les états du composant
    const resetComponentState = () => {
        setExpand(false);
        setCurrentPriseSelected(null);
        setPageHub(true);
        setOptionalText("");
    };

    //Quand on clique sur la fleche dans le menu
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

    const [optionalUser, setOptionalUser] = useState('');
    const [saveTextPrise, setSaveTextPrise] = useState('');
    const [onWait, setOnWait] = useState(false);
    const [inputError, setInputError] = useState(false);
    //Variable stockant le badge selectionné
    const [badge, setBadge] = useState(null);
    //Variable stockant le filtre de badge
    const [selectBadgeFilter, setSelectBadgeFilter] = useState("");
    //Variable stockant l'information de l'affichage ou non du champ text optionnel
    const [extend, setExtend] = useState(false);
    //Etat de la prise actuellement utilisé
    const [stateGoal, setStateGoal] = useState(0);
    //Variable de la prise sélectionner, correspondant juste à son id
    const {prise_id} = useParams();
    //Variable contenant les données de la prise sélectionner (pas seulement son id)
    const [currentprise, setCurrentPrise] = useState(null);
    const {setPopupOption} = useContext(PopupContext);
    const [defile, setDefile] = useState(false)
    
// ---------------------------------------- USE EFFECT

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
        //Get les infos des bornes et set ces infos avec setBornes
        postToServer('/bornes/', {}, ({data}) => {
            setBornes(data.filter((borne) => !!borne))
            console.log("Info borne update !")

        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ",err)

        })
    }

    function handleInteract(e){

        e.preventDefault();

        if(stateGoal === currentprise.state){

            /*
            if(currentprise.state === 1 && getAuthorizationFor('MAP', 'update') &&  userToOpen === ""){
                console.log("Test in currentprise.state === 1 (2)")
                setInputError(true)
                setTimeout(() => {

                    setInputError(false);

                }, 500)
                return;
            } */



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
                // //Délai
                setTimeout(() => {
                    refresh();
                    setOptionalUser('');
                }, 3000);    

            },

        })
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

export default BorneControllerNew;
