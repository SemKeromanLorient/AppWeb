//BACK UP
import React, { useEffect, useState } from 'react';
import "./OrdreCriee.css"; 
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";
import jsonData from '../../excel/excel_data.json';
import { SortableTable } from "../../components";

//import { json } from 'stream/consumers';

function OrdreCriee(){
    
    const [image, setImage] = useState(null)
    const [cotiere1, setCotiere1] = useState([])
    const [cotiere2, setCotiere2] = useState([])
    const [date, setDate] = useState(null)
    const [total, setTotal] = useState([])
    //const [totalEspeceCriee1, setTotalEspeceCriee1] = useState({})
    //const [totalEspeceCriee2, setTotalEspeceCriee2] = useState({})

    const [totalEspece1,setTotalEspece1] = useState({});
    const [totalEspece2,setTotalEspece2] = useState({});

    useEffect(() => {
        remplirTab()
    },[])

    useEffect(() => {
        console.log("DATE : " + date)
    },[date])
    
    useEffect( () => {
        console.log("TEST TOTAL ESPECE 1 : " + JSON.stringify(totalEspece1));
        //setTotalEspeceCriee1(totalEspece1)
    },[totalEspece1])

    useEffect( () => {
        console.log("TEST TOTAL ESPECE 2 : " + JSON.stringify(totalEspece2));
        //setTotalEspeceCriee2(totalEspece2)
    },[totalEspece2])

    useEffect(() => {
        console.log("TOTAL :  " + total)
    },[total])


    useEffect(() => {
        if (cotiere1.length > 0){
            console.log("cotiere1 :  : " +  cotiere1)
            setCotiere1(cotiere1)
        }
    },[cotiere1])

    useEffect(() => {
        if (cotiere2.length > 0){
            console.log("cotiere2 :  : " +  cotiere2)
            setCotiere2(cotiere2)
        }
    },[cotiere2])

    /**
     * Initialise le tableau contenant toutes les données
     */
    
    function remplirTab(){

        
        //Si le tableau n'est pas vide on le refait a partir d'un vide
        //if (data.length > 0){
        //setCotiere1([])
        //setCotiere2([])
        //}
        
        let i = 3;
        //Sert de booléeen
        let j = 0;

        let date = new Date();
        let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

        const dateFormatee = date.toLocaleDateString('fr-FR', options);
        setDate(dateFormatee);


        while (i < jsonData.length && jsonData[i][0] !== undefined){
            //console.log("JSONDATA : " + jsonData[i][0])
            if (jsonData[i][0] === "TOTAL VENTE COTIERE 1 "){
                j++;
                total.push(jsonData[i][15])
                for (let k = 1; k <jsonData[i].length - 2; k++){
                    if (jsonData[i][k] !== null){
                        let keyEspece1 = jsonData[i + 1][k];
                        keyEspece1 = keyEspece1.replace(/\n/g, '');
                        let valEspece1 = jsonData[i][k];
                        totalEspece1[keyEspece1] = valEspece1
                    }
                }
                i = i + 4
            }
            else if(jsonData[i][0] != "TOTAL VENTE COTIERE 1 " && j === 0){
                cotiere1.push(jsonData[i][0])
            } 
            else if(jsonData[i][0] != "TOTAL VENTE COTIERE2" && j === 1){
                cotiere2.push(jsonData[i][0])
            }
            else {
                j++
                total.push(jsonData[i][15])
                for (let k = 1; k <jsonData[i].length - 2; k++){
                    if (jsonData[i][k] !== null){
                        let keyEspece2 = jsonData[i + 1][k];
                        keyEspece2 = keyEspece2.replace(/\n/g, '');
                        let valEspece2 = jsonData[i][k];
                        totalEspece2[keyEspece2] = valEspece2
                    }
                }
                i = i + 4
            }
            i++

            }
        }
   
    
    if (!cotiere1 || cotiere1.length === 0){
        return <h1> Ordre de vente criée indisponible </h1>
    }

    return (
        <>
        <div className='affichageTable'>
            <h1 className='titleTable'>
                Tirage du {date}
            </h1>
            {
                cotiere2.length === 0 && (
                    <table >
                        <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Nom</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cotiere1.map((item, index) => (
                            <tr key={index}>
                            <td className='colGauche'>{index+1}</td>
                            <td className='colDroite'>{item}</td>
                            </tr>
                        ))}
                        <td className='totalTxt'>Tonnage total : </td>
                        <td className='totalTxt2'>{total[0]} </td>
                        </tbody>
                    </table>
                )
            }
            {
                cotiere2.length != 0 && (
                    <div className='affichageDoubleCotiere'>
                        <div className='tablesContainer'>
                            <div className='tablesGauche'>
                                <table className='tableTirage'>
                                <thead>
                                    <tr>
                                        <th colSpan={2} className='titleCotiere'>Cotiere 1</th>
                                    </tr>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {cotiere1.map((item, index) => (
                                    <tr key={index}>
                                        <td className='colGauche'>{index + 1 }</td>
                                        <td className='colDroite'>{item}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className='tablesDroite'>
                                <table className='tableTirage2'>
                                    <thead>
                                    <tr >
                                        <th colSpan={2} className='titleCotiere'>Cotiere 2</th>
                                    </tr>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                    </tr>
                                    </thead>
                                    <tbody className='adjustementTable'>
                                        {cotiere2.map((item, index) => (
                                            <tr className='ligneAffichageCot2' key={index}>
                                            <td className='colGauche'>{index + 1 }</td>
                                            <td className='colDroite'>{item}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                            <div className='containeurBas'>  
                                <table className='tableTirage'>
                                    <tr>
                                        <td colSpan={2}><hr className="delimiter" /></td>
                                    </tr>
                                    <tbody>
                                        <tr>
                                            <td className='totalTxt'>Tonnage total : </td>
                                            <td className='totalTxt2'>{total[0]} </td>
                                        </tr>
                                        {Object.entries(totalEspece1).map(([key, value], index) => (
                                            <tr key={index}>
                                                <td className='especeTotal'>{key}</td>
                                                <td className='totalEspece'>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table className='tableTirage'>
                                    <tr>
                                        <td colSpan={2}><hr className="delimiter" /></td>
                                    </tr>
                                    <tbody>
                                        <tr>
                                            <td className='totalTxt'>Tonnage total : </td>
                                            <td className='totalTxt2'>{total[1]} </td>
                                        </tr>
                                        {Object.entries(totalEspece2).map(([key, value], index) => (
                                            <tr key={index}>
                                                <td className='especeTotal'>{key}</td>
                                                <td className='totalEspece'>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                  </div>
                    
                )
            }
          
        </div>
      </>
    )
}

export default OrdreCriee;


/**
 *     function remplirTab(){

        //Si le tableau n'est pas vide on le refait a partir d'un vide
        if (data.length > 0){
            setData([])
        }
        
        let i = 3;
        let j = 0;

        let nbJours = jsonData[0][3]

        let date = new Date(nbJours * 24 * 60 * 60 * 1000);


        let annee = date.getFullYear();
        let mois = date.getMonth() + 1;
        let jour = date.getDate();

        const dateFormatee = `${jour}/${mois}/${annee}`

        data.push(dateFormatee)

        while (i < jsonData.length && jsonData[i] !== ""){

            data.push(jsonData[i][0])
            i++;
            if (jsonData[i][0] === "TOTAL VENTE COTIERE 1" || jsonData[i][0] === "TOTAL VENTE COTIERE2"){
                if (jsonData[i][15] !== undefined) {
                    data.push(jsonData[i][15])
                }
                i = i + 4;
            }
            
        }
    }

function remplirTab(){

        //Si le tableau n'est pas vide on le refait a partir d'un vide
        setVenteCotiere1([])
        setTotal([])
        setValideCotiere1(true)
        
        
        let i = 3;

        let date = new Date();


        
        let annee = date.getFullYear();
        let mois = date.getMonth() + 1;
        let jour = date.getDate();

        const dateFormatee = `${jour.toString().padStart(2, '0')}/${mois.toString().padStart(2, '0')}/${annee}`;

        setDate(dateFormatee)

        //data.push(dateFormatee)

        while (i < jsonData.length && jsonData[i][0] !== undefined){
            console.log("INFO  : " + jsonData[i][0])
            if(jsonData[i][0] != "TOTAL VENTE COTIERE 1 " && valideCotiere1){
                //setData(prevData => [...data,jsonData[i][0]])
                venteCotiere1.push(jsonData[i][0])
            } else if (jsonData[i][0] === "TOTAL VENTE COTIERE 1"){
                console.log("ELSE IF TOTAL VENTE COTIERE 1")
                total.push(jsonData[i][15])
                i = i + 4
                setValideCotiere1(false)
            } else if (jsonData[i][0] != "TOTAL VENTE COTIERE2" && !valideCotiere1){
                venteCotiere2.push(jsonData[i][0])
            } else {
                total.push(jsonData[i][15])
                i = i + 4
            }
            i++

            }
        }
   
    
    if (!venteCotiere1){
        return <h1> Ordre de vente criée indisponible </h1>
    }

//////////////////// TOUTES LES DONN2ES COTIERE 1 ET 2 DANS LE MEME TAB
         if(jsonData[i][0] != "TOTAL VENTE COTIERE 1 " && jsonData[i][0] !="TOTAL VENTE COTIERE2"){
                console.log("TEST IF")
                //setData(prevData => [...data,jsonData[i][0]])
                data.push(jsonData[i][0])
            } else {
                total.push(jsonData[i][15])
                i = i + 4
            }
            i++

//////////////////////// RETURN TEST


               return (
        <>
        <div className='affichageTable'>
            <h1 className='titleTable'>
                Tirage du {date}
            </h1>
            {
                cotiere2.length === 0 && (
                    <table>
                        <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Nom</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cotiere1.map((item, index) => (
                            <tr key={index}>
                            <td className='colGauche'>{index}</td>
                            <td className='colDroite'>{item}</td>
                            </tr>
                        ))}
                        <td className='totalTxt'>Total ventes : </td>
                        <td className='totalTxt2'>{total[0]} </td>
                        </tbody>
                    </table>
                )
            }
            {
                cotiere2.length != 0 && (
                    <table>
                        <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Nom</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cotiere1.map((item, index) => (
                            <tr key={index}>
                            <td className='colGauche'>{index}</td>
                            <td className='colDroite'>{item}</td>
                            </tr>
                        ))}
                        <td className='totalTxt'>Total ventes : </td>
                        <td className='totalTxt2'>{total[0]} </td>
                        </tbody>
                        <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Nom</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cotiere2.map((item, index) => (
                            <tr key={index}>
                            <td className='colGauche'>{index}</td>
                            <td className='colDroite'>{item}</td>
                            </tr>
                        ))}
                        <td className='totalTxt'>Total ventes : </td>
                        <td className='totalTxt2'>{total[1]} </td>
                        </tbody>
                    </table>
                    
                )
            }
          
        </div>
      </>
    )
 */

