import React, { useContext, useEffect, useRef, useState } from "react";
import "./BorneControllerNew.style.css";
import {ReactComponent as ExpandIcon} from '../../assets/icons/arrow.svg';
import {ReactComponent as PlugIcon} from '../../assets/icons/plug.svg';
import {ReactComponent as StartIcon} from '../../assets/icons/start.svg';
import {ReactComponent as StopIcon} from '../../assets/icons/stop.svg';
import {ReactComponent as ElecIcon} from '../../assets/icons/electric-station.svg';
import {ReactComponent as WaterIcon} from '../../assets/icons/tap-water.svg';
import {ReactComponent as LockIcon} from '../../assets/icons/lock-icon.svg';
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
    //Variable stockant le badge selectionné
    const [currentBadge, setBadge] = useState(null);
    //Variable booleen indiquant où on doit se situer
    const [pagePrise, setPagePrise] = useState(false);
    const [pageHub, setPageHub] = useState(true);
    const [pageActivate, setPageActivate] = useState(false);
    //Variable stockant le filtre de badge
    const [selectBadgeFilter,setSelectBadgeFilter] = useState("");
    //Variable stockant le text optionnel avant l'activation d'une prise
    const [optionalText, setOptionalText] = useState("");

    useEffect( () => {
        navigate('/supervision/map/'+currentlySelected.display)
        setPageHub(true)
        setPagePrise(false)
        setPageActivate(false)
        console.log("Badges : " + JSON.stringify(badges))
        console.log("CurrentlySelected : " + JSON.stringify(currentlySelected))
    },[])

    //Debug
    useEffect( () => {
        console.log("PagePrise : " + pagePrise);
    },[pagePrise])
    useEffect( () => {
        console.log("PageHub : " + pageHub);
    },[pageHub])
    useEffect( () => {
        console.log("PageActivate : " + pageActivate);
    },[pageActivate])

    // Effet pour réinitialiser les états lors du changement de borne
    useEffect(() => {
        resetComponentState();
    }, [currentlySelected]);

    const navigate = useNavigate();
    const selectBadge = React.useRef();

    /*useEffect(() => {
        console.log("CURENTLYSELECTED : " + JSON.stringify(currentlySelected))
        navigate('/supervision/map/'+currentlySelected.display)
        setPageHub(true)
        setPagePrise(false)
        setPageActivate(false)
    }, [currentlySelected])*/

    // Fonction pour réinitialiser les états du composant
    const resetComponentState = () => {
        setExpand(false);
        setCurrentPriseSelected(null);
        setBadge(null);
        setPagePrise(false);
        setPageHub(true);
        setPageActivate(false);
        setSelectBadgeFilter("");
        setOptionalText("");
    };

    //Quand on clique sur la fleche dans le menu
    function handleExpand(){

        if(isExpand){
            navigate('/supervision/map/'+currentlySelected.display)
        }
        setExpand(!isExpand);
        setPagePrise(false)
        setPageActivate(false)
        setPageHub(true)
    }

    //Lancer quand on appuie sur "Retour | borne (num)"
    function handleGoBack(){
        navigate('/supervision/map/'+currentlySelected.display);
        // console.log("TEST2")


        if(pageActivate){
            setPageHub(false)
            setPagePrise(true)
            setPageActivate(false)
        } else if (pagePrise){
            setPageHub(true)
            setPagePrise(false)
            setPageActivate(false)
        }

    }

    function useBadge(){
        navigate('/supervision/map/'+currentlySelected.display+"/prises/")
        
        const selectedBadge = JSON.parse(selectBadge.current.value);
        console.log("SelectedBadge : ", selectedBadge);
        setBadge(selectedBadge);

        setPagePrise(true);
        setPageHub(false);
        setPageActivate(false);

    }

    /**
     * Fonction permettant de trier une liste de badges afin de retourner la liste des badges inclues dans le filtre
     * @param {badge} badge Badges à filtrer pour savoir si oui ou non ils sont dans le filtre
     * @returns true si le badge est valide / false si le badge n'est pas valide
     * name/username : Filtrer selon deux champs possible
     */
    function filterFunction(badge){

        if(selectBadgeFilter !== '' && !badge.name.toUpperCase().includes(selectBadgeFilter.toUpperCase())) return false;

        return true;

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
        
            {pageHub && (
                <div className={"badge-section "+(!isExpand? "hidden" : "")}>
                <div className={"section"}>
                    <div className="title-section-badge" style={{ display: "flex", justifyContent: "center" }}>
                        <h2 className="title-available-borne">Borne disponible</h2> 
                    </div>
                    <div className="section-explication">
                        
                        <h2 className="title-borne">Activation de badge </h2>
                        <h3 className="text-explication-badge">
                            Veuillez indiquer le numéro de badge pour activer une prise
                        </h3>
                    </div>
                    <div className="search-section-bis">
                        <input value={selectBadgeFilter} onChange={({target}) => setSelectBadgeFilter(target.value)} className="add-info-conso" placeholder="Username"   style={{ marginTop: '15px', textAlign: 'center' }}/>  
                    </div> 
                    <div className="title-borne" style={{marginTop: "40px"}} > 
                        <h3 className="text-user"> Utilisateur : </h3> 
                    </div>
                    <div className="title-section-badge"  style={{ display: "flex", justifyContent: "center",marginTop: "15px"}}> 
                        <select className="list-section-badges" ref={selectBadge}>
                            {badges.filter(filterFunction).map((badge, index) => (
                                <option key={index} value={JSON.stringify(badge)}>
                                {badge.name} - {badge.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="title-section-badge-prise" style={{ display: "flex", justifyContent: "center" }}>
                        <button className="button-vers-prise" onClick={useBadge}>
                             <StartIcon className="icon-btn"/> 
                             <span className="button-text">Activer Prise</span>
                        </button>
                    </div>
                    
                </div>

            </div>
            )

            }
            {
                pagePrise && (

                    <div className={"prises-section "+(!isExpand? "hidden" : "")}>
                        {
                            !pageActivate && (
                                
                        <div className={"section"}>
                            
                            <div className="title-section-prise">
                                <ElecIcon className="title-icon"/>
                                <h3 className="third-title">Prises électriques</h3>
                            </div>
                            <div className={"prise-list-container"}>

                                {currentlySelected.prises.filter(({type}) => type !== "EAU").map((prise, index) => <PriseItem priseData={prise} onClick={() => {
                                    setCurrentPriseSelected(prise);
                                    setPageActivate(true);
                                    
                                    }} 
                                    key={index}
                                    />
                                    )}

                            </div>
                        </div>
                            )
                        }
                        
                        {currentlySelected.prises.filter(({type}) => type === "EAU").length > 0 && <div className={"section"}>
                            <div className="title-section-prise">
                                <WaterIcon className="title-icon"/>
                                <h3 className="third-title">Prises eaux</h3>
                            </div>
                            <div className={"prise-list-container"}>

                                {currentlySelected.prises.filter(({type}) => type === "EAU").map((prise, index) => <PriseItem  priseData={prise}  onClick={setCurrentPriseSelected} key={index}/>)}

                            </div>
                        </div>}
                        <PriseControl prises={currentlySelected.prises} borne={currentlySelected} priseData={currentPriseSelected} setPriseData={setCurrentPriseSelected} badge={currentBadge} setBornes={setBornes}/>
                    </div>
                    
                    
                )
            }
        
           
            
           
            

        </>}


    </div>



}


function PriseControl({prises, borne, setPriseData, badge, setBornes}){

    const [optionalUser, setOptionalUser] = useState('');
    const [saveTextPrise, setSaveTextPrise] = useState('');
    const [onWait, setOnWait] = useState(false);
    const [inputError, setInputError] = useState(false);
    //Etat de la prise actuellement utilisé
    const [stateGoal, setStateGoal] = useState(0);
    //Variable de la prise sélectionner, correspondant juste à son id
    const {prise_id} = useParams();
    //Variable contenant les données de la prise sélectionner (pas seulement son id)
    const [currentprise, setCurrentPrise] = useState(null);



    useEffect(() => {
        console.log("TEST PRISECONTROL (prises) : " + JSON.stringify(prises))
        console.log("TEST PRISECONTROL (borne) : " + JSON.stringify(borne))
        console.log("TEST PRISECONTROL (badge) : " + JSON.stringify(badge))
        // getToServer('/prises/${borne}/${prise_id}')
    },[])

    useEffect(() => {
        if (badge) { // Assurez-vous que badge n'est pas null ou undefined
            console.log("Badge (priseControl) : " + badge);
            console.log("Badge (priseControl) - Username : " + badge.username);
            console.log("Badge (priseControl) - Number : " + badge.number);
        }
    },[badge])

    //Dès que la prise sélectionner change ou que la liste des prises change alors setup la nouvelle currentPrise
    useEffect(() => {
        console.log("TEST CHANGEMENT PRISE")

        let prise = prises.find((value) => value.name == prise_id)

        if(prise)setStateGoal(prise.state) 

        setCurrentPrise(prise)

    }, [prise_id, prises])

    useEffect(() => {
        if (prise_id){
            console.log("Prise_ID : " + prise_id)
            let borne = prise_id.slice(0, 2);
            let prise = prise_id.slice(-2);
            console.log("Borne : " + borne)
            console.log("Prise : " + prise)
            getToServer('/prises/' + borne + '/' + prise , {}, ({data}) => {
                console.log("Data prises : " + JSON.stringify(data))
                setSaveTextPrise(data[0].OptionText)
            }, (err) => {
                console.log("Erreur lors de la récupération des badges : ",err)

            })
        }
    },[prise_id])

    useEffect(() => {

        console.log("optionalUser : " + optionalUser);

    }, [optionalUser])

    const {setPopupOption} = useContext(PopupContext);

    function refresh(){
        //Get les infos des bornes et set ces infos avec setBornes
        console.log("Refresh info borne")
        postToServer('/bornes/', {}, ({data}) => {
            setBornes(data.filter((borne) => !!borne))

        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ",err)

        })
    }

    function handleInteract(e){
        console.log("IN handleInteract")

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
                console.log("Test IN currentprise.state === 1")
                setPopupOption({

                    text: 'Ouvrir la prise '+currentprise.prise+' ?',
                    //Regarder a qui sera la conso et l'afficher dans un texte
                    secondaryText: `La facture sera au nom de ${optionalUser ? optionalUser : currentprise.use_by}`,                    
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
                            optionalUser: optionalUser
                        })
                        //Délai
                        setTimeout(() => {
                            refresh();
                            setOptionalUser('');
                        }, 1500);           
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
                            badge: badge.number,
                            optionalUser: optionalUser
                        })
                        //Délai
                        setTimeout(() => {
                            refresh();
                            setOptionalUser('');
                        }, 1500);    

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
                        }, 1500);    

                    },
        
                })
            }


           
        }

        
    }
    
    return <div className={"prise-control-container "+ (!currentprise? "hidden" : "")}>

        {currentprise && <>

            <div className="upper-section">
            <PlugIcon className="plug-icon" />

            <h1>Prise {currentprise.prise}</h1>



            {
                currentprise.state === 4 && <>

                    {
                        currentprise.use_by? <>
                          <h2>
                            Prise en cours d'utilisation par <br/> 
                            {saveTextPrise !== '[object Object]' && saveTextPrise ? saveTextPrise : currentprise.use_by}
                            </h2>
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
                currentprise .state === 3 && <>

                    <h2>Fin de consommation...</h2>
                    <h3 className="third-title">Enregistrement de la consommation</h3>
                    <h3 className="third-title">La prise devrait etre de <br/> nouveau disponible <br/> dans quelque instant...</h3>

                </>
            }

            {
                currentprise .state === 5 && <>

                    <h2>Arrêt forcé de la prise</h2>
                    <h3 className="third-title">Impossible de fermer ou d'ouvrir <br/> la prise</h3>

                </>
            }


            {
                currentprise .state === 8 && <>

                    <h2>La prise est en défaut</h2>
                    <h3 className="third-title">Impossible de fermer ou d'ouvrir <br/> la prise</h3>

                </>
            }

            {
                currentprise .state === 1 && <>

                    <h2>Prise disponible</h2>
                    <h3 className="third-title">Vous pouvez indiquer le nom du bateau<br/>(ou entreprise) pour lequel la<br/>consommation sera  facturé (optionnel).</h3>

                   
                        {getAuthorizationFor('MAP', 'update') &&  <form className="facture-name-container" onSubmit={handleInteract} >
                            <input value={optionalUser} onChange={({target}) => setOptionalUser(target.value)} className={"facturation-name "+(inputError? "error" : "")} type={'text'} placeholder={'Nom du bateau...'} />
                            </form>}
                    
                    
                </>
            }

            </div>
           
            {currentprise.state !== 5 && currentprise.state !== 8 && <div onClick={handleInteract} className={"control-button "+((currentprise.state === 1)? "toOpen" : "toClose")}>
                {stateGoal !== currentprise.state? <Lottie animationData={loadingAnimation} className={"btn-loading"} /> : <>

                    {(currentprise.state === 1) && <StartIcon className="icon-btn" />}     
                    {(currentprise.state === 4 || currentprise.state === 3) && <StopIcon/>}    
                    {currentprise.state === 1 && <h3 className="third-title">Ouvrir la prise</h3>}
                    {currentprise.state === 4? (currentprise.use_by?  <h3 className="third-title">Fermer la prise</h3> : <h3 className="third-title">Tenter de fermer</h3> ) : null}
                
                </>}
              
            
            </div>}
        </>}

        

    </div>

}

function PriseItem({priseData, onClick}){


    const navigate = useNavigate();
    const {borne_id} = useParams();


    function handleClick(){

            onClick(priseData);
            
            navigate('/supervision/map/'+borne_id+'/'+priseData.name)
        
    }


    return <div onClick={handleClick} className={"prise-access "+("state-"+priseData.state)}>
        <h2>Prise : {priseData.prise}</h2>
        <h4>{priseData.type} | {priseData.state_label}</h4>

       <ExpandIcon className="go-to-icon" />


    </div>

}

export default BorneControllerNew;