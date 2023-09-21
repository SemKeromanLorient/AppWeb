import React, { useEffect, useState } from 'react';
import "./OrdreCriee.css"; 
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";
import jsonData from '../../excel/excel_data.json';
import { SortableTable, Toast } from "../../components";

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

    //let numRowsCot1 = cotiere1.length;
    //let numRowsCot2 = cotiere2.length;
    const [numRowsCot1, setNumRowsCot1] = useState(cotiere1.length)
    const [numRowsCot2, setNumRowsCot2] = useState(cotiere2.length)

    const [sizeRowsCot1,setSizeRowsCot1] = useState("")
    const [sizeRowsCot2,setSizeRowsCot2] = useState("")

    const [numRowsTotalEspece1, setNumRowsTotalEspece1] = useState(Object.keys(totalEspece1).length)
    const [numRowsTotalEspece2, setNumRowsTotalEspece2] = useState(Object.keys(totalEspece2).length)

    const [sizeTotal1,setSizeTotal1] = useState("")
    const [sizeTotal2,setSizeTotal2] = useState("")

    useEffect(() => {
        remplirTab()
    },[])

    useEffect(() => {
        console.log("DATE : " + date)
    },[date])
    
    useEffect( () => {
        console.log("TEST TOTAL ESPECE 1 : " + JSON.stringify(totalEspece1));
        setNumRowsTotalEspece1(Object.keys(totalEspece1).length);
    },[totalEspece1])


    useEffect( () => {
        console.log("TEST TOTAL ESPECE 2 : " + JSON.stringify(totalEspece2));
        setNumRowsTotalEspece2(Object.keys(totalEspece2).length);
    },[totalEspece2])

    useEffect(() => {
        console.log("TOTAL :  " + total)
    },[total])

    useEffect(() => {
        if (cotiere1.length > 0){
            console.log("cotiere1 : " +  cotiere1)
            setCotiere1(cotiere1)
            setNumRowsCot1(cotiere1.length)
            console.log("nombre de lignes cotiere 1 : " + numRowsCot1)
        }
    },[cotiere1])

    useEffect(() => {
        if (cotiere2.length > 0){
            console.log("cotiere2 : " +  cotiere2)
            setCotiere2(cotiere2)
            setNumRowsCot2(cotiere2.length)
            console.log("nombre de lignes cotiere 2 : " + numRowsCot2)
        }
    },[cotiere2])

    useEffect(() => {
        console.log("TEST IN NUMROWSCOT1")
        if (numRowsCot1 >= 10 && numRowsCot1 < 15){
            setSizeRowsCot1("140%");
        } else if (numRowsCot1 >= 15 && numRowsCot1 < 20){
            setSizeRowsCot1("130%");
        } else if (numRowsCot1 >= 20 && numRowsCot1 < 25){
            setSizeRowsCot1("120%");
        } else if (numRowsCot1 >= 25 && numRowsCot1 < 30){
            setSizeRowsCot1("110%");
        } else if (numRowsCot1 >= 30 && numRowsCot1 < 35){
            setSizeRowsCot1("100%");
        } else if (numRowsCot1 >= 35 && numRowsCot1 <= 40){
            setSizeRowsCot1("90%");
        }
    },[numRowsCot1])

    useEffect(() => {
        console.log("TEST IN NUMROWSCOT2")
        if (numRowsCot2 >= 0 && numRowsCot2 < 5){
            setSizeRowsCot2("140%");
        } else if (numRowsCot2 >= 5 && numRowsCot2 < 10){
            setSizeRowsCot2("130%");
        } else if (numRowsCot2 >= 10 && numRowsCot2 < 15){
            setSizeRowsCot2("120%");
        } else if (numRowsCot2 >= 15 && numRowsCot2 < 20){
            setSizeRowsCot2("110%");
        } else if (numRowsCot2 >= 20 && numRowsCot2 < 25){
            setSizeRowsCot2("100%");
        } else if (numRowsCot2 >= 25 && numRowsCot2 <= 30){
            setSizeRowsCot2("90%");
        }
    },[numRowsCot2])

    useEffect(() => {
        console.log("TEST IN numRowsTotalEspece1")
        if (numRowsTotalEspece1 >= 0 && numRowsTotalEspece1 <= 4){
            setSizeTotal1("140%");
        } else if (numRowsTotalEspece1 > 4 && numRowsTotalEspece1 <= 6){
            setSizeTotal1("130%");
        } else if (numRowsTotalEspece1 > 6 && numRowsTotalEspece1 <= 8){
            setSizeTotal1("120%");
        } else if (numRowsTotalEspece1 > 8 && numRowsTotalEspece1 <= 10){
            setSizeTotal1("110%");
        } else if (numRowsTotalEspece1 > 10 && numRowsTotalEspece1 <= 12){
            setSizeTotal1("100%");
        } else if (numRowsTotalEspece1 >=12 && numRowsTotalEspece1 <= 14){
            setSizeTotal1("90%");
        }
    },[numRowsTotalEspece1])

    useEffect(() => {
        console.log("TEST IN numRowsTotalEspece2")
        if (numRowsTotalEspece1 >= 0 && numRowsTotalEspece1 <= 4){
            setSizeTotal2("140%");
        } else if (numRowsTotalEspece1 > 4 && numRowsTotalEspece1 <= 6){
            setSizeTotal2("130%");
        } else if (numRowsTotalEspece1 > 6 && numRowsTotalEspece1 <= 8){
            setSizeTotal2("120%");
        } else if (numRowsTotalEspece1 > 8 && numRowsTotalEspece1 <= 10){
            setSizeTotal2("110%");
        } else if (numRowsTotalEspece1 > 10 && numRowsTotalEspece1 <= 12){
            setSizeTotal2("100%");
        } else if (numRowsTotalEspece1 >=12 && numRowsTotalEspece1 <= 14){
            setSizeTotal2("90%");
        }
    },[numRowsTotalEspece2])


    function chunkArray(arr, chunkSize) {
        const chunkedArray = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          chunkedArray.push(arr.slice(i, i + chunkSize));
        }
        return chunkedArray;
      }

    /**
     * Initialise le tableau contenant toutes les données
     */
    function remplirTab(){
        
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

    /*
    <td className='totalTxt'>Tonnage total : </td>
                        <td className='totalTxt2'>{total[0]} </td>
                        {chunkArray(Object.entries(totalEspece1), 2).map((chunk, rowIndex) => (
                            <tr key={rowIndex}>
                                {chunk.map(([key, value], cellIndex) => (
                                    <React.Fragment key={cellIndex}>
                                        <td className='especeTotal' style={{ fontSize: sizeTotal1 }}>{key}</td>
                                        <td className='totalEspece' style={{ fontSize: sizeTotal1 }}>{value}</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}
    */

    return (
        <>
        <div className='affichageTable'>
            <h1 className='titleTable'>
                Tirage du {date}
            </h1>
            {
                cotiere2.length === 0 && (
                    <div className='affichageDoubleCotiere'>
                            <table>
                                <thead>
                                <tr>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cotiere1.slice(0, Math.ceil(cotiere1.length / 2)).map((item, index) => (
                                    <tr key={index}>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot1 }}>{index + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot1 }}>{item}</td>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot1 }}> {index + Math.ceil(numRowsCot1/2) + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot1 }}>{cotiere1[index + Math.ceil(cotiere1.length / 2)]}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                                <div className='infPart1Cot'>
                                    <h2 className='totalTxt'> Tonnage total (KG) : {total[0]} </h2>
                                    <table className='tableTirage3'>
                                        <thead className='testTHEAD'>
                                        </thead>
                                        <tbody>
                                            {chunkArray(Object.entries(totalEspece1), 2).map((chunk, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {chunk.map(([key, value], cellIndex) => (
                                                    <React.Fragment key={cellIndex}>
                                                        <td className='especeTotal' style={{ fontSize: sizeTotal1 }}>{key}</td>
                                                        <td className='totalEspece' style={{ fontSize: sizeTotal1 }}>{value}</td>
                                                    </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                    </div>
                )
            }
            {
                cotiere2.length != 0 && (
                    <div className='affichageDoubleCotiere'>
                        <div className='tablesContainer'>
                            <div className='tablesGauche'>
                                <h2 className='titleCotiere'>Cotiere 1</h2>
                                <table className='tableTirage'>
                                <thead>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cotiere1.slice(0, Math.ceil(cotiere1.length / 2)).map((item, index) => (
                                    <tr key={index}>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot1 }}>{index + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot1 }}>{item}</td>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot1 }}> {index + Math.ceil(numRowsCot1/2) + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot1 }}>{cotiere1[index + Math.ceil(cotiere1.length / 2)]}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            <div className='tablesDroite'>
                                <h2 className='titleCotiere'>Cotiere 2</h2>
                                <table className='tableTirage2'>
                                    <thead>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                    </tr>
                                    </thead>
                                    <tbody className='adjustementTable'>
                                        {cotiere2.map((item, index) => ( 
                                            <tr className='ligneAffichageCot2' key={index}>
                                                <td className='colGauche' style={{ fontSize: sizeRowsCot2 }}>{index + 1 }</td>
                                                <td className='colDroite' style={{ fontSize: sizeRowsCot2 }}>{item}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                            <div className='containeurBas'>  
                                <div className='resumeGauche'>
                                    <h2 className='totalTxt'> Tonnage total (KG) : {total[0]} </h2>
                                    <table className='tableTirage3'>
                                        <thead className='testTHEAD'>
                                        </thead>
                                        <tbody>
                                            {chunkArray(Object.entries(totalEspece1), 2).map((chunk, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {chunk.map(([key, value], cellIndex) => (
                                                    <React.Fragment key={cellIndex}>
                                                        <td className='especeTotal' style={{ fontSize: sizeTotal1 }}>{key}</td>
                                                        <td className='totalEspece' style={{ fontSize: sizeTotal1 }}>{value}</td>
                                                    </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='resumeDroite'>
                                    <h2 className='totalTxt'> Tonnage total (KG) : {total[1]}</h2>
                                    <table className='tableTirage4'>
                                    <tbody>
                                            {chunkArray(Object.entries(totalEspece2), 2).map((chunk, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {chunk.map(([key, value], cellIndex) => (
                                                    <React.Fragment key={cellIndex}>
                                                        <td className='especeTotal' style={{ fontSize: sizeTotal2 }}>{key}</td>
                                                        <td className='totalEspece' style={{ fontSize: sizeTotal2 }}>{value}</td>
                                                    </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
 * <div className='tablesGauche'>
                                <h2 className='titleCotiere'>Cotiere 1</h2>
                                <div className='testDivCot'>
                                <table className='tableTirage'>
                                <thead>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Nom</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cotiere1.slice(0, Math.ceil(cotiere1.length / 2)).map((item, index) => (
                                    <tr key={index}>
                                        <td className='colGauche'>{index + 1}</td>
                                        <td className='colDroite'>{item}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Numéro</th>
                                            <th>Nom</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cotiere1.slice(Math.ceil(cotiere1.length / 2)).map((item, index) => (
                                            <tr key={index}>
                                            <td className='colGauche'>{index + 1 + Math.ceil(cotiere1.length / 2)}</td>
                                            <td className='colDroite'>{item}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
 */