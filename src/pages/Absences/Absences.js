import React, { useEffect, useState } from "react";
import "./Absences.style.css";
import Calendar from 'react-calendar';
import moment from "moment";
//import 'react-calendar/dist/Calendar.css';
import {ReactComponent as AbsentIcon} from '../../assets/icons/absent.svg';
import { SortableTable } from "../../components";
import { getAuthorizationFor } from "../../utils/storageUtil";

function Absences(){


    return <div className="absent-container">
        
        <div className="abs-header">

            <div className="left-section">

                <h4>Envoyées</h4>
                {getAuthorizationFor('ABSENCE', "delete") && <h4>Reçus</h4>}
                {getAuthorizationFor('ABSENCE', "delete") && <h4>Traité</h4>}

            </div>

            <div className="right-section">

                <input type={'button'} className="new-request" value={"+ Nouvelle demande"} />

            </div>

        </div>

        <CreateNew />

        <SortableTable data={[]} emptyMessage={"Aucune demandes envoyées"} header={[
            {label: 'Type', column: 'type'},
            {label: 'Date début', column: 'start_date'},
            {label: 'Date fin', column: 'end_date'},
            {label: 'Etat', column: 'state'},

        ]}/>

    </div>

}

function Pendings(){

    return <div>

    </div>

}


function Requests(){


    return <div>




    </div>

}


function CreateNew({isOpen, setOpen, onSubmit}){

    const [absentType, setAbsentType] = useState(0);
    const [date, setDate] = useState([new Date(), new Date()]);
    const [singleDateMoment, setSingleDateMoment] = useState(0);


      useEffect(() => {

        console.log(moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD'))
    
    }, [date])
    return <div className="form-container">

        <div className="cancel-btb">
            <h4>Annuler</h4>
        </div>

        <div className="title-section">
            <AbsentIcon className='absent-icon' />
            <h2>Demande d'autorisation d'absence</h2>
        </div>
        
        <div className="input-auto">
            
            <div>
                <h4>Nom :</h4>
                <h4>TEST</h4>
            </div>
        </div>

        <div className="input-auto">
            <div>
                <h4>Prénom : </h4>
                <h4>TEST</h4>
            </div>
        </div>

        <div className="input-auto">
            <div>
                <h4>Service :</h4>
                <h4>TEST</h4>
            </div>
        </div>

        <div className="separator" />

        <form className="absence-form">

            <div className="calendar-container">

            <Calendar
                onChange={setDate}
                selectRange={true}
                defaultValue={date}
            />

            </div>

            {moment(date[0]).format('YYYY-MM-DD') === moment(date[1]).format('YYYY-MM-DD') && <div>

                


                <div onClick={() => setSingleDateMoment(0)} className={"selection-input "+(singleDateMoment === 0? 'selected' : '')}>
                    <h4>Toute la matinée</h4>
                </div>

                <div  onClick={() => setSingleDateMoment(1)} className={"selection-input "+(singleDateMoment === 1? 'selected' : '')}>
                    <h4>Toute l'Après-midi</h4>
                </div>

                <div  onClick={() => setSingleDateMoment(2)} className={"selection-input "+(singleDateMoment === 2? 'selected' : '')}>
                    <h4>Journée complète</h4>
                </div>

                <div className="precision-time">
                    De <input type={'time'}  />
                    à <input type={'time'}  />
                </div>

            </div>}


            <div className="separator" />


            <h3 className="section-title">Abcence à décompter sur</h3>

            <div onClick={() => setAbsentType(0)} className={"selection-input "+(absentType === 0? 'selected' : '')}>
                <h4>Congés annuels</h4>
            </div>

            <div  onClick={() => setAbsentType(1)} className={"selection-input "+(absentType === 1? 'selected' : '')}>
                <h4>RTT</h4>
            </div>

            <div  onClick={() => setAbsentType(2)} className={"selection-input "+(absentType === 2? 'selected' : '')}>
                <h4>Repos compensateur</h4>
            </div>

            <div  onClick={() => setAbsentType(3)} className={"selection-input "+(absentType === 3? 'selected' : '')}>
                <h4>Repos compensateur nuit</h4>
            </div>

            <div  onClick={() => setAbsentType(4)} className={"selection-input "+(absentType === 4? 'selected' : '')}>
                <h4>Congés pour évènement familial</h4>
            </div>
    

            <input className="valid-absent" type={'submit'} value={'Valider la demande'} />


        </form>



    </div>
}






export default Absences;