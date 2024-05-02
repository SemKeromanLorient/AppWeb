import React, { useContext, useEffect, useRef, useState } from "react";
import { ProgressBar } from "../../components";
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";

import { removeSocketFlag, socketFlag, socketSend } from "../../utils/serverSocketCom";
import {ReactComponent as ElecticIcon} from '../../assets/icons/energy.svg';
import {ReactComponent as NoElecIcon} from '../../assets/icons/no-power.svg';
import {ReactComponent as StopIcon} from '../../assets/icons/stop (1).svg';
import {ReactComponent as IssueIcon} from '../../assets/icons/error.svg';
import {ReactComponent as ActivateIcon} from '../../assets/icons/electricity.svg';
import {ReactComponent as ListIcon} from '../../assets/icons/list-format.svg';
import {ReactComponent as LockIcon} from '../../assets/icons/lock-icon.svg';
import {ReactComponent as BackIcon} from '../../assets/icons/retour-fleche.svg';


import loadingAnimation from "../../assets/lotties/end-conso.json";
import WaitingAnimation from "../../assets/lotties/loading.json";

import Lottie from "lottie-react";

import './BorneList.style.css';
import { useNavigate, useParams } from "react-router-dom";
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../../components/Popup/Popup";
import { getAuthorizationFor, getConnectedUser } from "../../utils/storageUtil";

function BorneList(){

    const [badges,setBadges] = useState('');
    const [bornes, setBornes] = useState([]);
    const [currentSelection, setCurrentSelection] = useState(null);
    const [quickSearch, setQuickSearch] = useState('');
    const [isActiveMenuOPen ,setActiveMenuOpen] = useState(false);
    const navigate = useNavigate();
    let quickSearchTimeout;
    const {borne_id} = useParams();
    

    useEffect(() => {
        console.log("Borne id : " + borne_id);
        console.log("Bornes.length : " + bornes.length);
        console.log("Bornes : " + JSON.stringify(bornes));
        if(borne_id && bornes.length > 0){

            let selected = bornes.find((value) => value.borne === Number(borne_id) && value.enable == 1);

            if(selected){
                //console.log("Selected : " + JSON.stringify(selected))
                setCurrentSelection(selected)
            }else{
                navigate('/supervision/list')
            }

        }else setCurrentSelection(null)
    }, [borne_id, bornes])

    useEffect(() => {

        document.onkeydown = function(evt) {
            evt = evt || window.event;
           
            if ("key" in evt) {
                
                console.log(evt.key, evt.key === " ")


                if(evt.key === " "){
                    console.log('from: ',isActiveMenuOPen, 'to: ', !isActiveMenuOPen)
                    setActiveMenuOpen(!isActiveMenuOPen);
                }

                if(evt.key === "Escape" || evt.key === "Esc"){
                    setActiveMenuOpen(false);
                }

            } 
          
        };


    },  [currentSelection, isActiveMenuOPen])


    useEffect(() => {
        console.log("TEST DoubleUseEffect")

        fetchBornes()

        socketFlag('bornes', (bornesList) => {
            setBornes(bornesList.filter((borne) => !!borne));
        })

        document.title = 'Supervision | Liste des bornes'
        
        getToServer('/badges/', {}, ({data}) => {
            setBadges(data.badge)

        }, (err) => {

            console.log(err)

        })

        return () => {

            removeSocketFlag('bornes')

        }

    }, [])

    useEffect(() => {
        console.log(quickSearch)
    }, [quickSearch])

    function fetchBornes(){

        postToServer('/bornes/', {}, ({data}) => {

            setBornes(data.filter((borne) => !!borne))

        }, (err) => {

            console.log(err)

        })

    }

    return <div className="borne-list-container">

        {bornes.filter((val) => !!val).map((borne, index) => <BorneItem key={index} borne={borne} setCurrentSelection={setCurrentSelection} />)}

        <div className="active-container">
            <div onClick={() => setActiveMenuOpen(true)} className="active-list-btn">
                <ListIcon />
            </div>
        </div>
                


        {
            currentSelection && <BorneControl borne={currentSelection} />
        }

 
        <ActiveUserList bornes={bornes} isOpen={isActiveMenuOPen} setOpen={setActiveMenuOpen} />
    </div>

}

// {
//     currentSelection && <BorneControlNew borne={currentSelection} badges={badges} />
// }

function BorneItem({borne, setCurrentSelection}){

    
    const navigate = useNavigate();


    function handleOpenBorne(){
        navigate('/supervision/list/'+borne.borne)
        console.log(borne)
    }

    return <div onClick={handleOpenBorne} className={"borne-item-container "+(borne.enable === 0? 'disable' : '')}>



        <h2>Borne {borne.display}</h2>

        <ProgressBar error={borne.state.error || borne.state.stop} currentProgress={(borne.capacity - borne.available)} range={[0, borne.capacity]} />

        <div className="open-btn">
            <h4>Ouvrir</h4>
        </div>

    </div>

}

function BorneControlNew({borne,badges}){

    const navigate = useNavigate();
    const [priseOpen, setPriseOpen] = useState(false);
    const [currentPriseOpen, setCurrentPriseOpen] = useState(null);
    const [badgeFilter, setBadgeFilter] = useState('');
    const {prise_id} = useParams();
    const selectBadge = React.useRef();
    const [selectedBadge,setSelectedBadge] = useState('');

    function handleClose(){

        navigate('/supervision/list')
        setCurrentPriseOpen(null);

    }

    function filterFunction(badge){

        if(badgeFilter !== '' && !badge.username.toUpperCase().includes(badgeFilter.toUpperCase())) return false;

        return true;

    }

    function toPrise(){
        const value = selectBadge.current.value;
        setSelectedBadge(value);
    }

    function sortPrise(prise_a, prise_b){

        if(prise_a.prise > prise_b.prise)return 1;
        if(prise_a.prise < prise_b.prise)return -1;

        return 0

    }

    //Envoie une socket des données à modifier sur la prise
    function send(data){
        data.zone = borne.zone;
        data.borne = borne.borne;
        socketSend('prise_update', data)
    }

    useEffect(() => {

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                
                if(!currentPriseOpen)handleClose()

            }
        };

    }, [currentPriseOpen])

    useEffect(() => {
        console.log(selectedBadge)
    },[selectedBadge])
 //
    return <>
    {borne && <div className="background-dim"/>}
        <div className={"borne-control-container "+(!borne? 'hidden' : '')}>

            {!selectedBadge && (
                <>
                {borne && <>
                    
                    <h2>Borne {borne.display} <LockIcon className="lock-icon-2" /></h2>
                    
                    
                </>}

                <div className="search-section">
                    <input value={badgeFilter} onChange={({target}) => setBadgeFilter(target.value)} className="add-info-conso" placeholder="Username"   style={{ marginTop: '15px', textAlign: 'center' }}/>  
                </div> 
        
                <div className="title-section-badge"  style={{ display: "flex", justifyContent: "center",marginTop: "15px"}}> 
                    <select className="list-section-badges" ref={selectBadge}>
                            {badges.filter(filterFunction).map((badge, index) => (
                                <option key={index} value={badge.username}>
                                {badge.name} - {badge.username}
                                </option>
                            ))}
                    </select>
                </div>
                
                <div className="search-section">
                    <button className="close-btn" onClick={toPrise}> Valider </button>
                </div>
                <div onClick={handleClose} className="close-btn-new">
                    <BackIcon className="back-icon" />
                </div>
                </>
            )}

            {selectedBadge && (
                <>
                    {borne && <>
                
                        <h2>Borne {borne.display}</h2>

                        {borne.prises && borne.prises.sort(sortPrise).map((prise, index) => <PriseRow send={send} setCurrentPriseOpen={setCurrentPriseOpen} prise={prise} key={index} />)}
                    </>}
                    
                    <div onClick={handleClose} className="close-btn">
                        <h3>Fermer</h3>
                    </div>
                    {currentPriseOpen && <div className="background-dim"/>}
                    {currentPriseOpen && <UserSelectionPrise nouveau={true} send={send} setOpen={setCurrentPriseOpen} prise={currentPriseOpen}/>}
                </>
            )}
            
        </div>
    


    </>

}

function BorneControl({borne}){

    const navigate = useNavigate();
    const [priseOpen, setPriseOpen] = useState(false);
    const [currentPriseOpen, setCurrentPriseOpen] = useState(null);
    const {prise_id} = useParams();

    function handleClose(){

        navigate('/supervision/list')
        setCurrentPriseOpen(null);

    }

    useEffect(() => {

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                
                if(!currentPriseOpen)handleClose()

            }
        };

    }, [currentPriseOpen])

    function sortPrise(prise_a, prise_b){

        if(prise_a.prise > prise_b.prise)return 1;
        if(prise_a.prise < prise_b.prise)return -1;

        return 0

    }


    function send(data){
        data.zone = borne.zone;
        data.borne = borne.borne;
        socketSend('prise_update', data)
    }
    
    return <>
    {borne && <div className="background-dim"/>}
    <div className={"borne-control-container "+(!borne? 'hidden' : '')}>

     
        {borne && <>
            
            <h2>Borne {borne.borne}</h2>

            {borne.prises && borne.prises.sort(sortPrise).map((prise, index) => <PriseRow send={send} setCurrentPriseOpen={setCurrentPriseOpen} prise={prise} key={index} />)}
        </>}
        
        <div onClick={handleClose} className="close-btn">
            <h3>Fermer</h3>
        </div>
                
    
        
    </div>
    
    {currentPriseOpen && <div className="background-dim"/>}
    
    {currentPriseOpen && <UserSelectionPrise nouveau={false} send={send} setOpen={setCurrentPriseOpen} prise={currentPriseOpen}/>}

    </>

}

function UserSelectionPrise({nouveau, send, prise, setOpen}){

    const [username, setUsername] = useState('');
    const [inputErr, setInputErr] = useState(false)
    const {setPopupOption} = useContext(PopupContext);


    useEffect(() => {
        console.log("Test : " + username)
    }, [username])

    function handleCancel(){
        setOpen(null);
    }

    useEffect(() => {

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                
                handleCancel()

            }
        };

    }, [])

    function handleValid(){

        if(username.length <= 0){
            if(!inputErr){
                setInputErr(true)
                setTimeout(() => setInputErr(false), 500);
            }
          
        }else{

            setPopupOption({
                type: POPUP_QUESTION,
                text: 'Etes-vous sur de vouloir activer la prise '+prise.prise.name+' pour '+username,
                secondaryText: 'Ne pas oubliez de fermer la prise',
                acceptText: 'Oui, j\'active la prise',
                declineText: 'Non, annuler',
                onAccept: () => {
                    prise.callback()
                    send({
                        prise: prise.prise.prise,
                        state: "ON",
                        user: (getAuthorizationFor('MAP', 'update')? username : getConnectedUser('username')),   
                    })
                    setOpen(null);
                }
            })


        }


    }

    function handleValidNew(){
        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Etes-vous sur de vouloir activer la prise '+prise.prise.name+' pour '+username,
            secondaryText: 'Ne pas oubliez de fermer la prise',
            acceptText: 'Oui, j\'active la prise',
            declineText: 'Non, annuler',
            onAccept: () => { //ICI QUE SE TROUVE LE POINT DE DEBUT DE L ACTIVATION DES BORNES
                prise.callback()
                send({
                    prise: prise.prise.prise,
                    state: "ON",
                    user: (getAuthorizationFor('MAP', 'update')? username : getConnectedUser('username')),   
                })
                setOpen(null);
            }
        })


    }


    return <div className="user-prompt-container">

            {
                !nouveau && <>

                <ActivateIcon />

                <h2>Activation de la prise {prise.name}</h2>
                <h3>Veuillez indiquer le nom du bateau pour lequel la consommation sera facturée.</h3>

                <div className="input-section">
                    <input value={username} onChange={({target}) => setUsername(target.value)} className={"user-input "+(inputErr? 'err' : '')} placeholder="Ex: BATEAU X..." />
                    <div>

                    </div>
                </div>

                <div className=" button-section">

                    <div onClick={handleValid} className="action-btn valid">
                        <h3>Activer</h3>
                    </div>

                    <div onClick={handleCancel} className="action-btn cancel">
                        <h3>Annuler</h3>
                    </div>

                    
                </div>
                </>
            }
                

                {nouveau && <>
                    <ActivateIcon />

                    <h2>Activation de la prise {prise.name}</h2>
                    <h3>Vous pouvez renseigner une information de plus à la consommation.</h3>

                    <div className="input-section">
                        <input value={username} onChange={({target}) => setUsername(target.value)} className={"user-input "+(inputErr? 'err' : '')} placeholder="Ex: BATEAU X..." />
                        <div>

                        </div>
                    </div>

                    <div className=" button-section">

                        <div onClick={handleValidNew} className="action-btn valid">
                            <h3>Activer</h3>
                        </div>

                        <div onClick={handleCancel} className="action-btn cancel">
                            <h3>Annuler</h3>
                        </div>

                        
                    </div>
                </>}

    </div>



}


function PriseRow({send, prise, setCurrentPriseOpen}){

    const {setPopupOption} = useContext(PopupContext);
    const [onLoad, setOnLoad] = useState(false);
    const [optionalText, setOptionalText] = useState('');

    let connectionIssueTimer = useRef(null);

    useEffect(() => {

        let borneData = prise.name.slice(0, 2);
        let priseData = prise.name.slice(-2);

        getToServer('/prises/' + borneData + '/' + priseData , {}, ({data}) => {
            if (data[0].OptionText !== null && data[0].OptionText !== "[object Object]" && data[0].OptionText.length > 0){
                setOptionalText(data[0].OptionText)
            }
        }, (err) => {
            console.log("Erreur lors de la récupération des badges : ",err)

        })
    },[])

    useEffect(() => {
        if(prise.state !== 3)setOnLoad(false);
        console.log(connectionIssueTimer)
        if(connectionIssueTimer.current)clearTimeout(connectionIssueTimer.current)
    }, [prise])

    function handleInteract(){

        if(prise.state === 1){
            setCurrentPriseOpen({prise: prise, callback: () => {
                connectionIssueTimer.current = setTimeout(onTimerOut, 10 * 1000)
                setOnLoad(true);
            }})
        }

        if(prise.state === 4)setPopupOption({
            type: POPUP_QUESTION,
            text: 'Etes-vous sur de vouloir désactiver la prise '+prise.name,
            secondaryText: 'Ceci ajoutera la consommation dans la liste',
            acceptText: 'Oui, je désactive la prise',
            declineText: 'Non, annuler',
            onAccept: () => {

                connectionIssueTimer.current = setTimeout(onTimerOut, 10 * 1000)

                console.log("TEST send" + send)
                setOnLoad(true);
                send({
                    prise: prise.prise,
                    state: "OFF",
                })
                setCurrentPriseOpen(null)
            }
        })

    }

    function onTimerOut(){
        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Acune réponse à la commande ?',
            secondaryText: 'Vous etes peut-etre déconnecté',
            acceptText: 'Recharger la page',
            declineText: 'Non, j\'ai eu une réponse',
            onAccept: () => {
                
                location.reload();

            }
        })
    }


    return <div className="prise-container">

        
        <h2>{prise.prise}</h2>

        <div className="prise-state-container">

            <PriseState Icon={NoElecIcon} currentState={prise.state} targetState={1} info={'Prise libre'} />
            <PriseState lottie={loadingAnimation} currentState={prise.state} targetState={3} info={'Lecture de consommation...'} />
            <PriseState Icon={ElecticIcon} currentState={prise.state} targetState={4} info={optionalText !== '' ? 'Prise alimentée pour ' + optionalText : (prise.use_by ? 'Prise alimentée pour ' + prise.use_by : 'Prise alimentée')} />
            <PriseState Icon={StopIcon} currentState={prise.state} targetState={5} info={'Arret d\'urgence'} />
            <PriseState Icon={IssueIcon} currentState={prise.state} targetState={8} info={'Problème sur la prise'} />

        </div>

        <h2>{prise.type}</h2>

        

    </div>

}

function PriseState({targetState, currentState, info, Icon, lottie}){


    return <><div className={"state-container "+(currentState === targetState? "state-"+currentState : "")}>
        {currentState === targetState && Icon &&  <Icon />}
        {currentState === targetState && lottie && <Lottie className="state-animation" animationData={loadingAnimation} loop />}

        {currentState === targetState && <div className="bubble-info">
            <h5>{info}</h5>
        </div>}

    </div></>


}


function ActiveUserList({bornes, isOpen, setOpen}){

    useEffect(() => {
        console.log(bornes)
    }, [bornes])

    function handleClose(){
        setOpen(false);
    }

    return <>
        {isOpen && <div onClick={handleClose} className="background-dim" />}
        <div className={"active-user-list "+(!isOpen? 'hidden' : '')}>

            <h3>Liste des bateaux actifs</h3>

            <div className="active-user-list-container">
                {bornes && bornes.filter((val) => !!val).map((borne) => borne.prises.filter((prise) => prise.state === 4 && !!prise.use_by).sort((prise_a, prise_b) => prise_a.use_by.localeCompare(prise_b.use_by)).map((prise, index) => <ActiveUserRow borne={borne} key={index} prise={prise}/>))}
            </div>

            <div onClick={handleClose} className="close-section">
                <div className="close-btn">
                    <h4>Fermer</h4>
                </div>
            </div>


        </div>
    </>
}

function ActiveUserRow({send, borne, prise}){

    const {setPopupOption} = useContext(PopupContext);
    const [onLoad, setOnLoad] = useState(false);

    useEffect(() => {
        setOnLoad(false)
    }, [prise])

    function handleClose(){

        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Etes-vous sur de vouloir désactiver la prise '+prise.name,
            secondaryText: 'Ceci ajoutera la consommation dans la liste',
            acceptText: 'Oui, je désactive la prise',
            declineText: 'Non, annuler',
            onAccept: () => {

                setOnLoad(true);
               
                socketSend('prise_update', {
                    zone: borne.zone,
                    borne: borne.borne,
                    prise: prise.prise,
                    state: "OFF"
                })
            }
        })


    }



    return <div className="active-user-container">

        <div className="active-user-title">
            <h4>{prise.use_by} </h4>
            <h4 className="dim">{prise.name}</h4>
        </div>

        <div onClick={handleClose} className="end-btn">
            {onLoad? <Lottie animationData={WaitingAnimation} /> : <h4>Désactiver</h4>}
        </div>


    </div>
}


export default BorneList;