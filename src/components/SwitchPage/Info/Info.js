import React from 'react';
import "./Info.css";
import {ReactComponent as KeromanIcon} from "../../../assets/icons/Logo_SEM_Keroman_Black.svg"
import { useEffect, useState } from 'react';
import { postToServer, getToServer } from "../../../utils/serverHttpCom.js";
import axios from 'axios';

function Info() {

    const [info1, setInfo1] = useState(null)
    const [info2, setInfo2] = useState(null)
    const [info3, setInfo3] = useState(null)
    const [info4, setInfo4] = useState(null)
 
    const [fontSize1, SetFontSize1] = useState(14)
    const [fontSize2, SetFontSize2] = useState(14)
    const [fontSize3, SetFontSize3] = useState(14)
    const [fontSize4, SetFontSize4] = useState(18)

    const [marginTitle,SetMarginTitle] = useState('')

    function fetchInfo(){
        getToServer('/infos/lastInfo', {}, ({data}) => {

            //console.log("Data : " + JSON.stringify(data[0]))
            setInfo1(data[0].Info1.replace(/\n/g, '<br>'));
            setInfo2(data[0].Info2.replace(/\n/g, '<br>'));
            setInfo3(data[0].Info3.replace(/\n/g, '<br>'));
            setInfo4(data[0].Info4.replace(/\n/g, '<br>'));

        })
    }

    
    function fetchFont(){
        getToServer('/font/getAll',{},({data}) => {
            SetFontSize1((data[0]).Size1)
            SetFontSize2((data[0]).Size2)
            SetFontSize3((data[0]).Size3)
            SetFontSize4((data[0]).Size4)
        })
    }

    useEffect(() => {

        fetchInfo()
        fetchFont()

        if (fontSize1 >= 19) {
          SetMarginTitle('30px');
        } else {
          SetMarginTitle('20px');
        }
      }, []);
      

      if (!info1 && !info2 && !info3 && !info4){
        return <div style={{color:"white"}}> Aucune information indiquée par les maîtres du port</div>;
    }

    return (
        
        <div className='container-display'>
            <div className='row-container-1' style={{marginBottom: marginTitle}}>
                
                <h2 className='title-sect-info'>Informations port de pêche - SEM Lorient Keroman </h2>

                <div className='row-icons'>
                    <div className='col-gauche'>
                        <KeromanIcon/>
                    </div>
                    <div className='col-droite'>
                        <KeromanIcon/>
                    </div>
                </div>
                
            </div>
            <div className='row-container-2'>

                {info1 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize1}px` }} dangerouslySetInnerHTML={{ __html: info1 }}></p>
                </div>
                } 
                {info2 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize2}px` }} dangerouslySetInnerHTML={{ __html: info2 }}></p>
                </div>
                }
                {info3 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize3}px` }} dangerouslySetInnerHTML={{ __html: info3 }}></p>
                </div>}
                
                {info4 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize4}px` }} dangerouslySetInnerHTML={{ __html: info4 }}></p>
                </div>
                }
                
            </div>
                
                <div className='image-container'>
                    <img className='image-info-display' src="https://service.keroman.fr/images/imageCriee.jpg" alt="Aucune image" />
                </div>
        </div>
            
    );
}

export default Info;
