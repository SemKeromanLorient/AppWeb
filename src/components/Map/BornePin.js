import React, { useEffect, useState } from "react";
import "./MapView.style.css"
import {useMap} from 'react-map-gl';
import ProgressBar from "../ProgressBar/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";

function BornePin({borne,  currentlySelected,  index, onClick}){

    const {current: map} = useMap();
    const [hasError, setHasError] = useState(false);
    const [onForceStop, setOnForceStop] = useState(false);
    const navigate = useNavigate();
    let { borne_id } = useParams();

    useEffect(() => {

        setOnForceStop(borne.state.stop)
        setHasError(borne.state.error)

    }, [borne])

    useEffect(() => {

        if(borne.borne == borne_id){
            map.flyTo({
                center: [borne.longitude, borne.latitude],
                animate: true,
                zoom: 18
            })

            onClick(index)
        }

    }, [borne_id])

    function handleClick(){

        if(borne.enable === 1)navigate('/supervision/map/'+borne.borne)

        //
    }

    return <div onClick={handleClick} className={"pin-container "+(currentlySelected === index? "focus " : "")+ (borne.enable === 0? "hidden " : "")}>

        {borne.enable === 1 && hasError && <div className="blink-led" />}

        <h5>Borne {borne.borne}</h5>

        {borne.enable === 1 && <ProgressBar error={onForceStop} currentProgress={(borne.capacity - borne.available)} range={[0, borne.capacity]} />}

    </div>


}

export default BornePin;