import './Notification.style.css';
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { postToServer,getToServer } from "../../utils/serverHttpCom.js";
import  {ExpandNotif}  from "../../components";

function Notification(){

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        page: [],
        user: '',
      });

    const [dataNotifs, setDataNotifs] = useState();

    const [dataPages, setDataPages] = useState();

    const [dataUserAccess, setDataUserAccess] = useState();

    const [modeFormulaire, setModeFormulaire] = useState("insert");

    const [currentId, setCurrentId] = useState(null);

    const [selectedNotif, setSelectedNotif] = useState([]);
    
    useEffect(() => {
        fetchNotifications()
        fetchPage()
        fetchUserAccess()
    },[])


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'page') {
            // Vérifiez si la valeur est déjà dans formData.page
            if (formData.page.includes(value)) {
                // Si la valeur est présente, la supprimer
                const updatedPage = formData.page.filter((selectedValue) => selectedValue !== value);
                setFormData({
                    ...formData,
                    page: updatedPage,
                });
            } else {
                // Si la valeur n'est pas présente, l'ajouter
                setFormData({
                    ...formData,
                    page: [...formData.page, value],
                });
            }
        } else {
            // Si ce n'est pas le champ 'page', mettez à jour normalement
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    

    const handleSubmit = (event) => {
        event.preventDefault();

        let titre = formData.title;
        let contenu = formData.content;
        let page = formData.page;
        let interface_utilisateur = formData.user;
        let activer = 1;

        if (modeFormulaire === 'insert'){
            postToServer('/notificationWeb/insert',{titre,contenu,page,interface_utilisateur,activer},({res}) => {
                handleReset()
                fetchNotifications()
            })
        } else if (modeFormulaire === 'edit') {
            let id = currentId;
            postToServer('/notificationWeb/update',{id,titre,contenu,page,interface_utilisateur, activer},({res}) => {
                handleReset()
                fetchNotifications()
            })
        } else {
            console.error("ModeFormulaire non attendu")
        }
    };

    const handleDeleteNotification = (index) => {
        if (dataNotifs) {
            // Filtrez les notifications pour exclure celle qui a été supprimée
            const updatedNotifications = dataNotifs.filter((_, i) => i !== index);
            setDataNotifs(updatedNotifications);
        }
      };

    const handleEdit = (id) => {
        postToServer('/notificationWeb/fetchOne',{id},({data}) => {
            setModeFormulaire('edit')
            updateFormData(data);
            setCurrentId(id);
        })
    }

    const handleReset = () => {
        setFormData({
            title: '',
            content: '',
            page: [],
            user: '',
        });
        setModeFormulaire('insert')
    }

    const updateFormData = (data) => {
        let title = data[0].title;
        let content = data[0].content;
        let page = data[0].page;
        let user = data[0].user_interface;
        setFormData({
            title: title,
            content: content,
            page: page,
            user: user,
        });
    };

    const handleSelect = (id, title, content, page, user_interface, activate, isSelected) => {
        if (isSelected) {
            setSelectedNotif((prevNotif) => [
            ...prevNotif,
            { id, title, content, page, user_interface, activate },
          ]);
        } else {
            setSelectedNotif((prevNotif) =>
            prevNotif.filter((prevNotif) => prevNotif.id !== id)
          );
        }
      };

    const handleDeleteAll = () => {
        for (let i = 0; i < selectedNotif.length; i++){
            let id = selectedNotif[i].id
            postToServer('/notificationWeb/delete',{id},({res}) => {
                fetchNotifications()
            })
        }
    }

    const handleActivateAll = () => {
        for (let i = 0; i < selectedNotif.length; i++){
            let id = selectedNotif[i].id;
            let titre = selectedNotif[i].title;
            let contenu = selectedNotif[i].content;
            let page = selectedNotif[i].page;
            let interface_utilisateur = selectedNotif[i].user_interface;
            let activer = 1;
            postToServer('/notificationWeb/update',{id,titre,contenu,page,interface_utilisateur, activer}, ({res}) => {
                fetchNotifications()
            })
        }
    }

    const handleDesactivateAll = () => {
        for (let i = 0; i < selectedNotif.length; i++){
            let id = selectedNotif[i].id;
            let titre = selectedNotif[i].title;
            let contenu = selectedNotif[i].content;
            let page = selectedNotif[i].page;
            let interface_utilisateur = selectedNotif[i].user_interface;
            let activer = 0;
            postToServer('/notificationWeb/update',{id,titre,contenu,page,interface_utilisateur, activer}, ({res}) => {
                fetchNotifications()
            })
        }
    }

    function fetchNotifications(){
        postToServer('/notificationWeb',{},({data}) => {
            setDataNotifs(data)
        })
    }

    function fetchPage(){
        postToServer('/interface',{},({data}) => {
            setDataPages(data.map((page) => page.display_name))
        })
    }

    function fetchUserAccess(){
        postToServer('/rules',{},({data}) => {
            setDataUserAccess(data.map((user) => user.user_type))
        })
    }

    const isPageSelected = (pageName) => {
        return formData.page.includes(pageName);
    };

    return <>
    <div className='col col-left'>
        <div className='notif-form-title'>
            <h2 className='notif-title'>
            {modeFormulaire === 'insert'
              ? 'Créer une nouvelle notification'
              : 'Modifier la notification'}
            </h2>
            <form className='notif-form' onSubmit={handleSubmit}>
                <div className='notif-form-group'>
                    <label className='notif-label'>
                        Titre :
                        <input className='notif-input' type="text" name="title" value={formData.title} onChange={handleInputChange} />
                    </label>
                    <br />
                    <label className='notif-label'>
                        Contenu :
                        <textarea className='notif-input notif-input-content' name="content" value={formData.content} onChange={handleInputChange} />
                    </label>
                    <br />
                    {
                        dataPages && (
                            <div>
                                <label className='select-label'>
                                    Sélectionnez une page :
                                </label>
                                <select 
                                className='select-input'
                                value={formData.page}
                                onClick={(e) => e.stopPropagation()}                                
                                onChange={handleInputChange}
                                name="page"
                                >
                                    <option className='unselected-option' value="">
                                        Sélectionnez une page
                                    </option>
                                    {dataPages.map((displayName, index) => (
                                        <option
                                         key={index} 
                                         value={displayName}
                                         className={isPageSelected(displayName) ? 'selected-option' : 'unselected-option'}
                                         >
                                        {displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                    <br />
                    {
                        dataUserAccess && (
                            <div>
                                <label className='select-label'>
                                    Sélectionnez le type d'utilisateur :
                                </label>
                                <select 
                                    className='select-input-2'
                                    value={formData.user}
                                    onChange={handleInputChange}
                                    name="user"
                                    >
                                    <option className='unselected-option' value="">Sélectionnez le type d'utilisateur</option>
                                    {dataUserAccess.map((displayName, index) => (
                                        <option key={index} value={displayName}>
                                            {displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                    <br />
                </div>
                {
                    modeFormulaire === 'insert' && (
                        <button className='notif-form-button' type="submit">Valider</button>
                    )
                }
                {modeFormulaire === 'edit' && (
                    <div className='menu-bouton'>
                    <button className='notif-form-button-2' type="submit">Valider</button>
                    <button
                            className='notif-form-button-2'
                            type="reset"
                            onClick={handleReset}
                            style={{backgroundColor:'#ff5733'}}
                        >
                            Réinitialiser
                        </button>
                    </div>
                )}
            </form>
        </div>
    </div>

    <div className='col col-right'>
        <div className='menu-bouton-2'>
                <button onClick={handleDeleteAll} className='bouton-list' style={{backgroundColor:'#dc1313'}}>
                    Supprimer
                </button>
            <div className='sub-menu-bouton-2'>
                <button onClick={handleActivateAll} className='bouton-list'>
                    Activer
                </button>
                <button onClick={handleDesactivateAll} className='bouton-list' style={{backgroundColor:'#ff5733'}}>
                    Désactiver
                </button>
            </div>
        </div>
        <div className='row detail-notif'>
            {dataNotifs &&
                Array.from({ length: dataNotifs.length }, (_, index) => (
                <ExpandNotif 
                key={index} 
                index={index} 
                notification={dataNotifs[index]} 
                onDelete={handleDeleteNotification}
                onUpdate={fetchNotifications}
                onEdit={handleEdit}
                onSelect={handleSelect}
                />
            ))}
        </div>
        
    </div>



    </>

}

export default Notification;