import React,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lotties/loading-state.json";
import "./BorneControl.style.css";
import Axios from "axios";

import {ReactComponent as EnergyIcon} from '../../assets/icons/energy.svg';
import {ReactComponent as PowerIcon} from '../../assets/icons/power-off.svg';

import offToOn from "../../assets/lotties/on.json"
import onToOff from "../../assets/lotties/off.json"
import rotatePhoneAnim from "../../assets/lotties/rotate-phone-portrait.json";

import useScreenOrientation from 'react-hook-screen-orientation'

function Bornecontrol(){

    let { borneNumber } = useParams();
    const [hasLoad, setHasLoad] = useState(true);
    const [isRegister, setIsRegister] = useState(false);
    const [currentUser, setCurrentUser] = useState("BATEAU X");
    const [priseCurrentState, setPriseCurrentState] = useState("off");
    const screenOrientation = useScreenOrientation()

    useEffect(() => {

        

    }, [])


    return <div className="borne-control-container">

        <div className="control-container">

            <EnergyIcon className="energy-icon" />

            <h1>prise {borneNumber}.</h1>
            <h3>La facturation sera au nom de {currentUser}</h3>

            <PowerButton currentState={priseCurrentState} onClick={() => {

                setTimeout(() => {
                    setPriseCurrentState(priseCurrentState === "on"? "off" : "on")
                }, 1000)

            }} />


        </div>

        <div className="consomation-container">

            <h1>12.4 KW/H</h1>

        </div>



        {!hasLoad && <Loader state={"LOAD"} text={"Chargement de la prise "+borneNumber+" en cours..."} />}
       
        

    </div>

}

function PowerButton({currentState, onClick}){

    const [onPress, setOnPress] = useState(false);
    const [onLoad, setOnLoad] = useState(false);

    useEffect(() => {

        setOnLoad(false)

    }, [currentState])


    return <div onPointerEnter={() => {
        if(!onLoad){
            setOnPress(true)
        }
    }} onPointerLeave={() => {
        if(!onLoad){
            setOnPress(false)
            setOnLoad(true);
            onClick()
        }
       
        }} className={"power-button"+(onPress? " press " : " ")+currentState+(onLoad? " loading" : "")}>

        <PowerIcon className="power-icon"  />

        { onLoad && <Lottie className="loading-anim-btn" animationData={loadingAnimation} loop />}

    </div>

}

function Loader({text, state}){


    return <div className="loader">

        {state === "LOAD" && <Lottie className="loader-animation" animationData={loadingAnimation} loop />}

        {text !== null && <h2>{text}</h2>}

    </div>


}


export default Bornecontrol;