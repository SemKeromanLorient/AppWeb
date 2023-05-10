import React, { useEffect, useState } from "react";
import { BorneController, MapView } from "../../components";
import "./BorneMap.style.css"
import {ReactComponent as AddIcon} from '../../assets/icons/add-new.svg';
import { removeSocketFlag, socketFlag } from "../../utils/serverSocketCom";
import { postToServer } from "../../utils/serverHttpCom";



function BorneMap(){
   
    const [currentlySelected, setCurrentlySelected] = useState(-1);
    const [bornes, setBornes] = useState([]);

    let reloadCount = 0;

    useEffect(() => {

        socketFlag('bornes', (bornes) => {
            setBornes(bornes.filter((borne) => !!borne))
        })


        postToServer('/bornes/', {}, ({data}) => {

            setBornes(data.filter((borne) => !!borne))

        }, (err) => {

            console.log(err)

        })

        
        document.title = 'Supervision | Carte des bornes'
        


        return () => {//quand on quite la page on retire le flag

            removeSocketFlag('bornes');

        }

    }, [])


    useEffect(() => {

        console.log("sect:",currentlySelected)

    }, [currentlySelected])
   
    

    return <div className="map-container">
        <MapView setCurrentSelected={setCurrentlySelected} bornes={bornes}>

        </MapView>
        <BorneController currentlySelected={bornes[currentlySelected]}  />
    </div>

}

export default BorneMap;