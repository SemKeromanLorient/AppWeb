import React, { useEffect, useState } from "react";
import { BorneController, BorneControllerNew, MapView } from "../../components";
import "./BorneMap.style.css"
import {ReactComponent as AddIcon} from '../../assets/icons/add-new.svg';
import { removeSocketFlag, socketFlag } from "../../utils/serverSocketCom";
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";
import { json } from "react-router-dom";



function BorneMap(){
   
    const [currentlySelected, setCurrentlySelected] = useState(null);    
    const [bornes, setBornes] = useState([]);
    const [badges, setBadges] = useState([]);

    let reloadCount = 0;

    useEffect(() => {
        socketFlag('bornes', (bornes) => {
            //Le filter !!borne permet de vérifier que borne n'est pas null, undefined, égale à 0 ou vide
            if(bornes.filter((borne)=> !!borne)){
                console.error("Error, borne null/undefined/empty ou égale à 0")
            }
            setBornes(bornes.filter((borne) => !!borne))
        })


        postToServer('/bornes/', {}, ({data}) => {
            console.log("GET BORNES DONE")
            setBornes(data.filter((borne) => !!borne))

        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ",err)

        })
        
        getToServer('/badges/', {}, ({data}) => {
            console.log("Badges (1) : " + JSON.stringify(data.badge))
            const sortedBadges = data.badge.sort((a, b) => a.name.localeCompare(b.name));
            setBadges(sortedBadges)

        }, (err) => {
            console.log("Erreur lors de la récupération des badges : ",err)

        })
         
        document.title = 'Supervision | Carte des bornes'
        


        return () => {//quand on quitte la page on retire le flag

            removeSocketFlag('bornes');

        }

    }, [])


    useEffect(() => {
        console.log("Info borne : " + JSON.stringify(bornes))
    }, [bornes])
   
    

    return <div className="map-container">
        <MapView setCurrentSelected={setCurrentlySelected} bornes={bornes}>

        </MapView>
        {currentlySelected !== null && currentlySelected !== undefined && (
            <BorneControllerNew currentlySelected={bornes[currentlySelected]} badges = {badges} setBornes={setBornes}/>
        )}
        
    </div>

}

// {
//     currentlySelected !== undefined && (
//         <BorneController currentlySelected={bornes[currentlySelected]}  />
//     )
// }
export default BorneMap;