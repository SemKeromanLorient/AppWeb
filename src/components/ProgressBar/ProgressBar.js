import React from "react";
import "./ProgressBar.style.css"

function ProgressBar({error, currentProgress, range, Found}){

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    return <div className="progress-bar-container" >
        <div className={"progress-bar "+(error||!Found? 'error': '')} style={{width: (map(currentProgress, range[0], range[1], 0, 100))+"%"}}/>
    </div>

}

export default ProgressBar;