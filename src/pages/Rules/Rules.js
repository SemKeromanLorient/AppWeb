import React, { useContext, useEffect, useState } from "react";
import "./Rules.style.css";
import Select from 'react-select';
import {ReactComponent as DeleteIcon} from '../../assets/icons/remove.svg';
import { postToServer } from "../../utils/serverHttpCom.js";
import {ReactComponent as MoreIcon} from '../../assets/icons/more-vert.svg';
import {ReactComponent as ArrowIcon} from '../../assets/icons/arrow.svg';
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../../components/Popup/Popup";




function Rules(){

    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');

    function onConfirm(){

        fetchRules()

    }


    function searchFilterFunc(filter){

        return (rule) => {

            let searches = filter.split(',');

            for(let search of searches){
    
                if(search.includes('type:')){
    
                    let typeFilter = search.split(':')[1]
    
                    if(rule.user_type.toUpperCase().includes(typeFilter.toUpperCase())){
                        return true;
                    }
    
                }else{
                    if(rule.rule_name.toUpperCase().includes(search.toUpperCase())){
                        return true;
                    }
                }
    
    
            }
    
    
            return false;


        }

      


    }

    function onAddNew(){
        setFormOpen(true);
    }

    function fetchRules(){
        postToServer('/rules', {}, ({data}) => {

            setRules(data)

        })
    }

    useEffect(() => {


       fetchRules()


    }, [])

    function handleOpenDetail(index){

        setSelectedRule(rules[index]);
        setFormOpen(true);

    }

    return <div className="rules-container">

        <div className="rules-header">
            <input value={searchFilter} onChange={({target}) => setSearchFilter(target.value)} type={"text"}  placeholder={"Rechercher une règle, Admin, Op..."} />
            <input type={"button"} onClick={onAddNew} value={"nouvelle règle"} />
        </div>

        <div className="rules-list">
            {rules.filter(searchFilterFunc(searchFilter)).map((rule, index) => <RuleRow onClick={handleOpenDetail} index={index} rule={rule} key={index} />)}
        </div>


        <RuleForm setSelectedRule={setSelectedRule} onSubmit={onConfirm} isOpen={isFormOpen} rule={selectedRule} setOpen={setFormOpen} />


    </div>

}


function RuleRow({rule, index, onClick}){

    function handleOnClick(){

        onClick(index)

    }

    return <div onClick={handleOnClick} className="rule-row-container">

        <h3>{rule.rule_name}</h3>

        <MoreIcon className="more-info" />
    </div>

}


function RuleForm({rule, isOpen, setOpen, onSubmit, setSelectedRule}){

    const [name, setName] = useState('');
    const [userType, setUserType] = useState('');
    const [usersTypes, setUsersTypes] = useState([]);
    const [newType, setNewType] = useState('')
    const [zones, setZones] = useState([]);
    const [selectedZones, setSelectedZones] = useState([]);
    const [borneRange, setBorneRange] = useState('');
    const [timeRange, setTimeRange] = useState('');
    const [zoneListOpen, setZoneListOpen] = useState(false);
    const [authorizedInterface, setAuthorizedInterface] = useState({});
    const [interfaces, setInterfaces] = useState([]);
    const {setPopupOption} = useContext(PopupContext);
    const [canUpdate, setCanUpdate] = useState(false)

    useEffect(() => {

        fetchUserTypes();
        fetchZones();

       

    }, [])

    useEffect(() => {

        if(rule){

            setTimeRange(rule.access_time? rule.access_time : "");
            setAuthorizedInterface(JSON.parse(rule.authorized_interface));
            setBorneRange(rule.borne_access_range? rule.borne_access_range : '');
            setName(rule.rule_name);
            setUserType(rule.user_type);
            setSelectedZones(rule.zone_access.split(",").map((value) => zones.find((zone) => zone.id === value)).filter((value) => !!value))
        }



    }, [rule])



    function handleOnCheckInterface({nativeEvent}){

        if(nativeEvent.target.checked)addInterface(nativeEvent.target.name)
        else removeInterface(nativeEvent.target.name)

    }


    function fetchUserTypes(){


        postToServer('/rules/users-types', {}, ({data}) => {

            setUsersTypes(data.map((item) => item.user_type))
            

        }, () => {

       
        })


    }


    function fetchZones(){
     
        postToServer('/zones', {}, ({error, data}) => {
            setZones(data.map((zone) => {
               return {name: zone.name, id: zone._id}
            }))

        })

    }

    function handleConfirm(event){
        event.preventDefault();


        console.log(name, userType === 'NEW'? newType : userType, selectedZones, borneRange, timeRange, authorizedInterface)

        if(rule){

            setPopupOption({
                type: POPUP_QUESTION,
                text: 'Modifier la règle ?',
                secondaryText: 'La modification affectera tous les utilisateurs associé.',
                acceptText: 'Oui, je modifie',
                declineText: 'Non, revenir en arrière',
                onAccept: () => {
                    
                    postToServer('/rules/update', 
                    {   id: rule._id,
                        rule_name: name, 
                        user_type: userType === 'NEW'? newType : userType, 
                        zones: selectedZones.map((zone) => zone.id).join(','), 
                        bornes: borneRange, 
                        time: timeRange, 
                        interfaces: JSON.stringify(authorizedInterface)}, () => {
            
                        onSubmit();
                        closeForm();
            
                    },
                    (error) => {
            
                        console.log(error)
            
            
                    })

                }
            })

           



        }else postToServer('/rules/create', 
        {   
            rule_name: name, 
            user_type: userType === 'NEW'? newType : userType, 
            zones: selectedZones.map((zone) => zone.id).join(','), 
            bornes: borneRange, 
            time: timeRange, 
            interfaces: JSON.stringify(authorizedInterface)}, 
            () => {

            onSubmit();
            closeForm();

        },
        (error) => {

            console.log(error)


        })

    }

    function closeForm(){

        setOpen(false)
        setAuthorizedInterface({});
        setBorneRange('')
        setName('')
        setNewType('')
        setSelectedZones([])
        setTimeRange('')
        setUserType('')
        setSelectedRule(null)

    }

    function handleRemoveZone(index){

        let zoneListCopy = [...selectedZones];
        zoneListCopy.splice(index, 1)
        setSelectedZones(zoneListCopy);

    }

    function handleOpenAddZone(){

        setZoneListOpen(!zoneListOpen);

    }

    function handleAddZone(zone){

        let zoneListCopy = [...selectedZones];
        zoneListCopy.push(zone)
        setSelectedZones(zoneListCopy);
        setZoneListOpen(false);

    }


    function handleRemoveRule(){

        setPopupOption({
            text: 'Supprimer la règle '+name+' ?',
            secondaryText: 'Verifié d\'abord si aucun utilisateur n\'est assossié à cette règle.',
            acceptText: 'Oui, supprimer la règle',
            declineText: 'Non, revenir en arrière',
            type: POPUP_QUESTION,
            onAccept: () => {

                postToServer('/rules/delete', 
                {   
                rule_id: rule._id}, 
                () => {
        
                    onSubmit();
                    closeForm();
        
                },
                (error) => {
        
                    console.log(error)
        
                })

            }
        })

       

    }


    useEffect(() => {

        postToServer('/rules/interfaces', {}, ({data}) => {

        
            setInterfaces(data)

        })


    }, [])

    return <form className={"rules-form "+(!isOpen? "hidden" : "")} onSubmit={handleConfirm}>

        <div onClick={closeForm} className="go-back">
            <h3>Annuler</h3>
        </div>

        <div className="form-header">

            <h2>{rule? "Modifier règle" : "Nouvelle règle"}</h2>

        </div>

        <div className="input-section">
            <h4>Nom de règle</h4>
            <input required value={name} onChange={({target}) => setName(target.value)} type={"text"} placeholder={'Ex: accès admin...'}/>
        </div>
        
        <div className="input-section">
            <h4>Type d'utilisateur</h4>
            <select className="listSelect" onChange={({nativeEvent}) => setUserType(nativeEvent.target.value)}>
                <option selected={!rule} disabled >Selectionner un type</option>
                {usersTypes.map((type) => <option selected={userType === type} value={type}>{type}</option>)}
                <option value={"NEW"}>Nouveau</option>
            </select>
        </div>

        

        {userType === "NEW" && <>
            <div className="input-section">
                <h4>Nouveau type</h4>
                <input required value={newType} onChange={({target}) => setNewType(target.value)} type={"text"} placeholder={"Ex: Arn, Admin..."} />
            </div>
        </>}

        <div className="input-section">
            <h4>Zone(s) accessible(s)</h4>
            
            <div className="zones-selected-list">
                <div onClick={handleOpenAddZone} className="add-zone">
                   <h4>+ Ajouter</h4>
                </div>
                {selectedZones.length > 0? selectedZones.map((zone, index) => 

                    {return zone? <div className="zone-item" >
                        <h4>{zone.name}</h4> 
                        <div className="delete-zone" onClick={() => handleRemoveZone(index)}>
                            <DeleteIcon className="delete-icon" />
                        </div>
                    </div> : <></>}) : <h4 className="no-select-zone">Aucune zone selectionnée</h4>}

            </div>
            {zoneListOpen && <div className="zone-select-container">
                {zones.filter((zone) => !selectedZones.includes(zone)).length > 0 ? zones.filter((zone) => !selectedZones.includes(zone)).map((zone, index) => <div onClick={() => handleAddZone(zone)} className="zone-select"><h3>{zone.name}</h3></div>): 
                <h3 >Aucune zones disponibles</h3>
                }
            </div>}
            
        </div>


        <div className="input-section">
            <h4>Borne(s) accèssible(s)</h4>
            <input value={borneRange} onChange={({target}) => setBorneRange(target.value)} type={"text"} placeholder={'Ex: [1-20],24'}/>
        </div>

        <div className="input-section">
            <h4>Temps d'accès</h4>
            <input value={timeRange} onChange={({target}) => setTimeRange(target.value)} type={"text"} placeholder={'Ex: [12h-17h]'}/>
        </div>

        <div className="input-section">

            <h4>Interface(s) accèssible(s)</h4>

            {interfaces.map((view, index) => <InterfaceRow setAuthInterface={setAuthorizedInterface} authInterface={authorizedInterface} key={index} interfaceObj={view} />)}

        </div>

        <div className="input-section">

        {rule && <div className="delete-btn rule-rem-btn" onClick={handleRemoveRule}>
                <h4>Supprimer la règle</h4>
            </div>}

        </div>

       

        <input className="valid-modif" type={"submit"} value={rule? "Modifier" : "Ajouter"}/>

    </form>



}


function InterfaceRow({authInterface, setAuthInterface, interfaceObj, onChange}){

    const [isExpanded, setExpanded] = useState(false);
    const [isGeneralChecked, setGeneralChecked] = useState(false);
    const [isAddChecked, setAddChecked] = useState(false);
    const [isUpdateChecked, setUpdateChecked] = useState(false);
    const [isDeleteChecked, setDeleteChecked] = useState(false);
    const [isViewChecked, setViewChecked] = useState(false);


    useEffect(() => {

        if(authInterface[interfaceObj._id]){

            setAddChecked(!!authInterface[interfaceObj._id].add)
            setUpdateChecked(!!authInterface[interfaceObj._id].update)
            setDeleteChecked(!!authInterface[interfaceObj._id].delete)
            setViewChecked(!!authInterface[interfaceObj._id].view)

        }else{
            setAddChecked(false)
            setUpdateChecked(false)
            setDeleteChecked(false)
            setViewChecked(false)
        }



    }, [authInterface]) 

 
    function changeAuthState(interfaceID, state){

        let authorized = authInterface;

        if(authorized[interfaceObj._id]){
            authorized[interfaceObj._id][interfaceID] = state;
        }else{
            authorized[interfaceObj._id] = {
                add: state
            }
        }

        setAuthInterface(authorized)
        

    }


    function handleGeneralCheck({nativeEvent}){
        if(!isAddChecked && !isDeleteChecked && !isUpdateChecked && !isViewChecked && nativeEvent.target.checked){
            changeAddState({state: true})
            changeDeleteState({state: true})
            changeViewState({state: true})
            changeUpdateState({state: true})
        }else if(!nativeEvent.target.checked){
            changeAddState({state: false})
            changeDeleteState({state: false})
            changeViewState({state: false})
            changeUpdateState({state: false})
        }
    }

    function handleExpand(){
        setExpanded(!isExpanded);
    }

    function checkGeneral(){
        if(isAddChecked || isDeleteChecked || isUpdateChecked || isViewChecked){
            setGeneralChecked(true);
        }else{
            setGeneralChecked(false);
        }
    }

    function changeAddState({nativeEvent, state}){
        let stateSelected = (nativeEvent)? nativeEvent.target.checked : state;
        setAddChecked(stateSelected);
        changeAuthState('add', stateSelected);
    }

    function changeUpdateState({nativeEvent, state}){
        let stateSelected = (nativeEvent)? nativeEvent.target.checked : state;
        setUpdateChecked(stateSelected);
        changeAuthState('update', stateSelected);
    }

    function changeDeleteState({nativeEvent, state}){
        let stateSelected = (nativeEvent)? nativeEvent.target.checked : state;
        setDeleteChecked(stateSelected);
        changeAuthState('delete', stateSelected);
    }

    function changeViewState({nativeEvent, state}){
        let stateSelected = (nativeEvent)? nativeEvent.target.checked : state;
        setViewChecked(stateSelected);
        changeAuthState('view', stateSelected);
    }


    return <div className={"row-interface "+(!isExpanded? "hidden" : "")}>

       <div className={"minimize-row-interface"}>
            <div className="check-option">
                <input checked={isAddChecked || isDeleteChecked || isUpdateChecked || isViewChecked} onChange={handleGeneralCheck} type={"checkbox"}/>
                <h4>{interfaceObj.display_name}</h4>
                <div onClick={handleExpand} className="expand-option">
                    <ArrowIcon className={"expand-icon "+(!isExpanded? "down" : "")} />
                </div>
            </div>
       </div>

       <div className="expanded-interface-rows">

            {interfaceObj.add === 1 && <div  className="check-option">
                <input checked={isAddChecked} onChange={changeAddState} type={"checkbox"}/>
                <h4>{interfaceObj.add_label}</h4>
            </div>}

            {interfaceObj.update === 1 && <div  className="check-option">
                <input checked={isUpdateChecked} onChange={changeUpdateState}  type={"checkbox"}/>
                <h4>{interfaceObj.update_label}</h4>
            </div>}

            {interfaceObj.delete === 1 && <div  className="check-option">
                <input checked={isDeleteChecked} onChange={changeDeleteState}  type={"checkbox"}/>
                <h4>{interfaceObj.delete_label}</h4>
            </div>}

            {interfaceObj.view === 1 && <div  className="check-option">
                <input checked={isViewChecked} onChange={changeViewState}  type={"checkbox"}/>
                <h4>{interfaceObj.view_label}</h4>
            </div>}

       </div>

    </div>

}


export default Rules;