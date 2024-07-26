import React, { useState, useEffect, useRef } from 'react';
import { DefilateInfo, MétéoARN, Planning } from "../../components";
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

const PageSwitcherARN = () => {
  const [currentPage, setCurrentPage] = useState(1);

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
  }, []);

  useEffect(() => {
    console.log("Current page : " + currentPage);
  }, [currentPage]);

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
    switch (currentPage) {
      case 1:
        console.log("1 : " + delaiDefilateInfo);
        return Math.max(delaiDefilateInfo, 5000);
      case 2:
        console.log("2 : " + delaiMeteo);
        return Math.max(delaiMeteo, 5000);
      case 3:
        console.log("3 : " + delaiPlanning);
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

  return (
    <>
      {(PageInfoBoolean || PageEnvironnementBoolean) && currentPage === 1 && <DefilateInfo />}
      {PageMeteoBoolean && currentPage === 2 && <MétéoARN />}
      {PagePlanningBoolean && currentPage === 3 && <Planning />}
    </>
  );
};

export default PageSwitcherARN;
