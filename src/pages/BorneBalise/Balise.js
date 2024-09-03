import { Marker } from "react-map-gl";
import React, { useEffect, useState } from "react";
import "./BorneBalise.style.css";

function BornePin({borne, bornes,setBornes}){


    function handleDrag(event){

        let borneCopy = [...bornes];

        borneCopy.find((a_borne) => a_borne.name === borne.name && a_borne.zone === borne.zone).position = {
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng
        }

        setBornes(borneCopy);

     
    }

    return <Marker 
        longitude={borne.position.longitude}
        latitude={borne.position.latitude}
        anchor="bottom"
        draggable
        onDrag={handleDrag}
    >

        <div className={"balise-borne"+(borne.enable === 0? ' hidden' : '')}>

            <h2>{borne.name}</h2>

        </div>


    </Marker>

}



function ZonePin({zones, setZones, zone, position}){

    function handleDrag(event){

        let zonesCopy = [...zones];


        zonesCopy.find((val) => val._id === zone._id).position = {
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng
        }
        setZones(zonesCopy);


    }

    return <Marker 
    longitude={position.longitude}
    latitude={position.latitude}
    anchor="bottom"
    draggable
    onDrag={handleDrag}
>

    <div className={"balise-zone"}>

        <h2>{zone.name}</h2>

    </div>


</Marker>

}

export {BornePin, ZonePin};