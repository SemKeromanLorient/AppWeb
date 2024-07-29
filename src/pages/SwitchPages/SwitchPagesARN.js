import React, { useState, useEffect, useRef } from 'react';
import { DefilateInfo, MétéoARN, Planning } from "../../components";
import {getDataMeteoDays,getDataMeteoMarine, getDataWind} from "../../utils/apiExtern";
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

const PageSwitcherARN = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataMeteo, setDataMeteo] = useState();
  const [dataMeteoMarine, setDataMeteoMarine] = useState();
  const [dataWind, setDataWind] = useState();

  const [delaiDefilateInfo, setDelaiDefilateInfo] = useState(5000);
  const [delaiMeteo, setDelaiMeteo] = useState(5000);
  const [delaiPlanning, setDelaiPlanning] = useState(5000);

  const [PageInfoBoolean, setPageInfoBoolean] = useState(true);
  const [PageEnvironnementBoolean, setPageEnvironnementBoolean] = useState(true);
  const [PageMeteoBoolean, setPageMeteoBoolean] = useState(true);
  const [PagePlanningBoolean, setPagePlanningBoolean] = useState(true);

  const [fetchDone, setFetchDone] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchDelaiPage();
    fetchDataApi();
  }, []);

  useEffect(() => {
    if (currentPage === 1 && (!PageInfoBoolean && !PageEnvironnementBoolean)) {
      setCurrentPage(2);
    } else if (currentPage === 2 && !PageMeteoBoolean) {
      setCurrentPage(3);
    } else if (currentPage === 3 && !PagePlanningBoolean) {
      setCurrentPage(1);
    }
  }, [currentPage, PageInfoBoolean, PageEnvironnementBoolean, PageMeteoBoolean, PagePlanningBoolean]);

  const getDelaiForCurrentPage = () => {
    fetchDataApi()
    switch (currentPage) {
      case 1:
        return Math.max(delaiDefilateInfo, 5000);
      case 2:
        return Math.max(delaiMeteo, 5000);
      case 3:
        return Math.max(delaiPlanning, 5000);
      default:
        return 5000;
    }
  };

  const startBoucle = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const delay = getDelaiForCurrentPage();
    timeoutRef.current = setTimeout(() => {
      setCurrentPage((prevPage) => (prevPage === 3 ? 1 : prevPage + 1));
    }, delay);
  };

  useEffect(() => {
    if (fetchDone) {
      startBoucle();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchDone, currentPage, delaiDefilateInfo, delaiMeteo, delaiPlanning]);
  
  function fetchDelaiPage() {
    getToServer('/switchPageARN', {}, ({ data }) => {
      setPageInfoBoolean(data[0].Page_Info === 1);
      setPageEnvironnementBoolean(data[0].Page_Environnement === 1);
      setPageMeteoBoolean(data[0].Page_Météo === 1);
      setPagePlanningBoolean(data[0].Page_Planning === 1);

      setDelaiDefilateInfo(data[0].Délai_Page_DefilateInfo * 1000);
      setDelaiMeteo(data[0].Délai_Page_Météo * 1000);
      setDelaiPlanning(data[0].Délai_Page_Planning * 1000);

      setFetchDone(true);
    });
  }

  function fetchDataApi(){
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
  }

  return (
    <>
      {(PageInfoBoolean || PageEnvironnementBoolean) && currentPage === 1 && <DefilateInfo />}
      {PageMeteoBoolean && currentPage === 2 && <MétéoARN data={dataMeteo} dataMarine={dataMeteoMarine} dataWind={dataWind}/>}
      {PagePlanningBoolean && currentPage === 3 && <Planning />}
    </>
  );
};

export default PageSwitcherARN;
