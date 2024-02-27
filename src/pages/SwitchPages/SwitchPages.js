import React, { useState, useEffect } from 'react';
import { Meteo,Info,Maree,OrdreCriee } from "../../components";
import {currentDayMeteo, getDataMeteoDays,getDataMeteoMarine, getDataWind} from "../../utils/apiExtern";
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

//import './SwitchPages.css';

const PageSwitcher = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataMeteo, setDataMeteo] = useState();
  const [dataMeteoMarine, setDataMeteoMarine] = useState();
  const [dataWind, setDataWind] = useState();

  //Fetch SwitchPage data
  const [delai, setDelai] = useState(5000);
  const [PageInfoBoolean, setPageInfoBoolean] = useState(true)
  const [PageMareeBoolean, setPageMareeBoolean] = useState(true)
  const [PageMeteoCotiereBoolean, setPageMeteoCotiereBoolean] = useState(true)
  const [PageTirageCrieeBoolean, setPageTirageCrieeBoolean] = useState(true)

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

  function fetchDelaiPage(){
    getToServer('/switchPage', {}, ({data}) => {
      console.log("DATA DELAI PAGE : " + JSON.stringify(data[0].Page_Info))
      setDelai((data[0].delai)* 1000)
      const state1 = (data[0].Page_Info === 1) ? true : false;
      setPageInfoBoolean(state1);
      const state2 = (data[0].Page_Maree === 1) ? true : false;
      setPageMareeBoolean(state2);
      const state3 = (data[0].Page_MeteoCotiere === 1) ? true : false;
      setPageMeteoCotiereBoolean(state3);
      const state4 = (data[0].Page_TirageCriee === 1) ? true : false;
      setPageTirageCrieeBoolean(state4);
    })
  }

  useEffect(() => {
    console.log("TEST IN SWITCHPAGE")
    fetchDelaiPage()
    console.log("PageInfoBoolean : " + PageInfoBoolean)

  },[])

  useEffect(() => {
    if (currentPage === 1){
      if (!PageInfoBoolean){
        setCurrentPage(2)
      }
    } else if (currentPage === 2){
      if (!PageMareeBoolean){
        setCurrentPage(3)
      }
    } else if (currentPage === 3){
      if (!PageMeteoCotiereBoolean){
        setCurrentPage(4)
      }
    } else{
      if (!PageTirageCrieeBoolean){
        setCurrentPage(1)
      }
    }
  },[currentPage])

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
    }, Math.max(delai, 5000));

    return () => {
      clearInterval(interval);
    };
  }, [currentPage]);

  return ( <>
      {PageInfoBoolean && currentPage === 1 && <Info/>}
      {PageMareeBoolean && currentPage === 2 && <Maree/>   }
      {PageMeteoCotiereBoolean && currentPage === 3 && <Meteo data={dataMeteo} dataMarine={dataMeteoMarine} dataWind={dataWind} />}
      {PageTirageCrieeBoolean && currentPage === 4 && <OrdreCriee/>}
      </>);
};

export default PageSwitcher;
