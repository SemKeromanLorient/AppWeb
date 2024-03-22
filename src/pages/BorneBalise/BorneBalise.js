import "./BorneBalise.style.css"
import React, { useContext, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import {ReactComponent as AddIcon} from '../../assets/icons/plus.svg';
import {ReactComponent as ArrowIcon} from '../../assets/icons/arrow.svg';
import {ReactComponent as ZoneIcon} from '../../assets/icons/pin.svg';
import {ReactComponent as BorneIcon} from '../../assets/icons/electrical.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/trash.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';
import {ReactComponent as HiddenIcon} from '../../assets/icons/hidden.svg';
import {ReactComponent as PropertyIcon} from '../../assets/icons/setting.svg';



import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl,
    Source,
    LineLayer,
    Layer
  } from 'react-map-gl';
import "mapbox-gl/src/css/mapbox-gl.css";
import {BornePin, ZonePin} from "./Balise";
import { postToServer } from "../../utils/serverHttpCom.js";
import { ContextMenuContext, PopupContext, ThemeContext } from "../../contexts";
import { POPUP_QUESTION, POPUP_VALID } from "../../components/Popup/Popup";

const DEFAULT_POSITION = {
    latitude: 47.728915,
    longitude: -3.366080
}

function BorneBalise(){



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
  
    const [bornes, setBornes] = useState([]);
    const [zones, setZones] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [boorneNumberInput, setBorneNumberInput] = useState('');  
    const {setContextMenuOption} = useContext(ContextMenuContext);
    const {setPopupOption} = useContext(PopupContext);
    const {theme} = useContext(ThemeContext);
    useEffect(() => {

        postToServer('/bornes/positions', {}, ({data}) => {

            let bornes = data;

            postToServer('/zones/', {}, ({data}) => {

                let zones = data;

                setBornes(bornes.map(borne => {return {
                    name: borne.borne_number, 
                    zone: borne.zone,
                    enable: borne.enable,
                    position: {
                        latitude: borne.latitude,
                        longitude: borne.longitude
                }}}))

                setZones(zones.map(zone => {return {
                    _id: zone._id,
                    sub_of: zone.sub_of,
                    name: zone.name, 
                    position: {
                        latitude: zone.latitude,
                        longitude: zone.longitude
                }}}))

            })

           

        },

        (err) => {



        })

    }, [])

    function handleAddNew(zone){

        let tmp = [...bornes];

        tmp.push({name: 'Sans nom', position: defaultPosition, zone: zone})

        setBornes(tmp);
    }

    function handleValid(){
        
        console.log('click')


        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Etes-vous sur de vouloir enregistrer les modification ?',
            acceptText: 'Oui, je suis sur',
            declineText: 'Non, annuler',
            onAccept: () => {

                postToServer('/bornes/positions/update', {
                    bornes,
                    zones
                }, () => {
        


                    setPopupOption({
                        type: POPUP_VALID,
                        text: 'Les modifications ont bien été enregistré !',
                        acceptText: 'Ok'
                    })
        
                })

            }
        })

        
    }


    function addNewRootZone(){

        let zonesTmp = [...zones];

        zonesTmp.push({
            name: 'Sans nom',
            focus: true,
            sub_of: null,
            _id: Math.floor(Math.random() * 9999),
            position: DEFAULT_POSITION
        })

        setZones(zonesTmp);
    }


    return <>
       
        <div className="borne-balise-container">

            <Map
                initialViewState={{
                    latitude: 47.728915,//port de peche
                    longitude: -3.366080,
                    zoom: 16,
                    bearing: 0,
                    pitch: 50
                }}
                style={{width: "100%", height: "100%"}}
                className="map-view"
                mapStyle={(theme === 'light-theme'? 'mapbox://styles/mapbox/light-v10' : 'mapbox://styles/mapbox/dark-v10')}
                attributionControl={false}
                terrain={{source: 'mapbox-dem', exaggeration: 1.5}}>


                <Layer {...layer3D} />

                {bornes.map((borne, index) => {
                    if(borne)return <BornePin borne={borne} key={index} bornes={bornes} setBornes={setBornes} /> 
                    else return null;
                })}



                {zones.map((zone, index) => {
                    if(zone)return <ZonePin key={index} zones={zones} zone={zone} setZones={setZones} position={zone.position} /> 
                    else return null;
                })}


                <Source id="zones-connection" type="geojson" data={ 
                    
                    {
                        type: "Feature",
                        properties: {},
                        geometry: {
                          type: "LineString",
                          coordinates: [
                            [47.758915, -3.386080],
                            [47.728915, -3.376080],
                          ]
                        }
                      }
                    
                    
                }>
                    <Layer
                      id="lineLayer"
                      type="line"
                      source="zones-connection"
                      layout={{
                        "line-join": "round",
                        "line-cap": "round"
                      }}
                      paint={{
                        "line-color": "rgba(255,255,255, 0.8)",
                        "line-width": 2
                      }}
                       
                    />

                </Source>
               
                <div className="borne-manage-header">


                    <div className="list-container">

                        {zones.filter((a_zone) => !a_zone.sub_of).map((zone, index) => <ZoneMenu setContextMenuOption={setContextMenuOption} currentSelected={currentSelected}  setCurrentSelected={setCurrentSelected} setBornes={setBornes} setZones={setZones} key={index} zone={zone} bornes={bornes} zones={zones} />)}
                        <div onClick={addNewRootZone} className="add-zone-btn">
                            <h4>Ajouter une zone racine</h4>
                        </div>
                    </div>

                    <div className="control-input">
                        <input className="valid-modif" onClick={handleValid} type={'button'}  value={'Valider les modifications'}/>
                    </div>

                </div>


            </Map>


           

        
        </div>

        
        
    
        </>

}



function ZoneMenu({setBornes,  setCurrentSelected, currentSelected,  setZones, bornes, zones, zone}) {

    const [expanded, setExpanded] = useState(false);
    const [edit, setEdit]  =useState(false);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [canBeDrop, setCanBeDrop] = useState(false);
    const [addFormOpen, setFormOpen] = useState(false);

    function handleExpand(){
        setExpanded(!expanded);
    }

    const {setPopupOption} = useContext(PopupContext);
    const {setContextMenuOption} = useContext(ContextMenuContext);


    function handleOpenAddMenu(){

        setAddMenuOpen(!addMenuOpen);

    }

    function handleDeleteZone(){

        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Supprimer la zone '+zone.name,
            secondaryText: 'Toute les bornes serons '+(zones.find((val) => val._id === zone.sub_of)? 'déplassées vers '+zones.find((val) => val._id === zone.sub_of).name : 'supprimées de la liste' ),
            acceptText: 'Oui, supprimer la zone',
            declineText: 'Non, annuler',
            onAccept: () => {


                if(zone.sub_of){
                    setBornes([...bornes].map((borne) => {

                        if(borne.zone === zone._id){
    
                            if(zone.sub_of){
                                borne.zone = zones.find((val) => val._id === zone.sub_of)._id;
                            }
    
                        }
    
                        return borne;
                    }))
                }else{

                    setBornes([...bornes].filter((borne) => {
                        return borne.zone !== zone._id
                    }))

                }

               
                setZones([...zones].filter((a_zone) => a_zone._id !== zone._id))


            }
        })

    }

    

    function showContextMenu(event){
        event.preventDefault();


        setExpanded(true)

        setContextMenuOption({
            position: {
                x: event.clientX,
                y: event.clientY
            },
            menuItems: [
                {
                    Icon: AddIcon,
                    text: "Ajouter",
                    subMenu: [
                        {
                            Icon: ZoneIcon,
                            text: "Zone",
                            onClick: () => {
                                
                                setExpanded(true);

                                let zonesTmp = [...zones]

                                zonesTmp.push({
                                    name: 'Sans nom',
                                    focus: true,
                                    position: DEFAULT_POSITION,
                                    _id: Math.floor(Math.random() * 9999),
                                    sub_of: zone._id
                                })

                                setZones(zonesTmp)


                            }
                        },
                        {
                            Icon: BorneIcon,
                            text: "Borne",
                            onClick: () => {
                                
                                

                                let bornesTmp = [...bornes]

                                bornesTmp.push({
                                    name: 'Sans nom',
                                    focus: true,
                                    enable: 1,
                                    position: DEFAULT_POSITION,
                                    zone: zone._id
                                })

                                setBornes(bornesTmp)



                            }
                        },
                    ]
                },
                {
                    text: "Déplacer vers",
                    subMenu: [...zones.map((a_zone) => {
                        return {
                            text: a_zone.name,
                            onClick: () => {
                                setPopupOption({

                                    type: POPUP_QUESTION,
                                    text: 'Déplacer vers '+a_zone.name,
                                    secondaryText: 'ça position sur la carte ne changera pas.',
                                    acceptText: 'Oui, la déplacer',
                                    declineText: 'Non, annuler',
                                    onAccept: () => {
    
                                        setZones([...zones].filter((c_zone) => c_zone !== zone).map((b_zone) => {
    
                                            if(b_zone._id === zone._id){
                                                b_zone.sub_of = a_zone._id;
                                            }
    
                                            return b_zone;
                                        }))
    
                                    }
    
                                })
                            }
                        }
                    }), {
                        text: 'à la base',
                        onClick: () => {
                           
                            setPopupOption({

                                type: POPUP_QUESTION,
                                text: 'Déplacer la zone à la base de la liste',
                                secondaryText: 'ça position sur la carte ne changera pas.',
                                acceptText: 'Oui, la déplacer',
                                declineText: 'Non, annuler',
                                onAccept: () => {

                                    setZones([...zones].map((a_zone) => {

                                        if(a_zone._id === zone._id){
                                            a_zone.sub_of = null;
                                        }

                                        return a_zone;
                                    }))

                                }

                            })

                        }
                    }]
                },
                {
                    Icon: DeleteIcon,
                    text: "Supprimer",
                    onClick: () => {
                        setPopupOption({

                            type: POPUP_QUESTION,
                            text: 'Supprimer la zone '+zone.name,
                            secondaryText: 'Elle ne sera plus disponible dans la zone.',
                            acceptText: 'Oui, la supprimer',
                            declineText: 'Non, annuler',
                            onAccept: () => {

                                setZones([...zones].filter((a_zone) => a_zone !== zone))

                            }

                        })




                    }
                },
                {
                    Icon: EditIcon,
                    text: "Renommer",
                    onClick: () => {

                        setZones([...zones].map((b_zone) => {
    
                            if(b_zone._id === zone._id){
                               
                                b_zone.focus = true;

                            }

                            return b_zone;
                        }))

                    }
                },
                {   
                    Icon: PropertyIcon,
                    text: "Propriétés",
                    onClick: () => {
                        
                    }
                }
            ]

        })


    }


    useEffect(() => {

        setEdit(!!zone.focus)

    }, [zones])

    function onChange({target}){

        setZones([...zones].map((a_zone) => {

            if(a_zone._id === zone._id){
                a_zone.name = target.value;
            }
            
            return a_zone;

        }))

    }

    function validName(event){

        if(event.keyCode === 13){//enter

            clearNameFocus();

        }
    }

    


    function clearNameFocus(){
        setZones([...zones].map((a_zone) => {

            if(a_zone._id === zone._id){
                a_zone.focus = false;
            }
            
            return a_zone;

        }))
    }

    return <>

    {<form className="add-form">

        <h4>Numéro à afficher ou nom</h4>
        <input type={"text"} placeholder={"Ex: 5, 6 (Act.)..."} />

        <h4>Numéro réel de la borne</h4>
        <input type={"text"} placeholder={"Ex: 5, 32, 45..."} />

    </form>}



    <div className={"zone-container "+(expanded? "expand " : " ")}>

        <div  onContextMenu={showContextMenu} className="zone-title">

            <div className="data-info">
                <ArrowIcon onClick={handleExpand} className={"expand-icon " + (expanded? 'expand' : '')} />
                <ZoneIcon className={"zone-icon"}/>
                {!edit? <h4>{zone.name}</h4>:
                <input onBlur={clearNameFocus} onKeyDown={validName} aria-selected autoFocus onChange={onChange} value={zone.name} />}
                <h5>Zone</h5>
            </div>
           
        </div>


        <div className="sub-data">
            {bornes.filter((borne, index) => borne.zone === zone._id).map((borne, index) => <BorneRow setBornes={setBornes} zones={zones} setContextMenuOption={setContextMenuOption} currentSelected={currentSelected}  setCurrentSelected={setCurrentSelected} borne={borne} key={index} bornes={bornes} />)}

            {zones.filter((a_zone) => a_zone.sub_of === zone._id).map((zone, index) => <ZoneMenu setContextMenuOption={setContextMenuOption} currentSelected={currentSelected}  setCurrentSelected={setCurrentSelected} setZones={setZones} setBornes={setBornes} key={index} zone={zone} zones={zones} bornes={bornes}/>)}
        </div>
     

    </div>
    </>



}


function BorneRow({bornes, zones, setCurrentSelected, currentSelected, setBornes, borne}){

    const {setPopupOption} = useContext(PopupContext);
    const {setContextMenuOption} = useContext(ContextMenuContext);
    const [edit,setEdit] = useState(false);

    function handleDeleteBorne(){

        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Supprimer la borne '+borne.name,
            secondaryText: 'La borne n\'apparaitra plus sur la carte',
            acceptText: 'Oui, supprimer la borne',
            declineText: 'Non, annuler',
            onAccept: () => {


                setBornes([...bornes].filter((a_borne) => {
                    return a_borne.name !== borne.name;
                }))
               


            }
        })

    }


    function showContextMenu(event){
        event.preventDefault();

        setContextMenuOption({
            position: {
                x: event.clientX,
                y: event.clientY
            },
            menuItems: [
                {
                    Icon: null,
                    text: "Déplacer vers",
                    subMenu: zones.filter((zone) => zone._id !== borne.zone).map((a_zone) => {
                        return {
                            text: a_zone.name,
                            onClick: () => {
                                
                                setPopupOption({

                                    type: POPUP_QUESTION,
                                    text: 'Déplacer l0 borne '+borne.name+ ' vers '+a_zone.name,
                                    secondaryText: 'ça position sur la carte ne changera pas.',
                                    acceptText: 'Oui, la déplacer',
                                    declineText: 'Non, annuler',
                                    onAccept: () => {

                                        setBornes([...bornes].map((a_borne) => {

                                            if(a_borne.name === borne.name && a_borne.zone === borne.zone){
                                                a_borne.zone = a_zone._id
                                            }

                                            return a_borne;
                                        }))

                                    }

                                })


                            }
                        }
                    })
                },
                {
                    Icon: DeleteIcon,
                    text: "Supprimer",
                    onClick: () => {

                        setPopupOption({

                            type: POPUP_QUESTION,
                            text: 'Supprimer la borne '+borne.name,
                            secondaryText: 'Elle sera supprimer de la liste.',
                            acceptText: 'Oui, la supprimer',
                            declineText: 'Non, annuler',
                            onAccept: () => {

                                setBornes([...bornes].filter((a_borne) => {
                                    return a_borne !== borne;
                                }))

                            }

                        })

                        
                    }
                },
                {
                    Icon: EditIcon,
                    text: "Renommer",
                    onClick: () => {

                        setBornes([...bornes].map((a_borne) => {
    
                            if(a_borne === borne){
                               
                                a_borne.focus = true;

                            }

                            return a_borne;
                        }))

                    }
                },
                {
                    Icon: HiddenIcon,
                    text: (borne.enable == 1? "Désactiver" : "Activer"),
                    onClick: () => {


                        setBornes([...bornes].map((a_borne) => {
    
                            console.log(a_borne, borne)
                            

                            if(a_borne === borne){
                               
                                a_borne.enable = borne.enable == 1? 0 : 1;

                            }

                            return a_borne;
                        }))

                    }
                }
            ]

        })


    }

    useEffect(() => {

        setEdit(!!borne.focus)

    }, [bornes])

    function onChange({target}){

        setBornes([...bornes].map((a_borne) => {

            if(a_borne === borne){
                a_borne.name = target.value;
            }
            
            return a_borne;

        }))

    }

   
    function validName(event){

        if(event.keyCode === 13){//enter

            clearNameFocus();

        }
    }

    


    function clearNameFocus(){
        setBornes([...bornes].map((a_borne) => {

            if(a_borne === borne){
                a_borne.focus = false;
            }
            
            return a_borne;

        }))
    }

    return <div onContextMenu={showContextMenu} className={"borne-title selected "}>

            <div className="data-info">
                <BorneIcon className={"zone-icon"} />
                {!edit? <h4>{borne.name}</h4>:
                <input onBlur={clearNameFocus} onKeyDown={validName} aria-selected autoFocus onChange={onChange} value={borne.name} />}
                <h5>Borne</h5>
            </div>
        

    </div>
}

export default BorneBalise;