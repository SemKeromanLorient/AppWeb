import React, { useContext, useEffect, useState } from "react";
import {distance, closest}from 'fastest-levenshtein'
import { postToServer } from "../../utils/serverHttpCom";
import moment from "moment";
import { SortableTable } from "../../components";
import './Facturation.style.css'
import { PopupContext, ToastContext } from "../../contexts";
import { POPUP_ERROR, POPUP_QUESTION, POPUP_VALID } from "../../components/Popup/Popup";

function Facturation(){
    
    const [facture, setFacture] = useState([]);
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const {setToastOption} = useContext(ToastContext);
    const {setPopupOption} = useContext(PopupContext);

    useEffect(() => {
       
        fetchFactures()
        
    }, [endDate, startDate])


    function fetchFactures(){

        postToServer('/consommations/factures', {from: startDate+' 00:00', to: endDate+' 23:59' }, ({data}) => {

        
            let conso = [...data];
            let factures = []
            console.log(conso)
            for(let a_conso of conso){

                if(!a_conso.checked){

                    if(a_conso.kw && a_conso.kw > 0){
                        factures.push({
                            user: a_conso.user.toUpperCase(),
                            kw: conso.filter((value) => {
    
                                if(distance(a_conso.user, value.user) < 5){
    
                                    value.checked = true;
                                    return value.kw && value.kw > 0
                                
    
                                }

                                return false;
        
                            }).reduce((prev, curr) => {
                       
                                return prev + curr.kw},0)
                        })
                    }
                  
                    
                }

            }

            setFacture(factures)


        })

    }
    
    function handleMarkFactures(){


        setPopupOption({
            type: POPUP_QUESTION,
            text: 'Marqué les consommations du '+moment(startDate).format('DD/MM/YYYY')+' au '+moment(endDate).format('DD/MM/YYYY')+' comme facturées ?',
            secondaryText: 'Les lignes de consommations serons toujours disponibles à la page "consommation".',
            acceptText: 'Oui, les marquées',
            declineText: 'Non, annuler',
            onAccept: () => {

                postToServer('/consommations/mark-factures', {}, () => {

                    fetchFactures()

                    setPopupOption({
                        type: POPUP_VALID,
                        text: 'Les consommations on bien été marqué comme facturées.',
                        secondaryText: 'Les consommations sont toujours consultable dans "consommation"',
                        acceptText: 'Ok'
                    })
        
                }, () => {

                    setPopupOption({
                        type: POPUP_ERROR,
                        text: 'Impossible de marqué ces consommations',
                        secondaryText: 'Merci de prévenir le service SI.',
                        acceptText: 'Ok'
                    })


                })

            }
        })
        

        

    }

    useEffect(() => {
        document.title = 'Supervision | Facturation'
    }, [])
    
    return <div className="conso-container">

    <div className="filter-section">

        {facture.length > 0 && <div className="search-section">

        <input onClick={handleMarkFactures} type={'button'} className="confirm-facture" value={'valider la facturation'} />


        </div>}

    </div>


        <SortableTable data={facture} 
        emptyMessage={'Aucune consommation disponible sur cette période.'}
        header={[
            {label: "Bateau/entreprise", column: 'user'},
            {label: 'Kw/h', column: 'kw', onDoubleClick: () => {
                setToastOption({
                    text: 'Copié dans le presse papier'
                })
            }}
        ]} />
    </div>
}

export default Facturation;