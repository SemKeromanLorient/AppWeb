
import moment from "moment";
import React, { useEffect, useState, useContext } from "react";
import "./SortableTable.style.css";
import {ReactComponent as OrderIcon} from '../../assets/icons/arrow.svg';
import { TableContext } from '../../contexts';
import { PopupContext } from "../../contexts";
import { POPUP_QUESTION } from "../Popup/Popup";
import { postToServer , getToServer} from "../../utils/serverHttpCom.js";

function SortableTable({data, header, filter, emptyMessage, setVal, onClickRowAllData }){

    //order -> asc = Du plus petit au plus grand, desc = du plus grand au plus petit.

    const [sort, setSort] = useState({//trie par défaut
        column: 'start_date',
        order: 'desc'
    });
    const [row, setRow] = useState("");    
    const [editingCell, setEditingCell] = useState({ rowIndex: null, columnIndex: null });
    const [editedValue, setEditedValue] = useState("");
    const {setPopupOption} = useContext(PopupContext);

    useEffect(() => {
        let rowString = JSON.stringify(row);
        localStorage.setItem("row", rowString);
        setVal(rowString)
    }, [row]);

    function sortFunction(previous, current){
        let columnPrevious = previous[sort.column] 
        let columnCurrent = current[sort.column]

        if(columnCurrent && columnPrevious && typeof columnCurrent === 'string' && typeof columnCurrent === 'string'){
            try{
                columnCurrent = columnCurrent.toUpperCase();
                columnPrevious = columnPrevious.toUpperCase();
            } catch(err) {}
        }

        if(sort.order === 'asc'){
            if(columnCurrent === null) return 1
            if(columnPrevious === null) return -1
            if(columnCurrent > columnPrevious) return -1;
            if(columnCurrent < columnPrevious) return 1;
        } else {
            if(columnCurrent === null) return -1
            if(columnPrevious === null) return 1
            if(columnCurrent < columnPrevious) return -1;
            if(columnCurrent > columnPrevious) return 1;
        }
        return 0
    }

    function handleRowClick(rowData){
        if (onClickRowAllData) {
            onClickRowAllData(rowData);
            setRow(rowData.number);
        } else {
            setRow(rowData.number);
        }
    }

    function handleCellClick(rowIndex, columnIndex, value){
        if (header[columnIndex].column === 'user'){
            setEditingCell({ rowIndex, columnIndex });
            setEditedValue(value);
        }

    }

    function handleInputChange(event){
        setEditedValue(event.target.value);
    }

    function updateInfoConso(borne, prise, dateStart, dateClose, IdBusiness){
        console.log("TEST updateInfoConso")
        postToServer('/consommations/UpdateConso', {borne: borne, prise: prise, dateStart: dateStart, dateClose: dateClose, IdBusiness: IdBusiness}, ({data}) => {
            console.log("Data consommations/UpdateConso : " + JSON.stringify(data))
        })
    }

    function handleCellBlur(){
        // Mise à jour de la valeur dans les données
        const updatedData = [...data];
        updatedData[editingCell.rowIndex][header[editingCell.columnIndex].column] = editedValue;
        const currentData = updatedData[editingCell.rowIndex]
        // Réinitialisation de l'état d'édition
        console.log("Test handleCellBlur : " + JSON.stringify(currentData))
        setEditingCell({ rowIndex: null, columnIndex: null });

        if (updatedData[editingCell.rowIndex] !== null){
            setPopupOption({
                text: `Modifier le consommateur ${currentData.user} ?`,
                secondaryText: `La facture sera au nom de ${currentData.user}`,
                type: POPUP_QUESTION,
                acceptText: `Oui, Valider cette modification`,
                declineText: `Non, Annuler cette modification`,
                onAccept: () => {
                    updateInfoConso(currentData.borne,currentData.prise,currentData.start_date,currentData.end_date,currentData.user)
                }
            })
        }


    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {header.map((headerValue, index) => (
                            <HeaderColumn data={headerValue} key={index} sort={sort} setSort={setSort} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.sort(sortFunction).map((item, rowIndex) => (
                        <TableRow
                            key={rowIndex}
                            data={item}
                            header={header}
                            onClick={handleRowClick}
                            onCellClick={handleCellClick}
                            rowIndex={rowIndex}
                            editingCell={editingCell}
                            handleInputChange={handleInputChange}
                            handleCellBlur={handleCellBlur}
                        />
                    ))}
                    <tr>
                        {header.map((headerValue, index) => {
                            if(headerValue.calculateTotal){
                                let total = data.reduce((previous, current) => previous + current[headerValue.column], 0)
                                return <th key={index} className="total-table">total:{"\xa0\xa0\xa0"}{total.toFixed(1)} {headerValue.label}</th>
                            }
                            return <th key={index}  className="empty-total-table"> </th>
                        })}
                    </tr>
                </tbody>
            </table>
            {data.length <= 0 && (
                <div className="empty-message-container">
                    <h4>{emptyMessage ? emptyMessage : 'Aucune ligne'}</h4>
                </div>
            )}
            <div className="result-amount">{data.length} résultats</div>
        </div>
    );
}

function HeaderColumn({data, setSort, sort}){
    function onClick(){
        if(sort.column === data.column){
            setSort({
                column: data.column,
                order: sort.order === 'asc' ? 'desc' : 'asc'
            });
        } else {
            setSort({
                column: data.column,
                order:'desc'
            });
        }
    }
    return (
        <th onClick={onClick} className={"header-conso " + (sort.column === data.column ? "selected " : '')}>
            {data.label}
            {sort.column === data.column && <OrderIcon className={"order-icon " + sort.order}/>}
        </th>
    );
}

function TableRow({data, header, onClick, onCellClick, rowIndex, editingCell, handleInputChange, handleCellBlur}){
    return (
        <tr onClick={() => onClick(data)}>
            {header.map((headerValue, columnIndex) => (
                <Cell
                    key={columnIndex}
                    row={data}
                    value={data[headerValue.column]}
                    headerValue={headerValue}
                    onCellClick={onCellClick}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    editingCell={editingCell}
                    handleInputChange={handleInputChange}
                    handleCellBlur={handleCellBlur}
                />
            ))}
        </tr>
    );
}

function Cell({value, headerValue, row, onCellClick, rowIndex, columnIndex, editingCell, handleInputChange, handleCellBlur}){

    function onClick(){
        if (headerValue.onClick) {
            headerValue.onClick(value, row, headerValue);
        }
    }

    function onDoubleClick({detail}){
        if(detail === 2){
            if(headerValue.onDoubleClick){
                headerValue.onDoubleClick(value, row, headerValue)
            }
        }
    }

    function handleKeyDown(event){
        if (event.key === 'Enter'){
            handleCellBlur();
        }
    }

    return (
        <td
            style={{ cursor: headerValue.onDoubleClick ? 'pointer' : 'default' }}
            onClick={() => onCellClick(rowIndex, columnIndex, value)}
            onDoubleClick={onDoubleClick}
        >
            {editingCell.rowIndex === rowIndex && editingCell.columnIndex === columnIndex ? (
                <input
                    type="text"
                    placeholder={value}
                    onChange={handleInputChange}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <h4>{headerValue.processValue ? headerValue.processValue(value) : value}</h4>
            )}
        </td>
    );
}

export default SortableTable;
