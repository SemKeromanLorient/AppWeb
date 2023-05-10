import React,{ useState } from "react";
import "./BorneSelection.style.css"
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete.svg';
import {ReactComponent as ValidIcon} from '../../assets/icons/valid.svg';
import { useNavigate } from "react-router-dom";

function BorneSelection(){


    const [priseNumber, setPriseNumber] = useState("");
    const keyPad = [9,8,7,6,5,4,3,2,1,0]

    const navigate = useNavigate();

    function handleOnClick(keypressed){

        if(priseNumber.length < 4){
            setPriseNumber(priseNumber + keypressed)
        }

    }

    function handleDelete(){
        setPriseNumber(priseNumber.substring(0, priseNumber.length -1))
    }

    function handleValid(){
        navigate('/borne/control/'+priseNumber)
    }

    return <div>


        <div className="prise-number-container">
            <h1>{priseNumber}</h1>
        </div>

        <div className="num-pad-container">

            
            {keyPad.map((value, index) => <KeyPad value={value} onClick={handleOnClick} key={index}/>)}
            <KeyPad onClick={handleDelete} Icon={DeleteIcon} className={"del-button"}/>
            <KeyPad onClick={handleValid} Icon={ValidIcon} className={"valid-button"}/>

        </div>

    </div>

}


function KeyPad({value, Icon, className, onClick}){

    const [onPress, setOnPress] = useState(false);


    function handlePressIn(){
        setOnPress(true)
    }

    function handlePressOut(){
        setOnPress(false)
        onClick(value)
        
    }


    return <div onTouchStart={handlePressIn} onTouchEnd={handlePressOut} className={"key-pad "+(onPress? "pressed " : " " )+ (className? className : "")}>
        {Icon? <Icon className={"key-pad-icon"} /> : <h2>{value}</h2>}
    </div>

}
export default BorneSelection;