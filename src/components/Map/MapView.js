
import React, { useContext, useEffect, useState } from 'react';
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl,
    Source,
    Layer
  } from 'react-map-gl';
import "mapbox-gl/src/css/mapbox-gl.css"
import "./MapView.style.css";
import BornePin from './BornePin'
import { useGeolocated } from 'react-geolocated';
import {ReactComponent as PinIcon} from '../../assets/icons/user.svg';
import { ThemeContext } from '../../contexts';

function MapView({bornes, setCurrentSelected, currentlySelected}){

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
      positionOptions: {
          enableHighAccuracy: true,
      },
      watchPosition: true,
      suppressLocationOnMount: false,
      userDecisionTimeout: 5000,
  });

    const {theme} = useContext(ThemeContext);

    const layer3D = {
      'id': 'add-3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      "icon-size": ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 0.5],
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
      'fill-extrusion-color': '#aaa',
       

      'fill-extrusion-height': 20,
      'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
      ],
     
      'fill-extrusion-opacity': 0.6,
    
      }
    }

    return <>
          <Map
          initialViewState={{
            latitude: 47.728915,
            longitude: -3.366080,
            zoom: 16,
            bearing: 0,
            pitch: 50
          }}
          style={{width: "100%", height: "100%"}}
          className="map-view"
          mapStyle={(theme === 'light-theme'? 'mapbox://styles/mapbox/light-v10' : 'mapbox://styles/mapbox/dark-v10')}
          attributionControl={false}
          terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
          >
             <Layer {...layer3D} />

      {bornes.map((borne, index) => {
        
        return <Marker
          key={`marker-${index}`}
          longitude={borne.longitude}
          latitude={borne.latitude}
          anchor="bottom"
        >
          <BornePin index={index} currentlySelected={currentlySelected} onClick={setCurrentSelected} borne={borne}/> 

        </Marker>

        })}

          </Map>
  
          </>
}
    




  export default MapView;