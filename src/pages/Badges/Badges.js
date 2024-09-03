import React, { useEffect, useState, useContext } from "react";
import "./Badges.style.css"
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";
import { SortableTable } from "../../components";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Source } from "react-map-gl";
import { PopupContext, UserContext } from "../../contexts";
import { POPUP_ERROR } from "../../components/Popup/Popup";


/**
 * Pour le moment set les badges en permanence  
 * @returns 
 */
function Badges(){

    //List des badges
    const [badges,setBadges] = useState ();

    const [clientNameInput, setClientNameInput] = useState("");
    const [userNameInput, setUserNameInput] = useState("");
    const [authorizationInput, setAuthorizationInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
    const [row, setRow] = useState(""); //Stock dans le localStorage l'id du badge pour save à la reco
    const [val,setVal] = useState(""); //Stock la valeur de l'id du badge quand on click sur une ligne du tableau
    const [selectedBadge, setSelectedBadge] = useState(null); //Stock la valeur de username et de name du badge

    const [NameFilter,setNameFilter] = useState("");
    const [UserNameFilter, setUserNameFilter] = useState("");
    const [NumBadgeFilter, setNumBadgeFilter] = useState("");

    const {setPopupOption} = useContext(PopupContext);

    useEffect(() => {
        fetchBadges();
      }, []);

    useEffect(() => { 
        const storedRow = localStorage.getItem("row");
        if (storedRow) {
            setRow(storedRow.replace(/"/g, ''));
        }
      }, []);    

    useEffect(() => {
        setRow(val.replace(/"/g, ''));
    }, [val])

    function handleGetRowData(data){
        const { name, username } = data;
        setSelectedBadge({ name, username });
    }

    function filterFunction(badge){
        
        if(NameFilter !== '' && !badge.name.toUpperCase().includes(NameFilter.toUpperCase()))return false;

        if(UserNameFilter !== '' && !badge.username.toUpperCase().includes(UserNameFilter.toUpperCase())) return false;

        if(NumBadgeFilter !== '' && !badge.number.toUpperCase().includes(NumBadgeFilter.toUpperCase())) return false;

        return true;

    }

    function fetchBadges(){

        getToServer('/badges',{}, ({data}) => {

            setBadges(data.badge);

        })
    }

    function updateBadge(idBadge,name,username,authorized,date){
        if (idBadge,name, username, authorized, date){
            postToServer('/badges/update',{
                id: idBadge,
                name: name,
                username: username,
                authorized: authorized,
                date: date
            },(res) => {
                setPopupOption({

                    secondaryText: 'Votre modification à bien été enregistré',
                    acceptText: 'Ok'    
                })
            },(err) => {
                console.error("Erreur lors de l'update de badge : ", err)
            })
        } else {
            console.log("Erreur informations manquante")
        }
    }

    const deleteBadge = () => {
        if (row) {
            // Empêcher la fonction de suppression de se déclencher si le bouton "Supprimer" n'a pas été cliqué explicitement
            if (window.confirm("Voulez-vous vraiment supprimer ce badge ?")) {
                setIsDeleting(true);
                postToServer('/badges/delete', {
                    id: row,
                }, (res) => {
                    setPopupOption({
                        secondaryText: "Le badge vient d'être supprimé",
                        acceptText: 'Ok'    
                    })
                    setIsDeleting(false);
                }, (err) => {
                    console.error("Erreur lors de la suppression du badge : ", err);
                    setIsDeleting(false);
                });
            }
        } else {
            console.error("Erreur, aucun badge trouvé");
        }
    };
    

     /**
     * Génere un fichier excel séparé en différentes parties un worksheet avec les détails des conso d'electricité, un autre avec les conso d'eau et un dernier avec des récaps de données
     */
     function generateExcel() {
        const wb = new ExcelJS.Workbook();
        // Données facturation pour les différentes pages
        const data = badges.filter(filterFunction);

        // définir la largeur souhaitée de la première colonne (numéro 1)
        const columnWidth = 40;
        
        const headerBadge = ["NuméroBadge", "SetupDate","Nom", "Surnom"]

        // Créer une nouvelle feuille dans le classeur et ajouter les données
        const ws1 = wb.addWorksheet('Badges');
        const headerRow = ws1.addRow(headerBadge);
        headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A6A6A6' } // gris
        };
        });
        
       
        ws1.getColumn('A').width = columnWidth;
        ws1.getColumn('B').width = columnWidth;
        ws1.getColumn('C').width = columnWidth;
        ws1.getColumn('D').width = columnWidth;
        ws1.getColumn('E').width = columnWidth;

      
        ws1.autoFilter = {
            from: 'A1',
            to: 'E1',
        }

        // Insérer les données de chaque ligne de dataEau
        for (const row of data) {
                const dateFormat = date => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const hour = date.getHours().toString().padStart(2, '0');
                    const minute = date.getMinutes().toString().padStart(2, '0');
                    const second = date.getSeconds().toString().padStart(2, '0');
                    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
                  }
                const rowData = [
                    row.number,
                    dateFormat(new Date(row.setupDate)),
                    row.name,
                    row.username
                    ];
                    ws1.addRow(rowData);
            
        }

        ws1.columns.forEach((column) => {
            // Centrer les données dans chaque cellule
            column.eachCell((cell) => {
            cell.alignment = { horizontal: 'center' };
            });
        });

        //Créer le fichier Excel et télécharger
        wb.xlsx.writeBuffer().then(buffer => {
            saveAs(new Blob([buffer]), 'Badges.xlsx');
        });
      }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!isDeleting) {
            updateBadge(row, clientNameInput, userNameInput, authorizationInput, currentDate);
        }
      };

    const handleAuthorizationClick = (value) => {
        setAuthorizationInput(value);
    };

    
    return <div className="badges-container"> 

    <div className="form-badge">
        <h2 className="title-new-badge">Edition badge : </h2> 
        <form className = "form-badge-2" onSubmit={handleFormSubmit}>
            <div className="row" style={{justifyContent: "center"}}>
                <div className="col colonne-gauche">
                    <div className="row">
                        <div className="col test">
                            <label htmlFor="badge-input">Numéro du badge</label> <br/>
                            <label htmlFor="badge-input">{row}</label>
                        </div>
                        <div className="col test"> 
                            <label htmlFor="date-input">Date:</label> <br/>
                            <label htmlFor="date-input"> {currentDate} </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="user-name-input">Username:</label> <br/>
                            <input
                            type="text"
                            id="user-name-input"
                            value={userNameInput}
                            onChange={(e) => setUserNameInput(e.target.value)}
                            placeholder={selectedBadge ? selectedBadge.username : "Username"}                            
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="client-name-input">Name:</label> <br/>
                            <input
                            type="text"
                            id="client-name-input"
                            value={clientNameInput}
                            onChange={(e) => setClientNameInput(e.target.value)}
                            placeholder={selectedBadge ? selectedBadge.name : "Name"}
                            />
                        </div>
                    </div>
                    <div className="row autorisation">
                        <div className="col">
                            <label>Autorisation d'ouverture:</label>
                            <div className="authorization-options">
                            <button
                                type="button"
                                className={`authorization-option ${authorizationInput === "true" ? "selected" : ""}`}
                                onClick={() => handleAuthorizationClick(true)}
                            >
                                Oui
                            </button>
                            <button
                                type="button"
                                className={`authorization-option ${authorizationInput === "non" ? "selected" : ""}`}
                                onClick={() => handleAuthorizationClick(false)}
                            >
                                Non
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col colonne-droite">
                    <button type="submit" className="add-button-badge">Modifier</button>
                    <button className="del-button-badge" onClick={deleteBadge} style={{marginLeft: 10}}>Supprimer</button>
                </div>
            </div>
        </form>
    </div>

    <div className="tableau-badge">
        <div className="search-section">
            <input value={NumBadgeFilter} onChange={({target}) => setNumBadgeFilter(target.value)} className="search-conso-input" placeholder="Numero Badge" /> 
            <input value={NameFilter} onChange={({target}) => setNameFilter(target.value)} className="search-conso-input" placeholder="Name" />
            <input value={UserNameFilter} onChange={({target}) => setUserNameFilter(target.value)} className="search-conso-input" placeholder="Username" /> 
            <button className="confirm-badges" onClick={generateExcel}>Excel</button>
        </div>
    {
        
        badges && ( 
            <SortableTable emptyMessage={'Aucun badge'} data={badges.filter(filterFunction)} 
            header={[
                {label: "NUM_BADGE", column: 'number', type: 'string'},
                {label: "NAME", column: 'name', type:'string'},
                {label: "USERNAME", column: 'username', type:'string'}
            ]}
            onClickRowAllData={handleGetRowData}
            setVal={setVal}
            />
        )}
    </div>  
</div>
}

export default Badges;