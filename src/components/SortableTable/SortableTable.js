import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import "./SortableTable.style.css";
import {ReactComponent as OrderIcon} from '../../assets/icons/arrow.svg';
import { TableContext } from '../../contexts';


function SortableTable({data, header, filter, emptyMessage, setVal}){

    //order -> asc = Du plus petit au plus grand, desc = du plus grand au plus petit.

    const [sort, setSort] = useState({//trie par défaut
        column: 'start_date',
        order: 'desc'
    });
    const [row, setRow] = useState("");    


    useEffect(() => {
        let rowString = JSON.stringify(row);
        localStorage.setItem("row", rowString);
        
        setVal(rowString)
      }, [row]);
      

    function sortFunction(previous, current){

        let columnPrevious = previous[sort.column] 
        let columnCurrent = current[sort.column]

        if(columnCurrent &&  columnPrevious && typeof columnCurrent === 'string' && typeof columnCurrent === 'string'){

            try{
                columnCurrent = columnCurrent.toUpperCase();
                columnPrevious = columnPrevious.toUpperCase();
            }catch(err){

            }
      
        }

        if(sort.order === 'asc'){

            if(columnCurrent === null)return 1
            if(columnPrevious === null)return -1
            
            if(columnCurrent > columnPrevious)return -1;
            if(columnCurrent < columnPrevious)return 1;


        }else{
            if(columnCurrent === null)return -1
            if(columnPrevious === null)return 1
            if(columnCurrent < columnPrevious)return -1;
            if(columnCurrent > columnPrevious)return 1;

        }

        return 0


    }

    function handleRowClick(rowTable){
        setRow(rowTable.number);
        //console.log("idBadge : " + idBadge);
    }   

    return <div className="table-container">


        <table>
            <thead>
                <tr>

                    {header.map((headerValue, index) => <HeaderColumn data={headerValue} key={index} sort={sort} setSort={setSort} />)}

                </tr>

            </thead>

            <tbody>

                {data.sort(sortFunction).map((item, index) => (<TableRow key={index} data={item} header={header} onClick={handleRowClick}/> ))}

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
        {data.length <= 0 && <div className="empty-message-container">
            <h4>{emptyMessage? emptyMessage : 'Aucune ligne'}</h4>
        </div>}
        <div className="result-amount">{data.length} résultats</div>
    </div>

}



function HeaderColumn({data, setSort, sort}){

    /**
     * Lorsqu'on click sur une colonne du header on passe le filtre de croissant a décroissant et vice versa. Le onclick regarde le nom de la colonne et actualise le param sort en fonction de celui-ci.
     */
    function onClick(){

        console.log("Data : " + data.column + "\n");
        console.log("setSort : " + setSort.order + "\n");
        console.log("sort : " + sort.column + "\n");

        if(sort.column === data.column){
            setSort({
                column: data.column,
                order: sort.order === 'asc'? 'desc' : 'asc'
            })
        }else{

            setSort({
                column: data.column,
                order:'desc'
            })

        }

    }


    return <th onClick={onClick} className={"header-conso "+(sort.column === data.column? "selected " : '')}>
        {data.label}
        {sort.column === data.column && <OrderIcon className={"order-icon "+sort.order}/>}
        </th>
}



function TableRow({data, header, onClick}){
    
    //console.log("Data : " + JSON.stringify(data));

    return <tr onClick={() => onClick(data)}>

        {header.map((headerValue, index) => <Cell key={index} row={data} value={data[headerValue.column]} headerValue={headerValue} />)}

    </tr>
}


function Cell({value, headerValue, row}){


    function onClick({detail}){

        if(detail === 2){
            if(headerValue.onDoubleClick)headerValue.onDoubleClick(value, row, headerValue)
        }

    }


    return <td style={{cursor: headerValue.onDoubleClick? 'pointer' : 'default'}} onClick={onClick} ><h4> {headerValue.processValue? headerValue.processValue(value) : value} </h4></td>
}


export default SortableTable;