import React, { useEffect, useState } from "react";
import "./Toast.style.css";

function Toast({option, setOption}){

    let timeOut;
    const [shown, setShown] = useState(false);

    useEffect(() => {

        if(option){
            setShown(true);
            if(timeOut)clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                setShown(false);
                setTimeout(() => {
                    setOption(null);
                }, 1000)
            }, option.duration | 2000)
        }
      
    }, [option])


    return <div className={"toast-container "+(!shown? "hidden" : "")}>

        {option && <>

            <h4>{option.text}</h4>

        </>}


    </div>

}

export default Toast;