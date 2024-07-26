import React, { useEffect, useState } from "react";
import { BorneController, MapView } from "../../components";
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


        fetchBornes()
        fetchBadges()
       
         
        document.title = 'Supervision | Carte des bornes'
        
        const interval = setInterval(() => {
            fetchBornes();
          }, 300000); // Récupération des données tout les 5 mins

        return () => {//quand on quitte la page on retire le flag
            clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
            removeSocketFlag('bornes');

        }

    }, [])

    
    function fetchBornes(){
        console.log("FETCHBORNES")
        postToServer('/bornes/', {}, ({data}) => {
            setBornes(data.filter((borne) => !!borne))

        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ",err)

        })
    }

    function fetchBadges(){
        getToServer('/badges/', {}, ({data}) => {
            const sortedBadges = data.badge.sort((a, b) => a.name.localeCompare(b.name));
            setBadges(sortedBadges)

        }, (err) => {
            console.log("Erreur lors de la récupération des badges : ",err)

        })
    }
    
    /**
     * Timer de refresh des infos bornes
    */
    // setTimeout(() => {
    //     console.log("TEST REFRESH PAGE BORNEMAP")
    //     fetchBornes();
    // }, 15000);
    

    return <div className="map-container">
        <MapView setCurrentSelected={setCurrentlySelected} bornes={bornes}>

        </MapView>
        {currentlySelected !== null && currentlySelected !== undefined && (
            <BorneController currentlySelected={bornes[currentlySelected]} badges = {badges} setBornes={setBornes}/>
        )}
        
    </div>

}

// {
//     currentlySelected !== undefined && (
//         <BorneController currentlySelected={bornes[currentlySelected]}  />
//     )
// }
export default BorneMap;