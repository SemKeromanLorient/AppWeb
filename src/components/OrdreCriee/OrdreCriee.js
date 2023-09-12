import React, { useEffect, useState } from 'react';
import "./OrdreCriee.css"; 
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

function OrdreCriee(){
    
    const [image, setImage] = useState(null)

    useEffect(() => {
        fetchCriee()
    },[])

    useEffect( () => {
        console.log("Image : " + image);
    },[image])

    function fetchCriee() {
        getToServer('/criee/lastCriee', {}, ({data}) => {
            console.log(data[0])
            setImage(data[0].image)
        })
    }


    
    if (!image){
        return <h1> Ordre de vente criée indisponible </h1>
    }

    return (
        <div>
            <img src={image} alt="Ordre de criée" className="ordre-image" />
        </div>
    )
}

export default OrdreCriee;
