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
            console.log("TEST FetchBorne in interval")
            fetchBornesUpdate();
          }, 20000); // Récupération des données tout les 5 mins // 300000

        return () => {//quand on quitte la page on retire le flag
            console.log("TEST ClearInterval")
            clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
            removeSocketFlag('bornes');

        }

    }, [])

    
    function fetchBornes(){
        postToServer('/bornes/', {}, ({data}) => {
            setBornes(data.filter((borne) => !!borne))

        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ",err)

        })
    }

    function fetchBornesUpdate() {
        postToServer('/bornes/', {}, ({ data }) => {
            const newBornes = data.filter((borne) => !!borne);

            setBornes((prevBornes) => {
                const updatedBornes = prevBornes.map((borne, index) => {
                    const newBorne = newBornes[index];
                    // Compare les propriétés des bornes pour voir si elles ont changé
                    return JSON.stringify(borne) !== JSON.stringify(newBorne) ? newBorne : borne;
                });
                // Ne met à jour l'état que si une modification a été détectée
                return JSON.stringify(prevBornes) !== JSON.stringify(updatedBornes) ? updatedBornes : prevBornes;
            });
        }, (err) => {
            console.log("Erreur lors de la récupération des bornes : ", err);
        });
    }

    function fetchBadges(){
        getToServer('/badges/', {}, ({data}) => {
            const sortedBadges = data.badge.sort((a, b) => a.name.localeCompare(b.name));
            setBadges(sortedBadges)

        }, (err) => {
            console.log("Erreur lors de la récupération des badges : ",err)

        })
    }

    return <div className="map-container">
        <MapView setCurrentSelected={setCurrentlySelected} bornes={bornes}>

        </MapView>
        {currentlySelected !== null && currentlySelected !== undefined && (
            <BorneController currentlySelected={bornes[currentlySelected]} badges = {badges} setBornes={setBornes}/>
        )}
        
    </div>

}

export default BorneMap;