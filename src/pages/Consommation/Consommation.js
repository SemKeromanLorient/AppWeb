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
    const [stateFilter, setStateFilter] = useState(-1);
    const [typeFilter, setTypeFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [compareValue, setCompareValue] = useState('');
    const [zoneFilter, setZoneFilter] = useState('ALL');

    const [val,setVal] = useState('');

    useEffect(() => {
        document.title = 'Supervision | Consommations'
    }, [])

    useEffect(() => {

        fetchConsommation();

    }, [startDate, endDate])
//,convertDateData
/** 
        let newConso;
        for (let row of consommations){

        }
        
        setConsommations(newConso)
            */

    /**
     * Change les date format iso en date et meme chose pour uniformiser les points et virgules
     */
    function convertDateData (){

        console.log("Test convertDate")
        console.log(consommations)
        // Recherche de l'élément correspondant dans le tableau "consommation"
        //const element = consommations.find((element) => element.id === 102);

        // Extraction de la propriété "start_date" de l'élément
        //const startDate = element.start_date;

        // Affichage de la date de début
        //console.log("Date de début de l'élément " + 102 + " : " + startDate);
    }

    
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
        
        if(Number(stateFilter) !== -1 && (conso.is_open !== Number(stateFilter)))return false;

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
        /** 
        if(!displayNull && conso.kw === 0) return false;
        if(boatFilter !== '' && !conso.user.toUpperCase().includes(boatFilter.toUpperCase())) return false;
        if(Number(stateFilter) !== -1 && (conso.is_open !== Number(stateFilter))) return false;
        if(zoneFilter !== 'ALL' && conso.zone !== zoneFilter) return false;
        if(compareValue !== '' && distance(compareValue.toUpperCase(), conso.user.toUpperCase()) >= compareValue.length / 2) return false;
        if(sourceFilter != '' && !conso.source.includes(sourceFilter)) return false;
        if(conso.arn) return false; // Filtre les données d'arn
        return true;
        */
    }

    /**
     * TODO
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

    function handleStateFilterChange({nativeEvent}){
        setStateFilter(nativeEvent.target.value)
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
            for (const rowCumul of dataCumul){
                if (rowCumul.user === row.user){
                    hasToAdd = false;
                }
            }
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
     * Génere un fichier excel séparé en différentes parties un worksheet avec les détails des conso d'electricité, un autre avec les conso d'eau et un dernier avec des récaps de données
     */
    function generateExcel() {
        const wb = new ExcelJS.Workbook();
        // Données facturation pour les différentes pages
        const data1 = consommations.filter(filterDataEau);
        const data2 = consommations.filter(filterDataElectricite);

        const dataEau = Object.values(data1);
        const dataElec = Object.values(data2);

        // définir la largeur souhaitée de la première colonne (numéro 1)
        const columnWidth = 40;
        
        const headerEau = ['Activé par', 'A facturer a', 'Source', 'm3', "Date d'ouverture", "Date de fermeture", "Zone","Borne", "Prise"]
        const headerElec = ['Activé par', 'A facturer a', 'Source', 'KW/h', "Date d'ouverture", "Date de fermeture", "Zone","Borne", "Prise"]
        // Créer une nouvelle feuille dans le classeur et ajouter les données
        const ws1 = wb.addWorksheet('Conso EAU Port de Peche');
        const headerRow = ws1.addRow(headerEau);
        headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A6A6A6' } // gris
        };
        });
        
        // Appliquer une largeur de colonne de 40 à toutes les colonnes
        
        //for (let i = 0; i < 9; i++){
          //  ws2.getColumn(i).width = 40;
        //}
       
        ws1.getColumn('A').width = columnWidth;
        ws1.getColumn('B').width = columnWidth;
        ws1.getColumn('C').width = columnWidth;
        ws1.getColumn('D').width = columnWidth;
        ws1.getColumn('E').width = columnWidth;
        ws1.getColumn('F').width = columnWidth;
        ws1.getColumn('G').width = columnWidth;
        ws1.getColumn('H').width = columnWidth;
        ws1.getColumn('I').width = columnWidth;
        /** 
        ws1.columns = [
            {header: 'Activé par', key: 'activation', width: 40},
            {header: 'A facturer a', key: 'facture', width: 40},
            {header: 'Source', key: 'source', width: 40},
            {header: 'm3', key: 'quantite', width: 40},
            {header: "Date d'ouverture", key: 'ouverture', width: 40},
            {header: 'Date de fermeture', key: 'fermeture', width: 40},
            {header: 'Zone', key: 'zone', width: 40},
            {header: 'Borne', key: 'borne', width: 40},
            {header: 'Prise', key: 'prise', width: 40}

        ] */
        ws1.autoFilter = {
            from: 'A1',
            to: 'I1',
        }
        /** 
        ws2.columns = [
            {header: 'Activé par', key: 'activation', width: 40},
            {header: 'A facturer a', key: 'facture', width: 40},
            {header: 'Source', key: 'source', width: 40},
            {header: 'KW/h', key: 'quantite', width: 40},
            {header: "Date d'ouverture", key: 'ouverture', width: 40},
            {header: 'Date de fermeture', key: 'fermeture', width: 40},
            {header: 'Zone', key: 'zone', width: 40},
            {header: 'Borne', key: 'borne', width: 40},
            {header: 'Prise', key: 'prise', width: 40}

        ] */
        
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

    
      
        // Créer une nouvelle feuille dans le classeur et ajouter les données
        const ws2 = wb.addWorksheet('Conso ELEC Port de Peche');
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

        const headerRecap = ['Facturer a','Cumul','Type-Conso']
        // Créer une nouvelle feuille dans le classeur et ajouter les données
        const ws3 = wb.addWorksheet('Récap');
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

        
        // Créer une nouvelle feuille dans le classeur et ajouter les données
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

        console.log("Data conso JSON : " + JSON.stringify(consommations));

        console.log("Data conso : " + consommations);

        //Créer le fichier Excel et télécharger
        wb.xlsx.writeBuffer().then(buffer => {
            saveAs(new Blob([buffer]), 'CONSO_FACTURE.xlsx');
        });
      }


//////////////////////////////////////////////////////////////// TEST /////////////////////////////////////////////////////////////////////////
    function test(){
        console.log("Prise numéro : " + priseFilter);
    }
//////////////////////////////////////////////////////////////// TEST /////////////////////////////////////////////////////////////////////////


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
                <select onChange={handleStateFilterChange}>
                    <option value={-1} checked={stateFilter === -1}>Etat: Tous</option>
                    <option value={1} checked={stateFilter === 1}>Etat: En cours...</option>
                    <option value={0} checked={stateFilter === 0}>Etat: Fini</option>
                </select>

                <select onChange={handleChangeZoneFilter}>
                    <option value={'ALL'} checked={zoneFilter === 'ALL'}>Zone: tous</option>
                    {[...new Set(consommations.map((value) => value.zone))].map((zone, index) => <option key={index} value={zone} checked={zoneFilter === index}>Zone: {zone}</option>)}
                </select>
    
                <div onClick={() => setDisplayNull(!displayNull)} className={"display-0 "+(displayNull? 'checked' : '')}>
                    <h4>Afficher les conso. à 0</h4>
                </div>
             
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
            headers={['Bateau', 'KW/h ou m3', 'Date d\'ouverture', 'Date de fermeture', 'Prise','Borne', 'Etat', 'Source', 'Zone', 'Etat facturation', 'Activé par']} 
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
            {label: "Bateau/entreprise", column: 'user', type: 'string', onDoubleClick: (boatname) => setCompareValue(boatname)},
            {label: "Date d'ouverture", column: 'start_date', type: 'date', processValue: (value) => value? value !== '-'? moment(value).format('DD/MM/YYYY\xa0\xa0\xa0HH:mm') : '-' : '-'},
            {label: "Date de fermeture", column: 'end_date', type: 'date',defaultValue: '-',  processValue: (value) => value? value !== '-'? moment(value).format('DD/MM/YYYY\xa0\xa0\xa0HH:mm') : '-' : '-'},
            {label: "Borne", column: 'borne', type: 'number'},
            {label: "Prise", column: 'prise', type: 'number'},
            {label: "Source", column: 'source', type: 'string'},
            {label: "KW/h ou m3", column: 'kw', type: 'number', defaultValue: 0, calculateTotal: true, onDoubleClick: (value) => clipboardy.writeSync('value')},
            {label: "Etat", column: 'is_open', type: 'number', processValue: (value) => value === 1? 'En cours...' : 'Fini'},
            {label: "Zone", column: 'zone', type: 'string'},
            {label: "Activé par", column: 'open_by', type: 'string', processValue: (value) => value? value : 'Système'},
            {label: "Etat facturation", column: 'facture', type: 'number', processValue: (value) => value === 1? 'Facturé' : 'En attente...'}

            ]} 
            setVal={setVal}
            />

    </div>
}





export default Consommation;