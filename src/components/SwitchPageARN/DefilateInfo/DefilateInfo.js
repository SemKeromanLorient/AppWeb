import React from 'react';
import "./DefilateInfo.css";
import { ReactComponent as KeromanIcon } from "../../../assets/icons/Logo_SEM_Keroman.svg";
import { useEffect, useState } from 'react';
import { getToServer } from "../../../utils/serverHttpCom.js";

function DefilateInfo() {
    const [titleInfo, setTitleInfo] = useState(null);
    const [texteInfo, setTextInfo] = useState(null);
    const [fontTitleInfo, setFontTitleInfo] = useState(12);
    const [fontTexteInfo, setFontTextInfo] = useState(12);
    
    const [titleEnvironnement, setTitleEnvironnement] = useState(null);
    const [texteEnvironnement, setTexteEnvironnement] = useState(null);
    const [fontTitleEnvironnement, setFontTitleEnvironnement] = useState(12);
    const [fontTexteEnvironnement, setFontTexteEnvironnement] = useState(12);

    const [marginTitle, setMarginTitle] = useState('');

    function fetchInfo() {
        getToServer('/infosARN/lastInfo', {}, ({ data }) => {
            setTitleInfo(data[0].Info1.replace(/\n/g, '<br>'));
            setTextInfo(data[0].Info2.replace(/\n/g, '<br>'));
            setTitleEnvironnement(data[0].Info3.replace(/\n/g, '<br>'));
            setTexteEnvironnement(data[0].Info4.replace(/\n/g, '<br>'));
        });
    }

    function fetchFont() {
        getToServer('/fontARN/getAll', {}, ({ data }) => {
            setFontTitleInfo((data[0]).Size1);
            setFontTextInfo((data[0]).Size2);
            setFontTitleEnvironnement((data[0]).Size3);
            setFontTexteEnvironnement((data[0]).Size4);
        });
    }
    useEffect(() => {
        fetchInfo();
        fetchFont();
    }, []);

    useEffect(() => {
        if (fontTitleInfo >= 20) {
            setMarginTitle('30px');
        } else {
            setMarginTitle('20px');
        }
    }, [fontTitleInfo]);

    if (!titleInfo && !texteInfo && !titleEnvironnement && !texteEnvironnement) {
        return <div style={{ color: "white" }}>Aucune information indiquée par l'ARN</div>;
    }

    return (
        <>
            <div className='container-display-ARN'>
                <div className='scroll-container-ARN'>
                    <div className='scroll-content-ARN'>
                        {titleInfo && (
                            <div className='text-col-ARN'>
                                <div className='sect-title-ARN'>   
                                    <p className='text-affichage-ARN infoARN' style={{ fontSize: `${fontTitleInfo}px` }} dangerouslySetInnerHTML={{ __html: titleInfo }}></p>
                                </div>
                                <div className='sect-text-ARN'>
                                    <p className='text-affichage-ARN infoARN' style={{ fontSize: `${fontTexteInfo}px` }} dangerouslySetInnerHTML={{ __html: texteInfo }}></p>
                                </div>
                            </div>
                        )}
                        {titleEnvironnement && (
                            <div className='text-col-ARN'>
                                <div className='sect-title-ARN'>
                                    <p className='text-affichage-ARN environnement' style={{ fontSize: `${fontTitleEnvironnement}px` }} dangerouslySetInnerHTML={{ __html: titleEnvironnement }}></p>
                                </div>
                                <div className='sect-text-ARN'>
                                    <p className='text-affichage-ARN environnement' style={{ fontSize: `${fontTexteEnvironnement}px` }} dangerouslySetInnerHTML={{ __html: texteEnvironnement }}></p>
                                </div>
                            </div>
                        )}
                        {titleInfo && (
                            <div className='text-col-ARN'>
                                <div className='sect-title-ARN'>   
                                    <p className='text-affichage-ARN infoARN' style={{ fontSize: `${fontTitleInfo}px` }} dangerouslySetInnerHTML={{ __html: titleInfo }}></p>
                                </div>
                                <div className='sect-text-ARN'>
                                    <p className='text-affichage-ARN infoARN' style={{ fontSize: `${fontTexteInfo}px` }} dangerouslySetInnerHTML={{ __html: texteInfo }}></p>
                                </div>
                            </div>
                        )}
                        {titleEnvironnement && (
                            <div className='text-col-ARN'>
                                <div className='sect-title-ARN'>
                                    <p className='text-affichage-ARN environnement' style={{ fontSize: `${fontTitleEnvironnement}px` }} dangerouslySetInnerHTML={{ __html: titleEnvironnement }}></p>
                                </div>
                                <div className='sect-text-ARN'>
                                    <p className='text-affichage-ARN environnement' style={{ fontSize: `${fontTexteEnvironnement}px` }} dangerouslySetInnerHTML={{ __html: texteEnvironnement }}></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default DefilateInfo;
