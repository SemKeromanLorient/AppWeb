import "./Loader.style.css"
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lotties/loader.json";
import React from 'react';

function Loader({option, setOption}){

    return <div className="loader-container">

        <Lottie className="loader-animation" animationData={loadingAnimation} loop />

        {option && option.text && <h2>{option.text}</h2>}

    </div>
}

export default Loader;