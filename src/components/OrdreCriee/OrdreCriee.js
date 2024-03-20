import React, { useEffect, useState } from 'react';
import "./OrdreCriee.css"; 
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";
//import jsonData from '../../excel/excel_data.json';
import { SortableTable, Toast } from "../../components";
import axios from 'axios';

//import { json } from 'stream/consumers';

function OrdreCriee(){
    //Corresponds à toutes les données sous format json (Pas encore trié)
    const [jsonData, setJsonData] = useState({});

    //Corresponds au données de cotières avec chaque info des prévisions sur chaque tableau de cotière
    const [cotiere1, setCotiere1] = useState([])
    const [cotiere2, setCotiere2] = useState([])

    //Corresponds à la date du fichier (indiqué dans ce fichier)
    const [date, setDate] = useState(null)
    const [total, setTotal] = useState([])

    //Corresponds au total par espèce de chaque poisson pour les cotières 1 et 2
    const [totalEspece1,setTotalEspece1] = useState({});
    const [totalEspece2,setTotalEspece2] = useState({});

    //Corresponds au nombre de ligne dans les cotières 1 et 2
    const [numRowsCot1, setNumRowsCot1] = useState(cotiere1.length)
    const [numRowsCot2, setNumRowsCot2] = useState(cotiere2.length)

    //Corresponds à la taille d'écriture correspondant pour les cotières 1 et 2
    const [sizeRowsCot1,setSizeRowsCot1] = useState("")
    const [sizeRowsCot2,setSizeRowsCot2] = useState("")

    const [numRowsTotalEspece1, setNumRowsTotalEspece1] = useState(Object.keys(totalEspece1).length)
    const [numRowsTotalEspece2, setNumRowsTotalEspece2] = useState(Object.keys(totalEspece2).length)

    //Corresponds à la taille d'écriture correspondant pour les totaux des cotières 1 et 2
    const [sizeTotal1,setSizeTotal1] = useState("")
    const [sizeTotal2,setSizeTotal2] = useState("")

    //On récupère les données JSON (donnée du excel) à chaque refresh de page
    useEffect(() => {
        fetchJSON()
     },[])

    //Ensuite dès qu'on a ces données JSON, on setup les variables pour l'affichage (notamment pour la taille de celui-ci)
    useEffect(() => {
        remplirTab()
        setNumRowsCot1(cotiere1.length)
        setNumRowsCot2(cotiere2.length)
        setNumRowsTotalEspece1(Object.keys(totalEspece1).length)
        setNumRowsTotalEspece2(Object.keys(totalEspece2).length)
    },[jsonData])

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

    //Semble obsolète
    useEffect(() => {
        if (cotiere1.length > 0){
            console.log("cotiere1 : " +  cotiere1)
            setCotiere1(cotiere1)
            setNumRowsCot1(cotiere1.length)
            console.log("nombre de lignes cotiere 1 : " + numRowsCot1)
        }
    },[cotiere1])

    //Semble obsolète
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
        console.log("TEST IN numRowsTotalEspece1 : " + numRowsTotalEspece1)
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

    async function fetchJSON() {
        try {
          const response = await axios.get('https://service.keroman.fr/api/get-json');
          
          if (response.status === 200) {
            const data = response.data;
            // Utilisez les données comme vous le souhaitez
            console.log('Données JSON récupérées :', data);
            setJsonData(data)
          } else {
            console.error('La requête a échoué avec un statut :', response.status);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      }

    function chunkArray(arr, chunkSize) {
        const chunkedArray = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          chunkedArray.push(arr.slice(i, i + chunkSize));
        }
        return chunkedArray;
      }

    /**
     * Initialise le tableau contenant toutes les données // FONCTIONNE PAS PARCEQUE ligne vide (revoir la logique pour ajouter les données)
     */
    function remplirTab(){
        let i,j;
        let nbLignesMaxATraiter = 150; // Corresponds au nombre de lignes que l'affichage va permettre
        //Vérifie si on est dans cotiere 1 ou cotiere 2
        if (!jsonData[3] || (Array.isArray(jsonData[3]) && jsonData[3].length === 0)){
            // i : On passe les éléments jusqu'a la première ligne correspondant au information du premier bateau
            // j : Sert de booléeen | 0 = cotiere 1; 1 = cotiere 2; 3 = aucune cotiere
            console.log("Cotière 2 uniquement")
            i = 9;
            j = 1;
        } else {
            console.log("Cotière 1 (et potentiellement cotière 2)")
            i = 3;
            j = 0;
        }

        let date = new Date();
        let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

        if (date.getDay() === 0) {
            // Si c'est dimanche, soustraire un jour à la date
            date.setDate(date.getDate() - 1);
        }

        const dateFormatee = date.toLocaleDateString('fr-FR', options);
        setDate(dateFormatee);

        //Tant qu'il reste une ligne à traiter alors on continue
        while (i < jsonData.length && i < nbLignesMaxATraiter){

            //Si on est à la fin de la vente cotière 1 + on vérifie si on a des données dans cotiere 1
            if (jsonData[i][0] === "TOTAL VENTE COTIERE 1 " && cotiere1.length > 0){
                console.log("Total vente cotiere 1 ")
                j++; //On passe à la cotière 2
                //On ajoute ce qui faut pour les totaux (correspondant au totaux des prévisions cotière 1)
                total.push(jsonData[i][15])
                for (let k = 1; k < jsonData[i].length - 2; k++){
                    if (jsonData[i][k] !== null){
                        let keyEspece1 = jsonData[i + 1][k];
                        keyEspece1 = keyEspece1.replace(/\n/g, '');
                        let valEspece1 = jsonData[i][k];
                        totalEspece1[keyEspece1] = valEspece1
                    }
                }
                i = i + 4
            }

            //Si on est à la fin de la vente cotière 2 + on vérifie si on a des données dans cotiere 2
            else if(jsonData[i][0] === "TOTAL VENTE COTIERE2"){
                console.log("Total vente cotiere 2 ")
                j++; //Fin des push pour les cotières 1 et 2
                //On ajoute ce qui faut pour les totaux (correspondant au totaux des prévisions cotière 2) 
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

            //Données de vente cotière 1
            else if(jsonData[i][0] != "TOTAL VENTE COTIERE 1 " && j === 0 && jsonData[i][0] !== undefined && jsonData[i][0] !== null){
                cotiere1.push(jsonData[i][0])
            } 

            //Données de vente cotière 2
            else if(jsonData[i][0] != "TOTAL VENTE COTIERE2" && jsonData[i][0] !== "TOTAL" && j === 1 && jsonData[i][0] !== undefined && jsonData[i][0] !== null){
                cotiere2.push(jsonData[i][0])
            }

            i++;
        }

    }

    /*
        if (!cotiere1 || cotiere1.length === 0 ){
    */
   /* code modifié le 9 février 
            on affiche le message si les deux ventes sont vides
   */
    if ((!cotiere1 || cotiere1.length === 0) && (!cotiere2 || cotiere2.length === 0)) {
        return <h1> Ordre de vente criée indisponible </h1>
    }

    return (
        <>
        <div className='affichageTable'>
            <h1 className='titleTable'>
                Tirage du {date}
            </h1>
            {
                cotiere2.length === 0 && cotiere1.length != 0 && (
                    <div className='affichageDoubleCotiere'>
                            <table>
                                <thead>
                                <tr>
                                        <th className='subTitle'>Numéro</th>
                                        <th className='subTitle'>Nom</th>
                                        <th className='subTitle'>Numéro</th>
                                        <th className='subTitle'>Nom</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cotiere1.slice(0, Math.ceil(cotiere1.length / 2)).map((item, index) => (
                                    <tr key={index}>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot1 }}>{index + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot1 }}>{item}</td>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot1 }}>{index + Math.ceil(numRowsCot1/2) + 1}</td>
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
                cotiere1.length === 0 && cotiere2.length != 0 && (
                    <div className='affichageDoubleCotiere'>
                            <table>
                                <thead>
                                <tr>
                                        <th className='subTitle'>Numéro</th>
                                        <th className='subTitle'>Nom</th>
                                        <th className='subTitle'>Numéro</th>
                                        <th className='subTitle'>Nom</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cotiere2.slice(0, Math.ceil(cotiere2.length / 2)).map((item, index) => (
                                    <tr key={index}>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot2 }}>{index + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot2 }}>{item}</td>
                                        <td className='colGauche' style={{ fontSize: sizeRowsCot2 }}>{index + Math.ceil(numRowsCot2/2) + 1}</td>
                                        <td className='colDroite' style={{ fontSize: sizeRowsCot2 }}>{cotiere2[index + Math.ceil(cotiere2.length / 2)]}</td>
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
                )
            }
            {
                cotiere2.length != 0 && cotiere1.length != 0 && (
                    <div className='affichageDoubleCotiere'>
                        <div className='tablesContainer'>
                            <div className='tablesGauche'>
                                <h2 className='titleCotiere'>Cotiere 1</h2>
                                <table className='tableTirage'>
                                <thead>
                                    <tr>
                                        <th className='subTitle'>Numéro</th>
                                        <th className='subTitle'>Nom</th>
                                        <th className='subTitle'>Numéro</th>
                                        <th className='subTitle'>Nom</th>
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
                                    {
                                        numRowsCot2 > 16 && (
                                            <>
                                            <thead>
                                                <tr>
                                                    <th className='subTitle'>Numéro</th>
                                                    <th className='subTitle'>Nom</th>
                                                    <th className='subTitle'>Numéro</th>
                                                    <th className='subTitle'>Nom</th>
                                                </tr>
                                                </thead>
                                            <tbody className='adjustementTable'>
                                                {cotiere2.slice(0, Math.ceil(cotiere2.length / 2)).map((item, index) => ( 
                                                    <tr className='ligneAffichageCot2' key={index}>
                                                        <td className='colGauche' style={{ fontSize: sizeRowsCot2 }}>{index + 1 }</td>
                                                        <td className='colDroite' style={{ fontSize: sizeRowsCot2 }}>{item}</td>
                                                        <td className='colGauche' style={{ fontSize: sizeRowsCot2 }}>{index + Math.ceil(numRowsCot2/2) + 1}</td>
                                                        <td className='colDroite' style={{ fontSize: sizeRowsCot2 }}>{cotiere2[index + Math.ceil(cotiere2.length / 2)]}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            </>
                                        )
                                    } 
                                    {
                                        numRowsCot2 <=16 && (
                                            <>
                                            <thead>
                                                <tr>
                                                    <th className='subTitle'>Numéro</th>
                                                    <th className='subTitle'>Nom</th>
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
                                            </>
                                        )
                                    }

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
