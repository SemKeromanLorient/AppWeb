import React, { useContext, useEffect, useRef, useState } from "react";
import "./BorneController.style.css";
import {ReactComponent as ExpandIcon} from '../../assets/icons/arrow.svg';
import {ReactComponent as PlugIcon} from '../../assets/icons/plug.svg';
import {ReactComponent as StartIcon} from '../../assets/icons/start.svg';
import {ReactComponent as StopIcon} from '../../assets/icons/stop.svg';
import {ReactComponent as ElecIcon} from '../../assets/icons/electric-station.svg';
import {ReactComponent as WaterIcon} from '../../assets/icons/tap-water.svg';
import { socketSend } from "../../utils/serverSocketCom";
import { getAuthorization, getAuthorizationFor, getConnectedUser } from "../../utils/storageUtil";
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../Popup/Popup";
import Lottie from 'lottie-react'
import loadingAnimation from "../../assets/lotties/loading-animation.json";
import { useNavigate, useParams } from "react-router-dom";



function BorneController({currentlySelected}){

    const [isExpand, setExpand] = useState(false);
    const [currentPriseSelected, setCurrentPriseSelected] = useState(null);
    const { prise_id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {

        if(prise_id)setExpand(true);
        
    }, [prise_id])

    function handleExpand(){
        if(isExpand){
            navigate('/supervision/map/'+currentlySelected.borne)
        }
        setExpand(!isExpand);
        
    }

    function handleGoBack(){

        navigate('/supervision/map/'+currentlySelected.borne)

    }

    return <div className={"borne-container"+ (isExpand? " expand" : " ") + (!currentlySelected? "hidden" : "")}>

        {currentlySelected && <>
        
            {prise_id ? <div onClick={handleGoBack} className="go-back">
                <ExpandIcon className="go-back-icon" />
                <h3>Retour | Borne {currentlySelected.borne}</h3>
            </div> : <h3 className="borne-name">Borne {currentlySelected.borne}</h3>}

            {!isExpand && <h4 className="capacity">{currentlySelected.capacity -  (currentlySelected.capacity - currentlySelected.available)} prises libre</h4>}
            <div onClick={handleExpand} className={"expand-toggle "}>
                <ExpandIcon className="borne-expand-icon" />
            </div>
        

            <div className={"prises-section "+(!isExpand? "hidden" : "")}>
                <div className={"section"}>
                    <div className="title-section-prise">
                        <ElecIcon className="title-icon"/>
                        <h3>Prises électriques</h3>
                    </div>
                    <div className={"prise-list-container"}>

                        {currentlySelected.prises.filter(({type}) => type !== "EAU").map((prise, index) => <PriseItem priseData={prise} onClick={setCurrentPriseSelected} key={index}/>)}

                    </div>
                </div>

                {currentlySelected.prises.filter(({type}) => type === "EAU").length > 0 && <div className={"section"}>
                    <div className="title-section-prise">
                        <WaterIcon className="title-icon"/>
                        <h3>Prises eaux</h3>
                    </div>
                    <div className={"prise-list-container"}>

                        {currentlySelected.prises.filter(({type}) => type === "EAU").map((prise, index) => <PriseItem  priseData={prise}  onClick={setCurrentPriseSelected} key={index}/>)}

                    </div>
                </div>}
            </div>
            
           
            
            <PriseControl prises={currentlySelected.prises} borne={currentlySelected} priseData={currentPriseSelected} setPriseData={setCurrentPriseSelected} />
            

        </>}


    </div>



}


function PriseControl({prises, borne, priseData, setPriseData}){

    const [userToOpen, setUserToOpen] = useState('');
    const [onWait, setOnWait] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [stateGoal, setStateGoal] = useState(0);
    const {prise_id} = useParams();
    const [currentprise, setCurrentPrise] = useState(null);


    useEffect(() => {

        let prise = prises.find((value) => value.name == prise_id)

        if(prise)setStateGoal(prise.state) 

        setCurrentPrise(prise)

    }, [prise_id, prises])

    const {setPopupOption} = useContext(PopupContext);


    function handleInteract(e){

        e.preventDefault();
  
        if(stateGoal === currentprise.state){

            if(currentprise.state === 1 && getAuthorizationFor('MAP', 'update') &&  userToOpen === ""){
                setInputError(true)
                setTimeout(() => {

                    setInputError(false);

                }, 500)
                return;
            }



            if(currentprise.state === 1){
                setPopupOption({

                    text: 'Ouvrir la prise '+currentprise.name+' ?',
                    secondaryText: 'La facture sera au nom de '+(getAuthorizationFor('MAP', 'update')? userToOpen : getConnectedUser('username')),
                    type: POPUP_QUESTION,
                    acceptText: 'Oui, ouvrir la prise',
                    declineText: 'Non, annuler',
                    onAccept: () => {
                        
                        setStateGoal(4)
                        setOnWait(true);
                        setUserToOpen('');
                        socketSend('prise_update', {
                            zone: borne.zone,
                            user: (getAuthorizationFor('MAP', 'update')? userToOpen : getConnectedUser('username')),
                            borne: borne.borne,
                            prise: currentprise.prise,
                            state: "ON"
                        })
                
                    },
        
                })
            }


            if(currentprise.state === 4){
                setPopupOption({

                    text: 'Fermer la prise '+currentprise.name+' ?',
                    secondaryText: 'Ceci mettra fin à la consommation',
                    type: POPUP_QUESTION,
                    acceptText: 'Oui, fermer la prise',
                    declineText: 'Non, annuler',
                    onAccept: () => {

                        setStateGoal(1) 
                        setOnWait(true);
                        setUserToOpen('');
                        socketSend('prise_update', {
                            zone: borne.zone,
                            borne: borne.borne,
                            prise: currentprise.prise,
                            state: "OFF"
                        })
                
                    },
        
                })
            }


            if(currentprise.state === 3){
                setPopupOption({

                    text: 'La prise '+currentprise.name+' est bloqué ?',
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
                            state: "OFF"
                        })
                
                    },
        
                })
            }


           
        }

        
    }
    
    return <div className={"prise-control-container "+ (!currentprise? "hidden" : "")}>

        {currentprise && <>

            <div className="upper-section">
            <PlugIcon className="plug-icon" />

            <h1>Prise {currentprise.name}</h1>



            {
                currentprise.state === 4 && <>

                    {
                        currentprise.use_by? <>
                          <h2>Prise en cours d'utilisation par <br/> {currentprise.use_by}</h2>
                            <h3>La fermeture de la prise terminera <br/> la consommation.</h3>
                        </> : 
                        <>
                              <h2>La prise semble etre forcé</h2>
                              <h3>Aucune consommation ne sera relevé.</h3>
                        </>

                    }
                  

                </>
            }

            {
                currentprise .state === 3 && <>

                    <h2>Fin de consommation...</h2>
                    <h3>Enregistrement de la consommation</h3>
                    <h3>La prise devrait etre de <br/> nouveau disponible <br/> dans quelque instant...</h3>

                </>
            }

            {
                currentprise .state === 5 && <>

                    <h2>Arrêt forcé de la prise</h2>
                    <h3>Impossible de fermer ou d'ouvrir <br/> la prise</h3>

                </>
            }


            {
                currentprise .state === 8 && <>

                    <h2>La prise est en défaut</h2>
                    <h3>Impossible de fermer ou d'ouvrir <br/> la prise</h3>

                </>
            }

            {
                currentprise .state === 1 && <>

                    <h2>Prise disponible</h2>
                    <h3>Veuillez indiquer le nom du bateau<br/>(ou entreprise) pour lequel la<br/>consommation sera  facturé.</h3>

                   
                        {getAuthorizationFor('MAP', 'update') &&  <form className="facture-name-container" onSubmit={handleInteract} >
                            <input value={userToOpen} onChange={({target}) => setUserToOpen(target.value)} className={"facturation-name "+(inputError? "error" : "")} type={'text'} placeholder={'Nom du bateau...'} />
                            </form>}
                    
                    
                </>
            }

            </div>
           
            {currentprise.state !== 5 && currentprise.state !== 8 && <div onClick={handleInteract} className={"control-button "+((currentprise.state === 1)? "toOpen" : "toClose")}>
                {stateGoal !== currentprise.state? <Lottie animationData={loadingAnimation} className={"btn-loading"} /> : <>

                    {(currentprise.state === 1) && <StartIcon className="icon-btn" />}     
                    {(currentprise.state === 4 || currentprise.state === 3) && <StopIcon/>}    
                    {currentprise.state === 1 && <h3>Ouvrir la prise</h3>}
                    {currentprise.state === 4? (currentprise.use_by?  <h3>Fermer la prise</h3> : <h3>Tenter de fermer</h3> ) : null}
                
                </>}
              
            
            </div>}
        </>}

        

    </div>

}




function PriseItem({priseData, onClick}){


    const navigate = useNavigate();
    const {borne_id} = useParams();


    function handleClick(){

            //onClick(priseData);

            navigate('/supervision/map/'+borne_id+'/'+priseData.name)
        
    }


    return <div onClick={handleClick} className={"prise-access "+("state-"+priseData.state)}>
        <h2>{priseData.name}</h2>
        <h4>{priseData.type} | {priseData.state_label}</h4>

       <ExpandIcon className="go-to-icon" />


    </div>

}

export default BorneController;