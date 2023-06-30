const API_KEY = "ee07e2bf337034f905cde0bdedae3db8";

function currentDayMeteo(onSuccess,onError){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=47.728886&lon=-3.366039&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(onSuccess)
    .catch(onError)
}

function getDataMeteoDays(days,onSuccess,onError){
    if (days > 0){
        fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=47.728886&lon=-3.366039&cnt=${days}&appid=${API_KEY}&units=metric`)    
        .then(response => response.json())
        .then(onSuccess)
        .catch(onError)
    }
    
}


function getDataMeteoMarine(start_date,end_date,onSuccess,onError){
    if(start_date && end_date)
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=47.728886&longitude=-3.366039&hourly=wave_height,swell_wave_height,wave_direction&daily=swell_wave_direction_dominant&length_unit=metric&start_date=${start_date}&end_date=${end_date}&timezone=auto`) 
        .then(response => response.json())
        .then(onSuccess)
        .catch(onError)
    
}


function getDataWind(onSuccess,onError){
    //https://api.open-meteo.com/v1/forecast?latitude=47.728886&longitude=-3.366039&hourly=winddirection_20m,windspeed_20m
    //https://api.open-meteo.com/v1/meteofrance?latitude=47.728886&longitude=-3.3664&hourly=windspeed_20m,winddirection_20m,windgusts_10m
    fetch(`https://api.open-meteo.com/v1/meteofrance?latitude=47.728886&longitude=-3.3664&hourly=windspeed_20m,winddirection_20m,windgusts_10m`) 
        .then(response => response.json())
        .then(onSuccess)
        .catch(onError)
}

function getTideData(location, days, onSuccess, onError) {
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = `https://api.tideschart.com/api/v1/tides?key=${apiKey}&place=${location}&days=${days}`;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then(onSuccess)
      .catch(onError);
  }
  

export {currentDayMeteo, getDataMeteoDays, getDataMeteoMarine, getDataWind}