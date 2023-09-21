import React, { useState, useEffect } from 'react';
import { Meteo,Info,Maree,OrdreCriee } from "../../components";
import {currentDayMeteo, getDataMeteoDays,getDataMeteoMarine, getDataWind} from "../../utils/apiExtern";
//import './SwitchPages.css';

const PageSwitcher = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataMeteo, setDataMeteo] = useState();
  const [dataMeteoMarine, setDataMeteoMarine] = useState();
  const [dataWind, setDataWind] = useState();

  var date = new Date(); // Obtient la date et l'heure actuelles
  var annee = date.getFullYear(); // Obtient l'année actuelle
  var mois = ('0' + (date.getMonth() + 1)).slice(-2); // Obtient le mois actuel et ajoute un zéro devant s'il est inférieur à 10
  var jour = ('0' + date.getDate()).slice(-2); // Obtient le jour actuel et ajoute un zéro devant s'il est inférieur à 10

  var dateCourante = annee + '-' + mois + '-' + jour; 

  var dateFin = new Date(); // Obtient la date et l'heure actuelles
  dateFin.setDate(dateFin.getDate() + 5); // Ajoute 5 jours à la date actuelle

  var anneeFin = dateFin.getFullYear(); // Obtient l'année
  var moisFin = ('0' + (dateFin.getMonth() + 1)).slice(-2); // Obtient le mois (ajoute 1 car les mois sont indexés à partir de 0) et ajoute un zéro devant s'il est inférieur à 10
  var jourFin = ('0' + dateFin.getDate()).slice(-2); // Obtient le jour et ajoute un zéro devant s'il est inférieur à 10

  var dateDeFin = anneeFin + '-' + moisFin + '-' + jourFin;


  useEffect(() => {
    getDataMeteoMarine(dateCourante,dateDeFin, response => {
      setDataMeteoMarine(response)
    }, () => {
      console.log("Erreur lors du fetch de l'API")
    })
    getDataMeteoDays(6, response => {
      setDataMeteo(response)
    }, () => {
      console.log("Erreur lors du fetch de l'API")
    })
    getDataWind(response => {
      setDataWind(response)
    }, () => {
      console.log("Erreur lors du fetch de l'API")
    })
    const interval = setInterval(() => {
      setCurrentPage(currentPage => {
        if (currentPage === 4){
          return 1;
        } else{
          return currentPage + 1;
        }
      });
      console.log("CurrentPage : " + currentPage)
    }, 9000000);

    return () => {
      clearInterval(interval);
    };
  }, [currentPage]);

  return ( <>
      {currentPage === 2 && <Maree/>   }
      {currentPage === 3 && <Meteo data={dataMeteo} dataMarine={dataMeteoMarine} dataWind={dataWind} />}
      {currentPage === 4 && <Info/>}
      {currentPage === 1 && <OrdreCriee/>}
      </>);
};

export default PageSwitcher;
