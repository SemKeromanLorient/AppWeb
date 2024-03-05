// import React, { useEffect, useState } from "react";
// import "./Tickets.style.css"
// import { postToServer } from "../../utils/serverHttpCom.js";
// import { XMLParser } from 'fast-xml-parser';
// var convert = require('xml-js');
// import bwipjs from 'bwip-js';


// const atsSeperator = ''


// function Tickets(){

//         const [aucxisTickets, setAucxisTickets] = useState([]);
//         const [preSateTickets, setPreSaleTickets] = useState([]);
//         const [searchValue, setSearchValue] = useState([]);
//         const [navFormat, setNavFormat] = useState('gs1');


//         function readXML(xml){

//             let jsonForm = {}

//             let array = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 })).LABELS.LABEL.VARIABLE

//             for (let i = 0; i < array.length; i++) {
//                 const element = array[i];
//                 jsonForm[element._attributes.name] = element._text
//             }

//             return jsonForm
            
//         }

//         function translateXMLOldFormat(jsonFormat){

//             let datamartix = [
//                 jsonFormat.CodePaysBateau,
//                 jsonFormat.TypeIdentifiant,
//                 jsonFormat.LotNo,
//                 jsonFormat.DesignationValorisationQualitative,
//                 jsonFormat.NoIdentificationBateau,
//                 jsonFormat.CodeCFR,
//                 jsonFormat.NomBateau,
//                 jsonFormat.CodeEspece,
//                 jsonFormat.NomEspece,
//                 jsonFormat.NomScientifiqueEspece,
//                 jsonFormat.CodeTaille,
//                 jsonFormat.DesignationPresentation,
//                 jsonFormat.DesignationModePeche,
//                 jsonFormat.DesignationZonePeche,
//                 jsonFormat.DateDebutMaree,
//                 jsonFormat.DateFinMaree,
//                 jsonFormat.QuartierMaritime,
//                 jsonFormat.NomFournisseur,
//                 jsonFormat.Rangee,
//                 jsonFormat.CodeCriee,
//                 jsonFormat.NomOP,
//                 jsonFormat.DesignationPalette,
//                 jsonFormat.NbrePalettes,
//                 jsonFormat.NomAcheteur,
//                 jsonFormat.CodeTransaction,
//                 jsonFormat.NoAlibi,
//                 jsonFormat.DatePremPesee,
//                 jsonFormat.DateVente,
//                 jsonFormat.DatePreparation,
//                 jsonFormat.CodeTiersBucodi,
//                 jsonFormat.IdCriee
//             ]
            
//             return {
//                 type: 'Pre-vente',
//                 data: jsonFormat,
//                 lot: jsonFormat.LotNo,
//                 datamartix: '\n'+datamartix.join('\n')
//             }


//         }


//         function translateXMLGS1Format(jsonFormat){

//             let datamartix = [
//                 "]2D01"+jsonFormat.CodePaysBateau,
//                 "10"+jsonFormat.LotNo,
//                 "22"+jsonFormat.NomBateau,
//                 "30"+jsonFormat.CodeEspece,
//                 "31"+jsonFormat.NomEspece,
//                 "32"+jsonFormat.NomScientifiqueEspece,
//                 "38"+jsonFormat.DateDebutMaree,
//                 "38"+jsonFormat.DateFinMaree,
//                 "63"+jsonFormat.DatePremPesee,
//                 "65"+jsonFormat.DatePreparation,
//                 "64"+jsonFormat.DateVente,
//                 "33"+jsonFormat.CodeTaille,
//                 "34"+jsonFormat.DesignationQualite,
//                 "35"+jsonFormat.DesignationPresentation,
//                 "36"+jsonFormat.CodeModePeche,
//                 "42"+"FR 56.121.032 CE",
//                 "45"+jsonFormat.NomOP,
//                 "51"+jsonFormat.NbreCaisses,
//                 "60"+jsonFormat.PoidsNet,
//                 "61"+jsonFormat.PoidsBrut,
//             ]
            
//             return {
//                 type: 'Pré-vente',
//                 data: jsonFormat,
//                 lot: jsonFormat.LotNo,
//                 datamartix: '\n'+datamartix.join(atsSeperator)
//             }


//         }


//         function translateATS(){

//         }

//         function filterFunc(ticket){

             
            



//         }

//         useEffect(() => {

//             postToServer('/tickets', {}, ({data}) => {

//                 setAucxisTickets(data.ats)

//                 console.log(data.ats)
//                 let NAVtickets = data.nav.map((xmlString) => translateXMLGS1Format(readXML(xmlString)))
                
//                 setPreSaleTickets(NAVtickets)

//             }, (err) => {

//                 console.log('err: ', err)

//             })
            


//         }, [])

//         useEffect(() => {

//             if(preSateTickets.length > 0){
//                 let NAVtickets = preSateTickets.map(({data}) => navFormat === 'gs1'? translateXMLGS1Format(data) : translateXMLOldFormat(data))
//                 setPreSaleTickets(NAVtickets)
//             }
           
//         }, [navFormat])


//         function updateDatamartix(){

//         }
    
//         function handleChangeFormat({nativeEvent}){

//             setNavFormat(nativeEvent.target.value)

//         }

//         return <div className="ticket-container">

//             <div className="filter-section">

//                 <div className="search-section">

                    
//                     <input className="search-conso-input" placeholder="Rechercher par lot" />


//                 </div>

//                 <div className="search-section">

                    
//                     <select>
//                         <option value={"ats"}>Afficher: Tous</option>
//                         <option value={"nav"}>Afficher: Pré-vente</option>
//                         <option value={"ats"}>Afficher: Aucxis</option>
//                     </select>

//                     <select onChange={handleChangeFormat}>
//                         <option value={"gs1"}>Format Datamatrix pré-vente: GS1 aucxis</option>
//                         <option value={"no-gs1"}>Format Datamatrix pré-vente: Sans GS1</option>
//                     </select>


//                 </div>


//             </div>



//             <div className="tickets-list">

//                 {preSateTickets.map((data, index) => <Ticket key={index} data={data}/>)}

//             </div>


//         </div>



// }

// function Ticket({data}){


//     useEffect(() => {

//         let canvas = bwipjs.toCanvas("datamatrix_"+data.lot, {
//             bcid: 'datamatrix',   
//             version: "64x64",
//             text: data.datamartix, 
//             includetext: true,
//             scale: 1.5,            
//             textxalign:  'center',        
//         });


//     }, [data])


//     return <div className="ticket">

//         <h2>{data.type}</h2>

//         <h2>Lot: {data.lot}</h2>

//         {data.data && data.data.Annule && <h4 className="cancel">Annulé</h4>}

//         <canvas id={"datamatrix_"+data.lot}></canvas>

//     </div>

// }

// export default Tickets;