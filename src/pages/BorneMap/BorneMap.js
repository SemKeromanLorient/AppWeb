import React, { useEffect, useState } from "react";
import { BorneController, BorneControllerNew, MapView } from "../../components";
import "./BorneMap.style.css"
import {ReactComponent as AddIcon} from '../../assets/icons/add-new.svg';
import { removeSocketFlag, socketFlag } from "../../utils/serverSocketCom";
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";
import { json } from "react-router-dom";



function BorneMap(){
   
    const [currentlySelected, setCurrentlySelected] = useState(-1);
    const [bornes, setBornes] = useState([]);
    const [badges, setBadges] = useState([]);

    let reloadCount = 0;

    useEffect(() => {

        console.log("TEST DoubleUseEffect")


        socketFlag('bornes', (bornes) => {
            //Le filter !!borne permet de vérifier que borne n'est pas null, undefined, égale à 0 ou vide
            setBornes(bornes.filter((borne) => !!borne))
        })


        postToServer('/bornes/', {}, ({data}) => {

            setBornes(data.filter((borne) => !!borne))

        }, (err) => {

            console.log(err)

        })
        
        getToServer('/badges/', {}, ({data}) => {
            setBadges(data.badge)

        }, (err) => {

            console.log(err)

        })
         
        document.title = 'Supervision | Carte des bornes'
        


        return () => {//quand on quitte la page on retire le flag

            removeSocketFlag('bornes');

        }

    }, [])


    useEffect(() => {

        console.log("sect:",currentlySelected)
        console.log("TEST CURRENTLYSELECTED BORNEMAP")
        //console.log("bornes : " + JSON.stringify(bornes))

    }, [currentlySelected])
   
    

    return <div className="map-container">
        <MapView setCurrentSelected={setCurrentlySelected} bornes={bornes}>

        </MapView>
        {currentlySelected < 9 ?(
            <BorneController currentlySelected={bornes[currentlySelected]}  />
        ) : (
            <BorneControllerNew currentlySelected={bornes[currentlySelected]} badges = {badges}/>
        )}
        
    </div>

}

export default BorneMap;