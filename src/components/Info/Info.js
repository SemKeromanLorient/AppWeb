import React from 'react';
import "./Info.css";
import {ReactComponent as KeromanIcon} from "../../assets/icons/Logo_SEM_Keroman.svg"
import { useEffect, useState } from 'react';
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";


function Info() {
    
    const [info1, setInfo1] = useState(null)
    const [info2, setInfo2] = useState(null)
    const [info3, setInfo3] = useState(null)
    const [info4, setInfo4] = useState(null)

    const [img1, setImg1] = useState(null)

    const [fontSize, SetFontSize] = useState(14)
    const [fontSize2, SetFontSize2] = useState(18)

    const [marginTitle,SetMarginTitle] = useState('')

    /*
    useEffect(() => {
        fetchInfo()
        //console.log("test data info1 : " + info1)
    },[])*/

    function fetchInfo(){
        getToServer('/infos/lastInfo', {}, ({data}) => {

            //console.log("Data : " + JSON.stringify(data[0]))
            setInfo1(data[0].Info1.replace(/\n/g, '<br>'));
            setInfo2(data[0].Info2.replace(/\n/g, '<br>'));
            setInfo3(data[0].Info3.replace(/\n/g, '<br>'));
            setInfo4(data[0].Info4.replace(/\n/g, '<br>'));

            setImg1(data[0].Image1);
        })
    }

    function fetchFont(){
        getToServer('/font/lastFont', {}, ({data}) => {
            SetFontSize((data[0]).sectSup)
            SetFontSize2((data[0]).sectInf)
        })
    }
      

    useEffect(() => {
        fetchInfo()
        fetchFont()
      
        if (fontSize >= 19) {
          SetMarginTitle('30px');
        } else {
          SetMarginTitle('20px'); // Remettre la valeur de marginTitle à une chaîne vide si la condition n'est pas satisfaite
        }
      }, []); // Observer les changements de fontSize
      

      if (!info1 && !info2 && !info3 && !info4 && !img1){
        return <div style={{color:"white"}}> Aucune information indiquée par les maîtres du port</div>;
    }

    return (
        <>
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
                    <p className='text-affichage' style={{ '--font-size': `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: info1 }}></p>
                </div>
                } 
                {info2 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: info2 }}></p>
                </div>
                }
                {info3 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: info3 }}></p>
                </div>}
                
                {info4 && <div className='text-row'>
                    <p className='text-affichage' style={{ '--font-size': `${fontSize2}px` }} dangerouslySetInnerHTML={{ __html: info4 }}></p>
                </div>
                }
                
            </div>
                
                <div className='image-container'>
                    {img1 && <img className='image-info-display' src={img1} alt="Image" />}
                </div>
            </div>
        </>
            
    );
}

export default Info;
/*
    const information1 = localStorage.getItem('information1');
    const formattedInformation1 = information1.replace(/\n/g, '<br>');

    const information2 = localStorage.getItem('information2');
    const formattedInformation2 = information2.replace(/\n/g, '<br>');

    const information3 = localStorage.getItem('information3');
    const formattedInformation3 = information3.replace(/\n/g, '<br>');

    const information4 = localStorage.getItem('information4');
    const formattedInformation4 = information4.replace(/\n/g, '<br>');

    const imageDataUrl = localStorage.getItem('image');

    {formattedInformation1 && <div className='text-row'>
         <p className='text-affichage' style={{ '--font-size': `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: formattedInformation1 }}></p>
    </div>
        } 
    {formattedInformation2 && <div className='text-row'>
        <p className='text-affichage' style={{ '--font-size': `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: formattedInformation2 }}></p>
        </div>
        }
    {formattedInformation3 && <div className='text-row'>
            <p className='text-affichage' style={{ '--font-size': `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: formattedInformation3 }}></p>
        </div>}
                
    {formattedInformation4 && <div className='text-row'>
        <p className='text-affichage' style={{ '--font-size': `${fontSize2}px` }} dangerouslySetInnerHTML={{ __html: formattedInformation4 }}></p>
        </div>
    }  
*/