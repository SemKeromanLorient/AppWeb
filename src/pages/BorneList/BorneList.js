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
import {ReactComponent as SearchIcon} from '../../assets/icons/search_icon.svg';
import {ReactComponent as ExpandIcon} from '../../assets/icons/arrow.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';


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
        if(borne_id && bornes.length > 0){

            let selected = bornes.find((value) => value.borne === Number(borne_id) && value.enable == 1);

            if(selected){
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

        fetchBornes()

        socketFlag('bornes', (bornesList) => {
            setBornes(bornesList.filter((borne) => !!borne));
        })

        document.title = 'Supervision | Liste des bornes'
        
        getToServer('/badges/', {}, ({data}) => {
            const sortedBadges = data.badge.sort((a, b) => a.name.localeCompare(b.name));
            setBadges(sortedBadges)

        }, (err) => {

            console.log(err)

        })

        const interval = setInterval(() => {
            fetchBornes();
          }, 15000); // Récupération des données toutes les 15 secondes

        return () => {
            clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
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

    function send(data){

        if(data.state === 'OFF'){
            data.badge=badges[0].number
            data.optionalUser= 'Fermeture'
        }

        socketSend('prise_update', data)
    }

    return <div className="borne-list-container">

        {bornes.filter((val) => !!val).map((borne, index) => <BorneItem key={index} borne={borne} setCurrentSelection={setCurrentSelection} />)}

        <div className="active-container">
            <div onClick={() => setActiveMenuOpen(true)} className="active-list-btn">
                <ListIcon />
            </div>
        </div>
                


        {
            currentSelection && <BorneControl borne={currentSelection} badges={badges} fetchBornes={fetchBornes} send={send}/>
        }

 
        <ActiveUserList bornes={bornes} isOpen={isActiveMenuOPen} setOpen={setActiveMenuOpen} fetchBornes={fetchBornes} send={send}/>
    </div>

}


function BorneItem({borne, setCurrentSelection}){

    const [connected, setConnected] = useState(true);

    useEffect(() => {
        let i = 0;
        while (connected && i < borne.prises.length){
            if (borne.prises[i].state === 2){
                setConnected(false)
            }
            i++;
        }
    },[])
    
    const navigate = useNavigate();


    function handleOpenBorne(){
        navigate('/supervision/list/'+borne.borne)
    }

    return <div onClick={handleOpenBorne} className={"borne-item-container "+(borne.enable === 0? 'disable' : '') + (!connected ? "disconnected" : "")}>



        <h2>Borne {borne.display}</h2>

        <ProgressBar error={borne.state.error || borne.state.stop} currentProgress={(borne.capacity - borne.available)} range={[0, borne.capacity]} Found={connected}/>

        <div className={"open-btn " + (!connected ? "disconnected" : "")}>
            <h4>Ouvrir</h4>
        </div>

    </div>

}

function BorneControl({borne,badges,fetchBornes,send}){

    const navigate = useNavigate();
    const [priseOpen, setPriseOpen] = useState(false);
    const [currentPriseOpen, setCurrentPriseOpen] = useState(null);
    const [currentBadgeOpen, setCurrentBadgeOpen] = useState()
    const [selectNameOpen, setSelectNameOpen] = useState();
    const [connected, setConnected] = useState(true)
    const {prise_id} = useParams();
    const [prise, setPrise] = useState()

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

    useEffect(() => {
        checkConnected()
    },[borne])

    function checkConnected(){
        let i = 0;
        while (connected && i < borne.prises.length){
            if (borne.prises[i].state === 2){
                setConnected(false)
            }
            i++
        }

    }

    function sortPrise(prise_a, prise_b){

        if(prise_a.prise > prise_b.prise)return 1;
        if(prise_a.prise < prise_b.prise)return -1;

        return 0

    }
    
    return <>
    {borne && <div className="background-dim"/>}
    <div className={"borne-control-container "+(!borne? 'hidden' : '')}>

     
        {borne && <>
            
            <h2>Borne {borne.borne}{!connected && ' : Hors connexion'}</h2>

            {borne.prises && borne.prises.sort(sortPrise).map((prise, index) => <PriseRow send={send} setCurrentPriseOpen={setCurrentPriseOpen} setCurrentBadgeOpen={setCurrentBadgeOpen} setSelectNameOpen={setSelectNameOpen} prise={prise} key={index} fetchBornes={fetchBornes} setPrise={setPrise}/>)}
        </>}
        
        <div onClick={handleClose} className="close-btn">
            <h3>Fermer</h3>
        </div>
                
    
        
    </div>
    
    {currentPriseOpen && <div className="background-dim"/>}
    
    {(currentPriseOpen && currentBadgeOpen) && <UserSelectionPrise badges={badges} send={send} setOpen={setCurrentBadgeOpen} setCurrentPriseOpen={setCurrentPriseOpen} prise={currentPriseOpen} fetchBornes={fetchBornes} borne={borne}/>}
    {/* {selectBadgeOpen && <UserSelectionPrise badges={badges} send={send} setOpen={setCurrentPriseOpen} prise={currentPriseOpen} fetchBornes={fetchBornes} borne={borne}/>} */}

    {(currentPriseOpen && selectNameOpen) && <UserSelectionText 
        borne={borne}
        prise={currentPriseOpen}
        send={send}
        setOpen={setSelectNameOpen}
        setCurrentPriseOpen={setCurrentPriseOpen}
        fetchBornes={fetchBornes} 
    />}

    </>

}


function UserSelectionPrise({badges, send, prise, setOpen, setCurrentPriseOpen, fetchBornes, borne}){
    const [currentBadge, setCurrentBadge] = useState('');
    const [defile, setDefile] = useState('');
    const [badgeFilter, setBadgeFilter] = useState('');
    const [username, setUsername] = useState('');
    const [inputErr, setInputErr] = useState(false)
    const {setPopupOption} = useContext(PopupContext);
    const [borneID, setBorneID] = useState('')


    useEffect(() => {
        if(prise){
            setBorneID(prise.prise.name.slice(0, 2));
        }
    },[prise])

    function handleCancel(){
        setCurrentPriseOpen(null)
        setOpen(null);
    }

    function filterFunction(badge){
        if (badge.name) {
            if(badgeFilter !== '' && !badge.name.toUpperCase().includes(badgeFilter.toUpperCase())) return false;
        }
        return true;

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

    const handleSelectClick = () => {
        setDefile(!defile);
    };

    function handleValid(){


            setPopupOption({
                type: POPUP_QUESTION,
                text: 'Ouverture de la prise '+ prise.prise.prise,
                secondaryText: 'La facture sera au nom de ' + (username ? username : (currentBadge.name + " - " +  currentBadge.username)),
                acceptText: 'Oui, j\'active la prise',
                declineText: 'Non, annuler',
                onAccept: () => {
                    prise.callback()
                    send({
                        zone: borne.zone,
                        borne: borne.borne,
                        prise: prise.prise.prise,
                        state: "ON",
                        user: currentBadge.username,
                        badge: currentBadge.number,
                        optionalUser: username ? username : `${currentBadge.name} - ${currentBadge.username}`
                    });
                    setOpen(null);
                    setCurrentPriseOpen(null);
                    setTimeout(() => {
                        fetchBornes();
                        setUsername('');
                    }, 3000);  
                }
            })

    }

    function handleSelectBadge(){
        if (event.target.value !== ''){
            setCurrentBadge(JSON.parse(event.target.value));
        } else {
            setCurrentBadge('')
        }
    }


    return <div className="user-prompt-container">

                <ActivateIcon className='prise-icon' />

                <h2>Activation de la prise</h2>

                <div className="section-badges">
                    {badgeFilter.length <= 0 &&
                        <SearchIcon className="search-icon" style={{ pointerEvents: 'none' }}/>
                    }
                    <input value={badgeFilter} onChange={({target}) => setBadgeFilter(target.value)} className="add-info-conso"/>  
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
                {
                    currentBadge && (
                        <>
                            <h3>Vous pouvez renseigner une information de plus à la consommation.</h3>
                            <div className="input-section">
                                <input value={username} onChange={({target}) => setUsername(target.value)} className={"user-input "+(inputErr? 'err' : '')} placeholder="Ex: BATEAU X..." />
                            </div>
                        </>
                    )
                }

                <div className="button-section">
                    {
                        currentBadge && (
                            <div onClick={handleValid} className="action-btn valid">
                                <h3>Activer</h3>
                            </div>
                        )
                    }
                    <div onClick={handleCancel} className="action-btn cancel">
                        <h3>Annuler</h3>
                    </div>

                    
                </div>

            </div>



}

function UserSelectionText({borne, prise, send, setOpen, fetchBornes, setCurrentPriseOpen}){

    const [username, setUsername] = useState()
    const {setPopupOption} = useContext(PopupContext);

    function handleConfirm(){

        setPopupOption({
            text: 'Etes-vous sur de vouloir changer le consommateur en '+username+ ' ?' ,
            secondaryText: `L'utilisateur de la prise va changer `,
            type: POPUP_QUESTION,
            acceptText: 'Oui, modifier',
            declineText: 'Non, annuler',
            onAccept: () => {

                socketSend('current_prise_update', {
                    borne: borne.borne,
                    prise: prise.prise.prise,
                    optionalUser: username
                })

                fetchBornes();
                setUsername('');

                setOpen(null)
                setCurrentPriseOpen(null)
            }
        })

    }

    function handleCancel(){
        setCurrentPriseOpen(null)
        setOpen(false)
    }

    return <div className="user-prompt-container">

            <ActivateIcon className='prise-icon' />

            <h2>Modification de l'utilisateur</h2>

            <h3>Renseigner le nom du consommateur.</h3>
            <div className="input-section">
                <input value={username} onChange={({target}) => setUsername(target.value)} className={"user-input "} placeholder="Ex: BATEAU X..." />
            </div>
            

            <div className="button-section">

                <div onClick={handleConfirm} className="action-btn valid">
                    <h3>Valider</h3>
                </div>

                <div onClick={handleCancel} className="action-btn cancel">
                    <h3>Fermer</h3>
                </div>

                
            </div>

        </div>

}

function PriseRow({send, prise, setCurrentPriseOpen, setCurrentBadgeOpen, setSelectNameOpen, fetchBornes, setPrise}){

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
        let borneID = prise.name.slice(0, 2);
        let priseID = prise.name.slice(-2);
        updateOptionalText(borneID,priseID)
    }, [prise])

    function updateOptionalText(borne,prise){
        getToServer('/prises/' + borne + '/' + prise , {}, ({data}) => {
            if (data[0].OptionText !== null && data[0].OptionText !== "[object Object]" && data[0].OptionText.length > 0){
                setOptionalText(data[0].OptionText)
            }
        }, (err) => {
            console.log("Erreur lors de la récupération des badges : ",err)

        })
    }

    function handleInteract(){

        if(prise.state === 1){
            setCurrentPriseOpen({prise: prise, callback: () => {
                connectionIssueTimer.current = setTimeout(onTimerOut, 10 * 1000)
                setOnLoad(true);
            }})
            setCurrentBadgeOpen(true)
        }

        if(prise.state === 4){
            setPopupOption({
                text: 'Etes-vous sur de vouloir désactiver la prise '+prise.prise+ ' ?' ,
                secondaryText: 'Ceci mettra fin à la consommation',
                type: POPUP_QUESTION,
                acceptText: 'Oui, fermer la prise',
                declineText: 'Non, annuler',
                onAccept: () => {
    
                    connectionIssueTimer.current = setTimeout(onTimerOut, 10 * 1000)
    
                    setOnLoad(true);
                    send({
                        borne: parseInt(prise.name.slice(0, 2)),
                        prise: prise.prise,
                        state: "OFF",
                    })

                    setTimeout(() => {
                        fetchBornes();
                    }, 5000);

                    setCurrentPriseOpen(null)
                }
            })
        }

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

    function updateLayout(){
        setCurrentPriseOpen({prise: prise, callback: () => {
            connectionIssueTimer.current = setTimeout(onTimerOut, 10 * 1000)
            setOnLoad(true);
        }})        
        setSelectNameOpen(true)
    }

    return <div className="prise-container">

        {prise.state === 4 && (
            <EditIcon onClick={updateLayout} className="edit-icon-list"/>
        )}

        <h2>{prise.prise}</h2>

        <div className="prise-state-container">

            <PriseState Icon={NoElecIcon} currentState={prise.state} targetState={1} info={'Prise libre'} />
            <PriseState Icon={ElecticIcon} currentState={prise.state} targetState={4} info={optionalText !== '' ? 'Prise alimentée pour ' + optionalText : (prise.use_by ? 'Prise alimentée pour ' + prise.use_by : 'Prise alimentée')} />
            <PriseState Icon={StopIcon} currentState={prise.state} targetState={8} info={'Prise en défaut'} />
            {/* <PriseState Icon={IssueIcon} currentState={prise.state} targetState={2} info={'Problème sur la prise'} /> */}

        </div>

        <h2>{prise.type}</h2>


        {
            prise.state !== 2 && (
                <div onClick={handleInteract} className={"interact-btn "+(onLoad ? 'loading' : '') + (prise.state === 8 ? 'default' : '')}>
            
                    {onLoad ? <Lottie className="loading-response" animationData={WaitingAnimation} /> : <>
                        {prise.state === 1 && <h4>Activer</h4>}
                        {prise.state === 4 && <h4>Désactiver</h4>}
                        {prise.state === 8 && <h4>?</h4>}
                    </>}
                </div>
            )
        }
        
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


function ActiveUserList({bornes, isOpen, setOpen, fetchBornes, send}){

    function handleClose(){
        setOpen(false);
    }

    return <>
        {isOpen && <div onClick={handleClose} className="background-dim" />}
        <div className={"active-user-list "+(!isOpen? 'hidden' : '')}>

            <h3>Liste des bateaux actifs</h3>

            <div className="active-user-list-container">
                {bornes && bornes.filter((val) => !!val).map((borne) => borne.prises.filter((prise) => prise.state === 4 && !!prise.use_by).sort((prise_a, prise_b) => prise_a.use_by.localeCompare(prise_b.use_by)).map((prise, index) => <ActiveUserRow borne={borne} key={index} prise={prise} send={send} fetchBornes={fetchBornes}/>))}
            </div>

            <div onClick={handleClose} className="close-section">
                <div className="close-btn">
                    <h4>Fermer</h4>
                </div>
            </div>


        </div>
    </>
}

function ActiveUserRow({send, borne, prise, fetchBornes}){

    const {setPopupOption} = useContext(PopupContext);
    const [onLoad, setOnLoad] = useState(false);
    const [optionText, setOptionText] = useState();

    useEffect(() => {

        getToServer('/prises/' + prise.name.slice(0,2) + '/' + prise.prise , {}, ({data}) => {
            if (data[0].OptionText !== null && data[0].OptionText !== "[object Object]" && data[0].OptionText.length > 0){
                setOptionText(data[0].OptionText)
            }
        }, (err) => {
            console.log("Erreur lors de la récupération des badges : ",err)

        })

    },[borne])

    function handleClose(){

        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Etes-vous sur de vouloir désactiver la prise '+prise.prise + ', de la borne ' + prise.name.slice(0,2),
            secondaryText: 'Ceci ajoutera une nouvelle consommation',
            acceptText: 'Oui, je désactive la prise',
            declineText: 'Non, annuler',
            onAccept: () => {

                setOnLoad(true);
               
                send({
                    borne: parseInt(prise.name.slice(0, 2)),
                    prise: prise.prise,
                    state: "OFF",
                })

                setTimeout(() => {
                    fetchBornes();
                }, 5000);

            }
        })


    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    }

    return <div className="active-user-container">

        <div className="active-user-title">
            <h4>{truncateText(optionText ? optionText: prise.use_by, 19)} </h4>
            <h4 className="dim">{prise.name}</h4>
        </div>

        <div onClick={handleClose} className="end-btn">
            {onLoad? <Lottie animationData={WaitingAnimation} /> : <h4>Désactiver</h4>}
        </div>


    </div>
}


export default BorneList;