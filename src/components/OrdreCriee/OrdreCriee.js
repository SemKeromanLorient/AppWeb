import React, { useEffect, useState } from 'react';
import "./OrdreCriee.css"; 

function OrdreCriee(){
    
    if (!localStorage.getItem('image2')){
        return <h1> Ordre de vente criée indisponible </h1>
    }
    
    const imageDataUrl = localStorage.getItem('image2');

    return (
        <div>
            <img src={imageDataUrl} alt="Ordre de criée" className="ordre-image" />
        </div>
    )
}

export default OrdreCriee;
