import React, { useEffect, useState } from 'react';
import "./Meteo.css"; 
//import 'bootstrap/dist/css/bootstrap.min.css';
//import {currentDayMeteo, getDataMeteo} from "../../utils/apiExtern";
import {ReactComponent as KeromanIcon} from "../../assets/icons/Logo_SEM_Keroman.svg"
import { ReactComponent as ArrowIcon } from "../../assets/icons/fleche.svg";

function Meteo({data,dataMarine,dataWind}){

    useEffect( () => {
        console.log("TEST DoubleUseEffect")
    },[])

    if (!data || !dataMarine || !dataWind) {
        // Gérez le cas où les données météo ne sont pas encore disponibles
        return <div>Chargement des données météo...</div>;
    }


    const options = { weekday: 'long', month: 'short',day: 'numeric' };
    const date1 = new Date(data.list[0].dt * 1000);
    const formattedDate1 = date1.toLocaleDateString("fr-FR", options);
    const date2 = new Date(data.list[1].dt * 1000);
    const formattedDate2 = date2.toLocaleDateString("fr-FR", options);
    const date3 = new Date(data.list[2].dt * 1000);
    const formattedDate3 = date3.toLocaleDateString("fr-FR", options);
    const date4 = new Date(data.list[3].dt * 1000);
    const formattedDate4 = date4.toLocaleDateString("fr-FR", options);
    const date5 = new Date(data.list[4].dt * 1000);
    const formattedDate5 = date5.toLocaleDateString("fr-FR", options);
    const date6 = new Date(data.list[5].dt * 1000);
    const formattedDate6 = date6.toLocaleDateString("fr-FR", options);


    const dataVague = dataMarine.hourly.wave_height;
    const dataHoule = dataMarine.hourly.swell_wave_height;

    //Sépare les valeurs de la hauteur des vagues en jour
    const dataVagueTabs = splitEnTableaux(dataVague)

    const dataVagueJ1 = dataVagueTabs[0];
    const dataVagueJ2 = dataVagueTabs[1];
    const dataVagueJ3 = dataVagueTabs[2];
    const dataVagueJ4 = dataVagueTabs[3];
    const dataVagueJ5 = dataVagueTabs[4];
    const dataVagueJ6 = dataVagueTabs[5];
    
    //Moyenne des vagues

    const m1Vague = calculerMoyenne(dataVagueJ1);
    const m2Vague = calculerMoyenne(dataVagueJ2);
    const m3Vague = calculerMoyenne(dataVagueJ3);
    const m4Vague = calculerMoyenne(dataVagueJ4);
    const m5Vague = calculerMoyenne(dataVagueJ5);
    const m6Vague = calculerMoyenne(dataVagueJ6);

    //Sépare les valeurs de la hauteur de la houle en jour
    const dataHouleTabs = splitEnTableaux(dataHoule)

    const dataHouleJ1 = dataHouleTabs[0];
    const dataHouleJ2 = dataHouleTabs[1];
    const dataHouleJ3 = dataHouleTabs[2];
    const dataHouleJ4 = dataHouleTabs[3];
    const dataHouleJ5 = dataHouleTabs[4];
    const dataHouleJ6 = dataHouleTabs[5];

    // Moyenne de la houle

    const m1Houle = calculerMoyenne(dataHouleJ1);
    const m2Houle = calculerMoyenne(dataHouleJ2);
    const m3Houle = calculerMoyenne(dataHouleJ3);
    const m4Houle = calculerMoyenne(dataHouleJ4);
    const m5Houle = calculerMoyenne(dataHouleJ5);
    const m6Houle = calculerMoyenne(dataHouleJ6);

    // Rotation des images en fonction du vent
/*
    const arrowImages1 = document.getElementsByClassName("arrow-1");
    arrowImages1[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;

    const arrowImages2 = document.getElementsByClassName("arrow-2");
    arrowImages2[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;
    
    const arrowImages3 = document.getElementsByClassName("arrow-3");
    arrowImages3[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;

    const arrowImages4 = document.getElementsByClassName("arrow-4");
    arrowImages4[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;

    const arrowImages5 = document.getElementsByClassName("arrow-5");
    arrowImages5[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;

    const arrowImages6 = document.getElementsByClassName("arrow-6");
    arrowImages6[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;

    const arrowImages7 = document.getElementsByClassName("arrow-7");
    arrowImages7[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`;

    const arrowImages8 = document.getElementsByClassName("arrow-8");
    arrowImages8[0].style.transform = `rotate(${dataWind.hourly.winddirection_10m[0]}deg)`; */
    //TEST direction du vent

    //console.log("Info data " + JSON.stringify(data.list[1].deg))
    //console.log("TEST DIRECTION VENT : " + degreValToString(data.list[1].deg))


    const formatTime = (time) => {
        const date = new Date(time * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}h${minutes}`;
      };

    const formattedSunrise = formatTime(data.list[0].sunrise);
    const formattedSunset = formatTime(data.list[0].sunset);

    return (<div className="container meteo-container">

        <div className='row division-3-1'>

            <div className="row first-row">
                <div className='col-md-12'>
                    <h1 className='title-meteo'>Météo marine cotière - Penmarc'h / Anse de l'Aiguillon</h1>
                </div>
                <div className='col-md-12'>
                    <h1 className='text-date-jour'><strong>{formattedDate1}</strong></h1>
                </div>
            </div>
            <div className='row'></div>
            <div className='row second-row'>
                <div className='col'>
                    <KeromanIcon />
                </div>
                <div className='col'>
                    <div className='row'>
                        <h2 className='text-meteo-jour'> <strong> Vent : </strong>{degreValToString(data.list[0].deg)} {(data.list[0].speed * 3.6).toFixed(0)} Km/h ( BFT : {echelleBeaufort(data.list[0].speed * 3.6)[1]})</h2>
                        <h2 className='text-meteo-jour'> <strong> Vague : </strong>{echelleDouglas(m1Vague)[0]} ({echelleDouglas(m1Vague)[1]})</h2>
                        <h2 className='text-meteo-jour'><strong> Lever du soleil : </strong>{formattedSunrise}</h2>
                    </div>
                </div>
                
                <div className='col'>
                    <img src={`http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`} className="icone-meteo" alt="Weather Icon" />
                </div>

                <div className='col'>
                    <div className='row'>
                        <h2 className='text-meteo-jour'><strong>Température : </strong>  {(data.list[0].temp.day).toFixed(0)} °C</h2>
                        <h2 className='text-meteo-jour'> <strong> Houle : </strong> {degreValToString(dataMarine.daily.swell_wave_direction_dominant[0])} { parseFloat(m1Houle).toFixed(0)} m</h2>
                        <h2 className='text-meteo-jour'><strong> Coucher du soleil : </strong>{formattedSunset}</h2>
                    </div>
                </div>
                <div className='col'>
                    <KeromanIcon />
                </div>

            </div>

            <div className='row third-row'>
                <table className='wind-table'>
                    <thead>
                        <tr>
                            <th>Heure local</th>
                            <th>02h</th>
                            <th>05h</th>
                            <th>08h</th>
                            <th>11h</th>
                            <th>14h</th>
                            <th>17h</th>
                            <th>20h</th>
                            <th>23h</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th> Direction du vent</th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[1]}deg)`}} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[4]}deg)`}} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[7]}deg)`}}/></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[10]}deg)`}}/></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[13]}deg)`}}/></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[16]}deg)`}}/></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[19]}deg)`}}/></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataWind.hourly.winddirection_20m[22]}deg)`}}/></th>

                        </tr>
                        <tr>
                            <th>Vitesse du vent (km/h)</th>
                            <th>{dataWind.hourly.windspeed_20m[1].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[4].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[7].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[10].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[13].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[16].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[19].toFixed(0)}</th>
                            <th>{dataWind.hourly.windspeed_20m[22].toFixed(0)}</th>
                        </tr>
                        <tr>
                            <th>Rafale du vent (km/h)</th>
                            <th>{dataWind.hourly.windgusts_10m[1].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[4].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[7].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[10].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[13].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[16].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[19].toFixed(0)}</th>
                            <th>{dataWind.hourly.windgusts_10m[22].toFixed(0)}</th>
                        </tr>
                        <tr>
                            <th>Direction des vagues</th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[1]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[4]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[7]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[10]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[13]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[16]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[19]}deg)` }} /></th>
                            <th><ArrowIcon  className="arrow" style={{ transform: `rotate(${dataMarine.hourly.wave_direction[22]}deg)` }} /></th>
                        </tr>
                    </tbody>
                </table>
            </div>



        </div>

        <div className='row division-3-2'>

            <div className="row first-row">
                <div className='col-md-12'>
                    <h1 className='title-sect' ><strong>Prévision</strong></h1>
                </div>
            </div>

            <div className='row'style={{marginTop:'-60px'}}>
                <div className='col'>
                    <div className='row'>
                        <h1>{formattedDate2}</h1>
                    </div>
                    <img src={`http://openweathermap.org/img/w/${data.list[1].weather[0].icon}.png`} className="icone-meteo" alt="Weather Icon" />
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Température : </strong> {(data.list[1].temp.day).toFixed(0)} °C</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Vent : </strong>{degreValToString(data.list[1].deg)} {(data.list[1].speed * 3.6).toFixed(0)} Km/h ( BFT : {echelleBeaufort(data.list[1].speed * 3.6)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Vague : </strong>{echelleDouglas(m2Vague)[0]} ({echelleDouglas(m2Vague)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Houle : </strong> {degreValToString(dataMarine.daily.swell_wave_direction_dominant[1])} { parseFloat(m2Houle).toFixed(0)} m</h3>
                    </div>
                </div>
                <div className='col'>
                    <h1>{formattedDate3}</h1>
                    <img src={`http://openweathermap.org/img/w/${data.list[2].weather[0].icon}.png`} className="icone-meteo" alt="Weather Icon" />
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Température : </strong> {(data.list[2].temp.day).toFixed(0)} °C</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Vent : </strong>{degreValToString(data.list[2].deg)} {(data.list[2].speed * 3.6).toFixed(0)} Km/h ( BFT : {echelleBeaufort(data.list[2].speed * 3.6)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Vague : </strong>{echelleDouglas(m3Vague)[0]} ({echelleDouglas(m3Vague)[1]})</h3>
                    </div>
                    <div className='row'>
                    <h3 className='text-meteo-prevision'> <strong> Houle : </strong> {degreValToString(dataMarine.daily.swell_wave_direction_dominant[2])} { parseFloat(m3Houle).toFixed(0)} m</h3>
                    </div>
                </div>
                <div className='col'>
                    <h1>{formattedDate4}</h1>
                    <img src={`http://openweathermap.org/img/w/${data.list[3].weather[0].icon}.png`} className="icone-meteo" alt="Weather Icon" />
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Température : </strong> {(data.list[3].temp.day).toFixed(0)} °C</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Vent : </strong>{degreValToString(data.list[3].deg)} {(data.list[3].speed * 3.6).toFixed(0)} Km/h ( BFT : {echelleBeaufort(data.list[3].speed * 3.6)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Vague : </strong>{echelleDouglas(m4Vague)[0]} ({echelleDouglas(m4Vague)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Houle : </strong> {degreValToString(dataMarine.daily.swell_wave_direction_dominant[3])} { parseFloat(m4Houle).toFixed(0)} m</h3>
                    </div>
                </div>
                <div className='col'>
                    <h1>{formattedDate5}</h1>
                    <img src={`http://openweathermap.org/img/w/${data.list[4].weather[0].icon}.png`} className="icone-meteo" alt="Weather Icon" />
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Température : </strong> {(data.list[4].temp.day).toFixed(0)} °C</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Vent : </strong>{degreValToString(data.list[4].deg)} {(data.list[4].speed * 3.6).toFixed(0)} Km/h ( BFT : {echelleBeaufort(data.list[4].speed * 3.6)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Vague : </strong>{echelleDouglas(m5Vague)[0]} ({echelleDouglas(m5Vague)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Houle : </strong> {degreValToString(dataMarine.daily.swell_wave_direction_dominant[4])} { parseFloat(m5Houle).toFixed(0)} m</h3>
                    </div>
                </div>
                <div className='col'>
                    <h1>{formattedDate6}</h1>
                    <img src={`http://openweathermap.org/img/w/${data.list[5].weather[0].icon}.png`} className="icone-meteo" alt="Weather Icon" />
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Température : </strong> {(data.list[5].temp.day).toFixed(0)} °C</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'><strong>Vent : </strong>{degreValToString(data.list[5].deg)} {(data.list[5].speed * 3.6).toFixed(0)} Km/h ( BFT : {echelleBeaufort(data.list[5].speed * 3.6)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Vague : </strong>{echelleDouglas(m6Vague)[0]} ({echelleDouglas(m6Vague)[1]})</h3>
                    </div>
                    <div className='row'>
                        <h3 className='text-meteo-prevision'> <strong> Houle : </strong> {degreValToString(dataMarine.daily.swell_wave_direction_dominant[5])} { parseFloat(m6Houle).toFixed(0)} m</h3>
                    </div>
                </div>
            </div>

        </div>

    </div>
    )


}

/*
        <div className='row division-3-3'>
            <h1 className='title-sect'>
                <strong>Marée</strong>
            </h1>
        </div>
*/
function echelleDouglas(valeur) {
    
    if (valeur === 0){
        return ["Calme",0]
    } else if (valeur > 0 && valeur <= 0.1) {
      return ["Ridée", 1];
    } else if (valeur > 0.1 && valeur <= 0.5) {
      return ["Belle", 2];
    } else if (valeur > 0.5 && valeur <= 1.25) {
      return ["Peu agitée", 3];
    } else if (valeur > 1.25 && valeur <= 2.5) {
      return ["Agitée", 4];
    } else if (valeur > 2.5 && valeur <= 4) {
      return ["Forte", 5];
    } else if (valeur > 4 && valeur <= 6) {
      return ["Très forte", 6];
    } else if (valeur > 6 && valeur <= 9) {
      return ["Grosse", 7];
    } else if (valeur > 9 && valeur <= 14) {
      return ["Très grosse", 8];
    } else if (valeur > 14) {
      return ["Énorme", 9];
    } else {
      return ["Valeur invalide", null];
    }

}

function echelleBeaufort(valeur) {

    if (valeur === 0) {
      return ["Calme", 0];
    } else if (valeur >= 1 && valeur < 6) {
      return ["Très légère brise", 1];
    } else if (valeur >= 6 && valeur < 12) {
      return ["Légère brise", 2];
    } else if (valeur >= 12 && valeur < 20) {
      return ["Petite brise", 3];
    } else if (valeur >= 20  && valeur < 29) {
      return ["Jolie brise", 4];
    } else if (valeur >= 29 && valeur < 39) {
      return ["Bonne brise", 5];
    } else if (valeur >= 39 && valeur < 50) {
      return ["Vent frais", 6];
    } else if (valeur >= 50 && valeur < 62) {
      return ["Grand frais", 7];
    } else if (valeur >= 62 && valeur < 75) {
      return ["Coup de vent", 8];
    } else if (valeur >= 75 && valeur < 89) {
        return ["Fort coup de vent", 9];
    } else if (valeur >= 89 && valeur < 103) {
        return ["Tempête", 10];
    } else if (valeur >= 103 && valeur < 118) {
        return ["Violente tempête", 11];
    } else if (valeur >= 118) {
        return ["Ouragan", 12];
    } else {
      return ["Valeur invalide", null];
    }

}

function degreValToString(degre){

    const directions = [
        "SUD", "SO", "OUEST", "NO",
        "NORD", "NE", "EST", "SE"
      ];
    
      const angle = ((degre % 360) + 360) % 360;
      const index = Math.round(angle / 45) % 8;
      return directions[index];
}

function calculerMultipleMoyenne(tableau) {

    if (tableau.length === 0) {
      return []; // Retourne 0 si le tableau est vide
    }
    
    var moyennes = [];
    var nbJour = Math.floor(tableau.length / 24); // Nombre entier de jours complets
    console.log("TEST NBJour : " + nbJour)

    for(let j = 0; j < nbJour; j++){

        var somme = 0;

        for (var i = j * 24; i < (j + 1) * 24; i++) {
            somme += tableau[i];
        }

        var moyenne = (somme / 24).toFixed(2);
        moyennes.push(moyenne);
    }
    
    
    return moyennes;  
}

function calculerMoyenne(tableau) {
    if (tableau.length === 0) {
      return 0; // Retourne 0 si le tableau est vide
    }
    
    var somme = 0;
    for (var i = 0; i < tableau.length; i++) {
      somme += tableau[i];
    }
    
    var moyenne = (somme / tableau.length).toFixed(2);
    return moyenne;
  }
  

function splitEnTableaux(tableau){
    var tableauxResultants = [];
    var nbSousTableaux = Math.ceil(tableau.length / 24); // Nombre de sous-tableaux nécessaires
  
    for (var i = 0; i < nbSousTableaux; i++) {
        var debut = i * 24;
        var fin = (i + 1) * 24;
        var sousTableau = tableau.slice(debut, fin);
        tableauxResultants.push(sousTableau);
    }
  
    return tableauxResultants;
    
}


export default Meteo;