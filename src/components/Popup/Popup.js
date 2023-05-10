import "./Popup.style.css";
import React from 'react';
import {ReactComponent as QuestionIcon} from '../../assets/icons/question.svg';
import {ReactComponent as ErrorIcon} from '../../assets/icons/error.svg';
import {ReactComponent as ValidIcon} from '../../assets/icons/correct.svg';
import Lottie from 'lottie-react';

const POPUP_VALID = 0;
const POPUP_ERROR = 1;
const POPUP_WARNING = 2;
const POPUP_QUESTION = 3;


function Popup({option, setOption}){

    function handleOnAccept(){
        if(option.onAccept){
            option.onAccept();
        }
        setOption(null);
    }

    function handleOnDecline(){
        if(option.onDecline){
            option.onDecline();
        }
        setOption(null);
    }

    return <>
        <div onClick={() => setOption(null)} className={"popup-background"+(!option? " hidden" : "")} />
        <div className={"popup-container "+(!option? " hidden" : "")}>

            {option && <>

                {option.Element ? <>
                
                    {new option.Element()}


                </> : <>

                    {option.lottie && <>
                        <Lottie className="popup-animation" animationData={option.lottie} />
                    </>}


                    {option.type === POPUP_VALID && <>
                    
                    
                    
                        <ValidIcon className="popup-icon valid" />


                    </>}


                    {option.type === POPUP_QUESTION && <>
                    
                    
                        <QuestionIcon className="popup-icon" />
                        

                    </>}

                    {option.type === POPUP_ERROR && <>
                    
                    

                        <ErrorIcon className="popup-icon" />
                        


                    </>}



                    <h2 className="main-text">{option.text}</h2>
                    <h3 className="secondary-text">{option.secondaryText}</h3>
                    <div onClick={handleOnAccept} className="accept-button">

                        <h4>{option.acceptText}</h4>

                    </div>
                    {option.type === POPUP_QUESTION && <>
                    
                    
                        <div onClick={handleOnDecline} className="decline-button">

                            <h4>{option.declineText}</h4>

                        </div>

                    

                    </>}

                </>}


               
                


                


            </>}


        </div>

    </>
}

export default Popup;
export {
    POPUP_VALID,
    POPUP_ERROR,
    POPUP_WARNING,
    POPUP_QUESTION
}