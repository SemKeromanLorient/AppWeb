import "./Consommation.style.css"
import React, { useEffect, useState } from "react";
import { postToServer } from "../../utils/serverHttpCom.js";
import { SortableTable } from "../../components";
import moment from 'moment';
import { UserContext } from "../../contexts";
import {distance}from 'fastest-levenshtein'
import clipboardy from 'clipboardy';
import CsvDownloadButton from 'react-json-to-csv'
//import ExcelJS from 'exceljs';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Source } from "react-map-gl";

function Consommation({}){

    const [consommations, setConsommations] = useState([]);
    const [graphStat, setGraphStat] = useState([]);
    const [statData, setStatData] = useState(null);
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [displayNull, setDisplayNull] = useState(false);
    const [boatFilter, setBoatFilter] = useState('');
    const [borneFilter, setBorneFilter] = useState('');
    const [priseFilter, setPriseFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState(0);
    const [typeFilter, setTypeFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [compareValue, setCompareValue] = useState('');
    const [zoneFilter, setZoneFilter] = useState('ALL');

    const [val,setVal] = useState('');

    useEffect(() => {
        document.title = 'Supervision | Consommations'
        console.log("Consommation : " + consommations)
    }, [])

    useEffect(() => {

        fetchConsommation();

    }, [startDate, endDate])

    useEffect(() => {
        console.log("Changement de mois : " + monthFilter)
        const monthNumber = parseInt(monthFilter, 10);
        const today = moment();  
        console.log("Today (mois) : " + today.month())      
        console.log("Today (année) : " + today.year())
        
        switch (monthNumber) {
            case 0:
                break;
            case 1:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 2:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 3:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 4:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 5:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 6:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 7:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 8:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 9:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 10:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 11:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            case 12:
                if ( (today.month() < monthNumber - 1)  || ( ((today.month() === monthNumber - 1) && (today.date() !== moment(today).endOf('month').date())) ) ) {
                    const lastYear = today.year() - 1;
                    const startDate = moment([lastYear, monthNumber - 1, 1]).startOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([lastYear, monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else if ( (today.month() > monthNumber - 1) || ( (today.month() === monthNumber - 1) && (today.date() === moment(today).endOf('month').date()) ) ) {
                    const startDate = moment([today.year(), monthNumber - 1, 1]).subtract(1, 'day').format('YYYY-MM-DD');
                    const endDate = moment([today.year(), monthNumber - 1]).endOf('month').subtract(1, 'day').format('YYYY-MM-DD');
                    setStartDate(startDate);
                    setEndDate(endDate);
                } else {

                    console.log("Problème cas inattendu")
                }
                break;
            default:
                console.log("monthNumber : " + monthNumber)
                console.log("Month is not beetwen 0 and 12");
                break;
        }
    },[monthFilter])

    function fetchConsommation(){    

        console.log('Get consommation from '+startDate+' to '+endDate+'... (/supervision/src/pages/Consommation/Consommation.js)')

        console.log({from: startDate, to: endDate})

        postToServer('/consommations', {from: startDate+' 00:00', to: endDate+' 23:59'}, ({data}) => {

            console.log(data)
            //console.log("Start date : " + data.consommation.start_date)

            setConsommations(data.consommation)
        })

        console.log("Test fin fetchConso")

        

    }


    function handleStartDateChange(event){
        console.log(event.target.value)
        setStartDate(event.target.value)
    }

    function handleEndDateChange(event){
        setEndDate(event.target.value)
    }

    function filterFunction(conso){


        if(!displayNull && conso.kw === 0)return false;
        
        if(boatFilter !== '' && !conso.user.toUpperCase().includes(boatFilter.toUpperCase()))return false;
        
        if(zoneFilter !== 'ALL' && conso.zone !== zoneFilter)return false;

        if(compareValue !== '' && distance(compareValue.toUpperCase(), conso.user.toUpperCase()) >= compareValue.length / 2)return false;

        if(sourceFilter != '' && !conso.source.includes(sourceFilter))return false;

        if(borneFilter != ''){
            //let borne = Number(borneFilter)

            if(borneFilter !== conso.borne)return false;
            

        }

        if (priseFilter != ''){
            if (priseFilter !== conso.prise) return false;
            
        }


      

        return true;

    }


    /**
     * Filtre les données pour n'avoir que les données d'eau en enlevant l'arn
     * @param {*} conso ligne de consommations qui doit etre ou non validé par le filtre
     * @returns true si la conso est eau et pas arn
     */
    function filterDataEau(conso){
        console.log("TEST FILTERDATAEAU")
        console.log("Conso.source : " + conso.source);
        if (conso.source === "Eau" && conso.zone != "ARN") return true;
        else return false;
    }

    function filterDataArn(conso){
        if (conso.zone != "ARN") return true;
        else return false;
    }

    /**
     * Filtre les données pour n'avoir que les données d'électricité en enlevant l'arn
     * @param {*} conso 
     * @returns true si la conso est elec et pas arn
     */
    function filterDataElectricite(conso){
        if (conso.source === "Eau" || conso.zone === "ARN") return false;
        else return true
    }


    function handleBornePriseSearch({target}){

        if(target.value.length <= 4){

            try{
                
                let num = Number(target.value)
                if(num >= 0){
                    setBorneFilter(target.value)
                }

            }catch(e){}


        }

    }

    function handleChangeZoneFilter({nativeEvent}){
        setZoneFilter(nativeEvent.target.value)
    }

    function handleMonthFilterChange({nativeEvent}){
        console.log("Mois : " + nativeEvent.target.value)
        setMonthFilter(nativeEvent.target.value)
    }

    /**
     * Fonction permettant d'obtenir le cumul d'un type de consommation, Attention si les données ne sont pas trié alors ajoute l'eau et l'elec ensemble
     * @param {*} data Donnée à observer pour obtenir le cumul des consommations
     * @param {*} type Type de consommation a trié et a récap
     * @param {*} callback 
     */
    function cumulConsoBateau(data,type){

        console.log("Fonction cumulConsoBateau");

        let dataCumul = [
            {
            user: "",
            conso: 0,
            typeConso: type,
            
        } ];

        let hasToAdd = true;

        // Parcours le tableau des cumuls pour ajouter si le bateau n'est pas présent dans ce nouveau tableau
        for (const row of data){
            //On vérifie que le bateau n'existe pas déja
            for (const rowCumul of dataCumul){
                if (rowCumul.user === row.user){
                    hasToAdd = false;
                }
            }
            //Si il n'existe pas alors on le créer
            if (hasToAdd){
                const newData = {
                    user: row.user,
                    conso: 0,
                    typeConso: type
                };
                dataCumul.push(newData)
            }
            hasToAdd = true;
        }

        console.log("1 ere étape réussi");
        // Parcours le tableau cumul et ajoute les conso a la ligne conso du bateau

        for (let i = 0; i < data.length; i++){
            for (let j = 0; j < dataCumul.length; j++){
                if (data[i].user === dataCumul[j].user){
                    dataCumul[j].conso += data[i].kw
                }
            }
        }

        console.log("Data du nouveau tableau cumul : " + JSON.stringify(dataCumul));
        return dataCumul
        
    }
    
    /**
     * Fonction permettant de trier les conso par borne afin d'en faire un cumul
     */
    function cumulConsoBorne(data){

        console.log("Fonction cumulConsoBorne");

        let dataCumul = [
            {
            borne: 0,
            prise: 0,
            conso: 0,
            typeConso: "",
            
        } ];

        let hasToAdd = true;

        // Parcourir les données afin de créer les lignes pour chaque borne
        for (const row of data){
            //On vérifie que le bateau n'existe pas déja
            for (const rowCumul of dataCumul){
                if ((rowCumul.borne === row.borne) && (rowCumul.prise === row.prise)){
                    hasToAdd = false;
                }
            }
            //Si il n'existe pas alors on le créer
            if (hasToAdd){
                const newData = {
                    borne: row.borne,
                    prise: row.prise,
                    conso: 0,
                    typeConso: row.source
                };
                dataCumul.push(newData)
            }
            hasToAdd = true;
        }

        // Parcours le tableau cumul et ajoute les conso a la ligne conso de la borne

        for (let i = 0; i < data.length; i++){
            for (let j = 0; j < dataCumul.length; j++){
                if ((data[i].borne === dataCumul[j].borne) && (data[i].prise === dataCumul[j].prise)){
                    dataCumul[j].conso += data[i].kw
                }
            }
        }

        return dataCumul
        
    }

    function handleCellClick(newValue, row, headerValue) {
        // row[headerValue.column] = newValue;
        console.log("TEST handleCellClick 1 : " + newValue)
        console.log("TEST handleCellClick 2 : " + JSON.stringify(row))
        console.log("TEST handleCellClick 3 : " + JSON.stringify(headerValue))

    }

    /**
     * Génere un fichier excel séparé en différentes parties un worksheet avec les détails des conso d'electricité, un autre avec les conso d'eau et un dernier avec des récaps de données
     */
    function generateExcel() {
        const wb = new ExcelJS.Workbook();
        // Données facturation pour les différentes pages
        const data1 = consommations.filter(filterDataEau);
        const data2 = consommations.filter(filterDataElectricite);
        const data3 = consommations.filter(filterDataArn); // On enleve l'arn de ces données

        const dataEau = Object.values(data1);
        const dataElec = Object.values(data2);
        const dataNoArn = Object.values(data3);

        // définir la largeur souhaitée de la première colonne (numéro 1)
        const columnWidth = 40;
        
        // Page Conso EAU Port de Peche
        const ws1 = wb.addWorksheet('Conso EAU Port de Peche');
        const headerEau = ['Activé par', 'A facturer a', 'Source', 'm3', "Date d'ouverture", "Date de fermeture", "Zone","Borne", "Prise"]
        const headerRow = ws1.addRow(headerEau);
        headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A6A6A6' } // gris
        };
        });

        ws1.getColumn('A').width = columnWidth;
        ws1.getColumn('B').width = columnWidth;
        ws1.getColumn('C').width = columnWidth;
        ws1.getColumn('D').width = columnWidth;
        ws1.getColumn('E').width = columnWidth;
        ws1.getColumn('F').width = columnWidth;
        ws1.getColumn('G').width = columnWidth;
        ws1.getColumn('H').width = columnWidth;
        ws1.getColumn('I').width = columnWidth;

        ws1.autoFilter = {
            from: 'A1',
            to: 'I1',
        }
        
        // Insérer les données de chaque ligne de dataEau
        for (const row of dataEau) {
            if (row.kw > 0){
                const dateFormat = date => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const hour = date.getHours().toString().padStart(2, '0') - 2;
                    const minute = date.getMinutes().toString().padStart(2, '0');
                    const second = date.getSeconds().toString().padStart(2, '0');
                    //Decaler de 2h, pas trouver la raison               
                    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
                  }
                const rowData = [
                    row.open_by,
                    row.user,
                    'EAU',
                    row.kw,
                    dateFormat(new Date(row.start_date)),
                    dateFormat(new Date (row.end_date)),
                    row.zone,
                    row.borne,
                    row.prise
                    ];
                    ws1.addRow(rowData);
                    const lastRow = ws1.lastRow;
                    lastRow.getCell(5).style.number_format = 'dd/mm/yyyy hh:mm:ss';
                    lastRow.getCell(6).style.number_format = 'dd/mm/yyyy hh:mm:ss';
            }
            
        }

        ws1.columns.forEach((column) => {
            // Centrer les données dans chaque cellule
            column.eachCell((cell) => {
            cell.alignment = { horizontal: 'center' };
            });
        });

    
      
        // Feuille Conso ELEC Port de Peche
        const ws2 = wb.addWorksheet('Conso ELEC Port de Peche');
        const headerElec = ['Activé par', 'A facturer a', 'Source', 'KW/h', "Date d'ouverture", "Date de fermeture", "Zone","Borne", "Prise"]
        const headerRow2 = ws2.addRow(headerElec);
        headerRow2.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A6A6A6' } // gris
        };
        });
        ws2.autoFilter = {
            from: 'A1',
            to: 'I1',
        }
        ws2.getColumn('A').width = columnWidth;
        ws2.getColumn('B').width = columnWidth;
        ws2.getColumn('C').width = columnWidth;
        ws2.getColumn('D').width = columnWidth;
        ws2.getColumn('E').width = columnWidth;
        ws2.getColumn('F').width = columnWidth;
        ws2.getColumn('G').width = columnWidth;
        ws2.getColumn('H').width = columnWidth;
        ws2.getColumn('I').width = columnWidth;

        for (const row of dataElec) {
            if (row.kw > 0){
                const dateFormat = date => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const hour = date.getHours().toString().padStart(2, '0');
                    const minute = date.getMinutes().toString().padStart(2, '0');
                    const second = date.getSeconds().toString().padStart(2, '0');
                    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
                  }
                const rowData = [
                    row.open_by,
                    row.user,
                    row.source,
                    row.kw,
                    dateFormat(new Date(row.start_date)),
                    dateFormat(new Date(row.end_date)),
                    row.zone,
                    row.borne,
                    row.prise
                    ];
                    ws2.addRow(rowData);
            }
            
        }

        ws2.columns.forEach((column) => {
            // Centrer les données dans chaque cellule
            column.eachCell((cell) => {
            cell.alignment = { horizontal: 'center' };
            });
        });

        ws2.autoFilter = {
            from: 'A1',
            to: 'I1',
        }

        // Feuille Récap
        const ws3 = wb.addWorksheet('Récap');
        const headerRecap = ['Facturer a','Cumul','Type-Conso']
        const headerRow3 = ws3.addRow(headerRecap);
        headerRow3.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A6A6A6' } // gris
        };
        });
        
        let dataCumulEau = cumulConsoBateau(dataEau,"EAU")
        let dataCumulElec = cumulConsoBateau(dataElec,"ELECTRICITE")

        
        for (const row of dataCumulEau){
            if (row.conso > 0 && !row.user.includes("SEM")){
                const rowData = [
                    row.user,
                    row.conso,
                    row.typeConso
                ];
                ws3.addRow(rowData);
            }
        }

        for (const row of dataCumulElec){
            if (row.conso > 0 && !row.user.includes("SEM")) {
                const rowData = [
                    row.user,
                    row.conso,
                    row.typeConso
                ];
                ws3.addRow(rowData);
            }
        }
        
        ws3.columns.forEach((column) => {
            // Centrer les données dans chaque cellule
            column.eachCell((cell) => {
            cell.alignment = { horizontal: 'center' };
            });
        });

        ws3.getColumn('A').width = columnWidth;
        ws3.getColumn('B').width = columnWidth;
        ws3.getColumn('C').width = columnWidth;

        
        // Feuille maitre de port
        const ws4 = wb.addWorksheet('Maitre de port');
        const headerMaitrePort = ['Badge/utilisation par','Type-Conso','Quantité', "Date d'ouverture", 'Date de fermeture','Zone', 'Borne', 'Prise']
        const headerRow4 = ws4.addRow(headerMaitrePort);
        headerRow4.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'A6A6A6' } // gris
            };
        });

        ws4.getColumn('A').width = columnWidth;
        ws4.getColumn('B').width = columnWidth;
        ws4.getColumn('C').width = columnWidth;
        ws4.getColumn('D').width = columnWidth;
        ws4.getColumn('E').width = columnWidth;
        ws4.getColumn('F').width = columnWidth;
        ws4.getColumn('G').width = columnWidth;
        ws4.getColumn('H').width = columnWidth;


        for (const row of dataEau) {
            if (row.kw > 0 && row.user.includes("SEM")){
                const dateFormat = date => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const hour = date.getHours().toString().padStart(2, '0');
                    const minute = date.getMinutes().toString().padStart(2, '0');
                    const second = date.getSeconds().toString().padStart(2, '0');
                    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
                  }
                const rowData = [
                    row.user,
                    "EAU",
                    row.kw,
                    dateFormat(new Date(row.start_date)),
                    dateFormat(new Date(row.end_date)),
                    row.zone,
                    row.borne,
                    row.prise
                    ];
                    ws4.addRow(rowData);
            }
            
        }

        for (const row of dataElec) {
            if (row.kw > 0 && row.user.includes("SEM")){
                const dateFormat = date => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const hour = date.getHours().toString().padStart(2, '0');
                    const minute = date.getMinutes().toString().padStart(2, '0');
                    const second = date.getSeconds().toString().padStart(2, '0');
                    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
                  }
                const rowData = [
                    row.user,
                    "ELECTRICITE",
                    row.kw,
                    dateFormat(new Date(row.start_date)),
                    dateFormat(new Date(row.end_date)),
                    row.zone,
                    row.borne,
                    row.prise
                    ];
                    ws4.addRow(rowData);
            }
            
        }

        ws4.columns.forEach((column) => {
            // Centrer les données dans chaque cellule
            column.eachCell((cell) => {
            cell.alignment = { horizontal: 'center' };
            });
        });

        // Feuille RecapBorne
        const ws5 = wb.addWorksheet('Récap-Borne');
        const headerRecapBorne = ['Borne','Prise', 'Consommation','Type de prise'];
        const headerRow5 = ws5.addRow(headerRecapBorne);
        headerRow5.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'A6A6A6' } // gris
            };
        });

        ws5.getColumn('A').width = columnWidth;
        ws5.getColumn('B').width = columnWidth;
        ws5.getColumn('C').width = columnWidth;
        ws5.getColumn('D').width = columnWidth;
        ws5.getColumn('E').width = columnWidth;

        let dataCumulParBorne = cumulConsoBorne(dataNoArn)

        console.log("dataCumulParBorne : " + JSON.stringify(dataCumulParBorne));

        const sortedData = dataCumulParBorne
        .filter(row => row.conso > 0) // Filtrez les lignes avec conso > 0
        .map(row => [
            parseInt(row.borne, 10),
            parseInt(row.prise, 10),
            row.conso,
            row.typeConso
        ])
        .sort((a, b) => {
            // Comparer la colonne 'Borne'
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;

            // Si les valeurs de 'Borne' sont égales, comparer la colonne 'Prise'
            if (a[1] < b[1]) return -1;
            if (a[1] > b[1]) return 1;

            return 0; // Les valeurs de 'Borne' et 'Prise' sont égales
        });

        sortedData.forEach(rowData => {
        ws5.addRow(rowData);
        });

        ws5.columns.forEach((column) => {
            // Centrer les données dans chaque cellule
            column.eachCell((cell) => {
            cell.alignment = { horizontal: 'center' };
            });
        });

        // FIN des feuilles
        console.log("Data conso JSON : " + JSON.stringify(consommations));

        //Créer le fichier Excel et télécharger
        wb.xlsx.writeBuffer().then(buffer => {
            saveAs(new Blob([buffer]), 'CONSO_FACTURE.xlsx');
        });
      }

// onChange={handleBornePriseSearch}
    return <div className="conso-container">
        <div className="filter-section">
            
            <div className="search-section">
                <input value={boatFilter} onChange={({target}) => setBoatFilter(target.value)} className="search-conso-input" placeholder="Bateau" />
                <input value={borneFilter} onChange={({target}) => setBorneFilter(target.value)} className="search-conso-input" placeholder="Borne" /> 
                <input value={priseFilter} onChange={({target}) => setPriseFilter(target.value)} className="search-conso-input" placeholder="Prise" />
                <input value={sourceFilter} onChange={({target}) => setSourceFilter(target.value)} className="search-conso-input" placeholder="Source" />
            </div>

            <div className="search-section">
                
                <select onChange={handleChangeZoneFilter}>
                    <option value={'ALL'} checked={zoneFilter === 'ALL'}>Zone: tous</option>
                    {[...new Set(consommations.map((value) => value.zone))].map((zone, index) => <option key={index} value={zone} checked={zoneFilter === index}>Zone: {zone}</option>)}
                </select>
    
                <div onClick={() => setDisplayNull(!displayNull)} className={"display-0 "+(displayNull? 'checked' : '')}>
                    <h4>Afficher les conso. à 0</h4>
                </div>

                <select onChange={handleMonthFilterChange}>
                    <option value={0} checked={monthFilter === 0}>Mois : ∅ </option>
                    <option value={1} checked={monthFilter === 1}>Mois : Janvier</option>
                    <option value={2} checked={monthFilter === 2}>Mois : Février</option>
                    <option value={3} checked={monthFilter === 3}>Mois : Mars</option>
                    <option value={4} checked={monthFilter === 4}>Mois : Avril</option>
                    <option value={5} checked={monthFilter === 5}>Mois : Mai</option>
                    <option value={6} checked={monthFilter === 6}>Mois : Juin</option>
                    <option value={7} checked={monthFilter === 7}>Mois : Juillet</option>
                    <option value={8} checked={monthFilter === 8}>Mois : Aout</option>
                    <option value={9} checked={monthFilter === 9}>Mois : Septembre</option>
                    <option value={10} checked={monthFilter === 10}>Mois : Octobre</option>
                    <option value={11} checked={monthFilter === 11}>Mois : Novembre</option>
                    <option value={12} checked={monthFilter === 12}>Mois : Décembre</option>

                </select>
             
            </div>
        

            <div className="search-section">

                <h4>Du</h4>
                <input onChange={({target}) => setStartDate(target.value)} value={startDate}  type={"date"} className={"date-input"} />
                <h4>au</h4>
                <input onChange={handleEndDateChange} value={endDate} type={"date"} className={"date-input"} />
            </div>

            <div className="search-section">

    
            <CsvDownloadButton
            className="confirm-facture"
            headers={['Bateau', 'KW/h ou m3', 'Date d\'ouverture', 'Date de fermeture', 'Prise','Borne', 'Source', 'Zone', 'Activé par']} 
            filename="Consommation" 
            data={consommations.filter(filterFunction)} >Télécharger CSV</CsvDownloadButton>

            </div>

            <div className="search-section">
                <button className="confirm-facture" onClick={generateExcel}>Facturation</button>
            </div>


            {compareValue !== '' && <div onClick={() => setCompareValue('')} className="cancel-closest">
                <h4>Annuler le regroupement "{compareValue}"</h4>
            </div>}
        </div>

    

        
        
        <SortableTable
        emptyMessage={'Aucune consommation sur cette période'}
        data={consommations.filter(filterFunction)} header={[
            {label: "Numéro", column: 'numero', type:'number'},
            {label: "Bateau/entreprise", column: 'user', type: 'string', onClick: handleCellClick ,onDoubleClick: (boatname) => setCompareValue(boatname)},
            {label: "Date d'ouverture", column: 'start_date', type: 'date', processValue: (value) => value? value !== '-'? moment(value).format('DD/MM/YYYY\xa0\xa0\xa0HH:mm') : '-' : '-'},
            {label: "Date de fermeture", column: 'end_date', type: 'date',defaultValue: '-',  processValue: (value) => value? value !== '-'? moment(value).format('DD/MM/YYYY\xa0\xa0\xa0HH:mm') : '-' : '-'},
            {label: "Borne", column: 'borne', type: 'number'},
            {label: "Prise", column: 'prise', type: 'number'},
            {label: "Source", column: 'source', type: 'string'},
            {label: "KW/h ou m3", column: 'kw', type: 'number', defaultValue: 0, calculateTotal: true, onDoubleClick: (value) => clipboardy.writeSync('value')},
            {label: "Zone", column: 'zone', type: 'string'},
            {label: "Activé par", column: 'open_by', type: 'string', processValue: (value) => value? value : 'Système'},

            ]} 
            setVal={setVal}
            />

    </div>
}





export default Consommation;