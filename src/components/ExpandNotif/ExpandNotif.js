    import "./ExpandNotif.style.css";
    import React, { useContext, useEffect, useState } from 'react';
    import { postToServer,getToServer } from "../../utils/serverHttpCom.js";
    import CheckNotSelected from '../../assets/icons/check-box-not-selected.svg';
    import CheckSelected from '../../assets/icons/check-box-selected.svg';
// Fill différent (changement de couleur) // A revoir
    import CheckNotSelected2 from '../../assets/icons/check-box-not-selected-2.svg';
    import CheckSelected2 from '../../assets/icons/check-box-selected-2.svg';

    function ExpandNotif({ index, notification, onDelete, onUpdate, onEdit, onSelect }){

        const { id, title, content, page, user_interface, date, activate } = notification;
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [isSelected, setIsSelected] = useState(false);

        useEffect(() => {
            console.log("Notification info : " + JSON.stringify(notification))
        },[])


        const formatDate = (isoDate) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(new Date(isoDate));
            return formattedDate;
          };

        const handleClick = () => {
            setDropdownOpen(!dropdownOpen);
        };

        const toggleSelection = (e) => {
            e.stopPropagation();   
            console.log("Id : " + id)         
            setIsSelected(!isSelected);
            setDropdownOpen(false);
            onSelect && onSelect(id, title, content, page, user_interface, activate, !isSelected)
        };
          
        const handleDelete = () => {
            postToServer('/notification/delete',{id},({res}) => {
                console.log("Resultat delete : " + JSON.stringify(res))
                onDelete && onDelete(index);
            })
        };

        const handleActivate = () => {
            let titre = title;
            let contenu = content;
            let interface_utilisateur = user_interface;
            let activer = 0;
            if (activate === 0){
                activer = 1;
            }
            postToServer('/notification/update',{id,titre,contenu,page,interface_utilisateur, activer}, ({res}) => {
                console.log("Resultat activation notification : " + JSON.stringify(res))
                onUpdate && onUpdate();
            })
        }
        
        const handleEdit = () => {
            onEdit && onEdit(id)
        }

        return <>
            <div className={`expand-notif ${activate ? 'active' : 'inactive'}`}
                onClick={handleClick}
            >
                <div className="selection-logo" onClick={toggleSelection}>
                    <img 
                    className= "img-select"
                    src={
                        isSelected && activate === 0 ? CheckSelected2:
                        isSelected && activate === 1 ? CheckSelected:
                        !isSelected && activate === 0? CheckNotSelected2:
                        CheckNotSelected
                    }
                    alt="Selection" 
                    style={{ fill: activate ? '#e6ffe6' : '#ffe6e6' }}
                    />
                </div>
                <h2 className="titre">{title}</h2>
                <p className="contenu">{content}</p>
                <p className="date">{formatDate(date)}</p>

            </div>
            {dropdownOpen && (
                <div className="expand-notif-dropdown">
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Supprimer</button>
                    <button onClick={handleActivate}>{activate ? 'Désactiver' : 'Activer'}</button>
                </div>
            )}
        </>
        
    }

    export default ExpandNotif;