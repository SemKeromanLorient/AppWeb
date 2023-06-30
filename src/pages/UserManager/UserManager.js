import React,{ useContext, useEffect, useState } from "react";
import { postToServer } from "../../utils/serverHttpCom.js";
import "./UserManager.style.css"
import {ReactComponent as MoreIcon} from '../../assets/icons/more-vert.svg';
import {ReactComponent as AddUserIcon} from '../../assets/icons/add-person.svg';
import {ReactComponent as ArrowIcon} from '../../assets/icons/arrow.svg';
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../../components/Popup/Popup";
import { SortableTable } from "../../components";

function UserManager(){

    const [userList, setUserList] = useState([])
    const [currentUser, setCurrentUser] = useState(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

    //Empeche les bugs avec sortable table
    const [val,setVal] = useState("");   

    useEffect(() => {

        fetchUserList();

    }, [])

    function fetchUserList(){

        
        postToServer('/users', {}, ({data}) => {

            setUserList(data)

        },
        (() => {
            console.log('err')
        }))


    }

    useEffect(() => {

        setFormOpen(!!currentUser);

    }, [currentUser])



    return <div className="user-manager-container">

        <UserControlHeader setCurrentUser={setCurrentUser} setFormOpen={setFormOpen} filter={searchFilter} setFilter={setSearchFilter} />

        {/*
        <div className="users-list">
            {userList.map((user, index) => <UserItem setCurrentUser={setCurrentUser} user={user} key={index} />)}
        </div>
        */}

        <SortableTable data={userList} emptyMessage={'Aucun utilisateurs'} onRowClick={() => {



        }} header={
            [
                {label: "Nom d'utilisateur", column: 'username',onDoubleClick: (value, row) => {
                    
                    setCurrentUser(row)

                }},
                {label: 'Nom affiché', column: 'name'},
                {label: 'Type d\'utilisateur', column: 'access_level'}

            ]} 
            setVal={setVal}
            />

        <UserForm userList={userList} onValid={fetchUserList} user={currentUser} isOpen={isFormOpen} setUser={setCurrentUser} setFormOpen={setFormOpen} />

    </div>


}



function UserControlHeader({filter, setFilter, setFormOpen, setCurrentUser}){

    
    function handleOnNewPress(){

        setCurrentUser(null);
        setFormOpen(true)

    }

    return <div className="control-header">
        <input className="search-input" value={filter} onChange={({target}) => setFilter(target.value)} type={"text"} placeholder={"Rechercher..."} />
        <div onClick={handleOnNewPress} className="add-button">
            <h3>+ Ajouter un utilisateur</h3>
        </div>
    </div>


}


function UserForm({user, isOpen, setUser, setFormOpen, onValid, userList}){

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setlastName] = useState("");
    const [groups, setGroups] = useState([]);
    
    const [usage, setUsage] = useState('');
    const [value, setValue] = useState('');

    const [codes, setCodes] = useState([]);


    const [password, setPassword] = useState("");
    const [accessLevel, setAccessLevel] = useState("");
    const [userTypes, setUserTypes] = useState([])
    const {setPopupOption} = useContext(PopupContext);

    //Empeche les bugs avec sortable table
    const [val,setVal] = useState("");  

    function handleUpdateUser(e){
        e.preventDefault();


        if(user){


            setPopupOption({
                type: POPUP_QUESTION,
                text: 'Voulez-vous modifier l\'utilisateur '+user.name,
                secondaryText: 'Tout utilisateur connecté avec ces identifiant sera mis à jour.',
                acceptText: 'Oui, modifier l\'utilisateur',
                declineText: 'Non, revenir en arrière',
                onAccept: () => {

                    postToServer('/user/update', {user: {
                        user_id: user.user_id,
                        username,
                        name,
                        password : password !== "xxxxxx"? password : null,
                        access_level: accessLevel
                    }}, 
                    () => {
                        if(onValid)onValid()
                        handleCancel()
                    }, () => {
        
                        alert('Error')
                        handleCancel()
        
                    })

                }

            })

          

        }else{

            postToServer('/user/create', {
                username,
                name,
                lastname,
                firstname,
                password,
                groups,
                codes
            }, 
            () => {
                if(onValid)onValid()
                handleCancel()
            }, () => {

                alert('Error')
                handleCancel()

            })

        }


    }

    function addGroup(){

        let copy = [...groups];
        copy.push({name: accessLevel})
        setGroups(copy)


    }

    function addCode(){

        let copy = [...codes];
        copy.push({
            usage,
            value
        })
        setCodes(copy)
        setUsage('');
        setValue('');

    }

    useEffect(() => {

        fetchUserTypes();

    }, [])

    function handleCancel(){
        if(user){
            resetInputs()
            setUser(null);
        }else setFormOpen(false);
    }

    useEffect(() => {

        if(!isOpen)setUser(null);

    }, [isOpen])


    function resetInputs(){
        setPassword("")
        setUsername("")
        setAccessLevel("")
        setFirstName("")
        setlastName('')
        setName("")
    }

    useEffect(() => {


        if(user){
            
            console.log(user)
            setPassword("xxxxxx")
            setUsername(user.username)
            setAccessLevel(user.accessLevel)
            setFirstName(user.firstname)
            setlastName(user.lastname)
            setName(user.name)

        }
   
    }, [user])


    function handleDelete(){


            setPopupOption({
                type: POPUP_QUESTION,
                text: 'Voulez-vous supprimer l\'utilisateur '+user.name,
                secondaryText: 'Tout utilisateur connecté avec ces identifiant sera déconnecté.',
                acceptText: 'Oui, supprimer l\'utilisateur',
                declineText: 'Non, revenir en arrière',
                onAccept: () => {

                    postToServer('/delete-user', {
                        user_id: user.user_id
                    }, 
                    () => {
                        if(onValid)onValid()
                        handleCancel()
                    }, () => {
        
                        alert('Error')
                        handleCancel()
        
                    })

                }

            })

         

    }


    function fetchUserTypes(){

        
        postToServer('/users-types', {}, ({data}) => {

            setUserTypes(data.map((item) => item.user_type))
            
        }, () => {

       
        })

    }


    return <div className={"user-form-container "+(!isOpen? "hidden" : "")}>

        {isOpen && <>

            <form autoComplete="off" className="user-form" onSubmit={handleUpdateUser}>
                
                <div className="title">
                    <AddUserIcon className="add-user-icon" />
                    <h2>Ajouter un utilisateur</h2>
                </div>
               
                 <div className="inputs">
                    <div className="form-input-section">
                        <h3>Nom affiché en haut*</h3>
                        <input placeholder="ex: BATEAU X..." value={name} onChange={({target}) => setName(target.value)} type={"text"} />
                    </div>
                    <div className="form-input-section">
                        <h3>Prénom</h3>
                        <input placeholder="ex: Dupond" value={firstname} onChange={({target}) => setFirstName(target.value)} type={"text"} />
                    </div>
                    <div className="form-input-section">
                        <h3>Nom de famille</h3>
                        <input placeholder="ex: DUPONT" value={lastname} onChange={({target}) => setlastName(target.value)} type={"text"} />
                    </div>
                    <div className="form-input-section">
                        <h3>Nom d'utilisateur *</h3>
                        <input placeholder="ex: bateau.x..." value={username} onChange={({target}) => setUsername(target.value)} type={"text"} />
                    </div>

                    <div className="form-input-section">
                        <h3>Superieur hiérarchique</h3>
                        <select required className="select-type">
                            {userList.map((user) => <option>{user.name}</option>)}
                        </select>
                    </div>

                    <div className="form-input-section">
                        <h3>Mot de passe *</h3>
                        <input placeholder="ex: P@ssw0rd..." value={password} onChange={({target}) => setPassword(target.value)} autoComplete="new-password" type={"password"} />
                    </div>


                    <div className="form-input-section">
                        <h3>Code divers (Compta, badge...)</h3>
                        <SortableTable emptyMessage={"Aucun code"} data={codes} header={[
                            {label: "Utiliter", column: "usage"},
                            {label: "Valeur", column: "value"}
                        ]} 
                        setVal={setVal}
                        />
                        <div className="row-input">
                            <input onChange={({target}) => setUsage(target.value)} value={usage} placeholder="Utilité..." />
                            <input onChange={({target}) => setValue(target.value)} value={value} placeholder="Valeur..." />
                            <input className="confirm-button" onClick={addCode} type={"button"} value={"Ajouter"} />

                        </div>
                    </div>
                  

                    <div className="form-input-section">
                        <h3>Groupe(s) *</h3>
                        <SortableTable emptyMessage={"Aucun groupe"} data={groups} header={[
                            {label: "Nom de groupe", column: "name"},
                        ]} 
                        setVal={setVal}/>
                        <div className="row-input">
                            <select required defaultValue={accessLevel} onChange={({nativeEvent}) => setAccessLevel(nativeEvent.target.value)} className="select-type">
                                <option selected={!user} disabled>Ajouter un groupe</option>

                                {userTypes.filter((value) => !groups.includes({name: value})).map((type) => <option value={type}>{type}</option>)}
                            </select>
                            <input className="confirm-button" onClick={addGroup} type={"button"} value={"Ajouter"} />

                        </div>
                    
                        
                       
                    </div>

                    

                    <div className="confirm-input">


                        {user && <div onClick={handleDelete} className="delete-btn">
                            <h3>Supprimer l'utilisateur</h3>
                        </div>}

                        <input className="confirm-button" type={"submit"} value={user? "Modifier" : "Ajouter"} />
                    </div>

                 </div>

               
            </form>

            <div onClick={handleCancel} className="cancel-btn">
                <ArrowIcon className="cancel-icon" />
                Annuler
            </div>


        </>}
        

    </div>



}



function UserItem({user, index, setCurrentUser, currentUser}){

    function handleClick(){
        setCurrentUser(user)
    }

    return <div onClick={handleClick} className="user-item-container">
        <h3>{user.name}</h3>
        <MoreIcon className="more-info" />
    </div>

}

export default UserManager;