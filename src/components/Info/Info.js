import React from 'react';
import "./Info.css";
import {ReactComponent as KeromanIcon} from "../../assets/icons/Logo_SEM_Keroman.svg"
import { useEffect, useState } from 'react';


function Info() {
    
    if (!localStorage.getItem('information1') && !localStorage.getItem('information2') && !localStorage.getItem('information3') && !localStorage.getItem('information4')) {
        return <div style={{color:"white"}}> Aucune information indiquée par les maîtres du port</div>;
    }

    const information1 = localStorage.getItem('information1');
    const formattedInformation1 = information1.replace(/\n/g, '<br>');

    const information2 = localStorage.getItem('information2');
    const formattedInformation2 = information2.replace(/\n/g, '<br>');

    const information3 = localStorage.getItem('information3');
    const formattedInformation3 = information3.replace(/\n/g, '<br>');

    const information4 = localStorage.getItem('information4');
    const formattedInformation4 = information4.replace(/\n/g, '<br>');

    const imageDataUrl = localStorage.getItem('image');

    const [fontSize, SetFontSize] = useState(14)
    const [fontSize2, SetFontSize2] = useState(18)

    const [marginTitle,SetMarginTitle] = useState('')

    useEffect(() => {
        if (localStorage.getItem('text-size')) {
          SetFontSize(localStorage.getItem('text-size'));
        } else if (localStorage.getItem('text-size-2')){
            SetFontSize2(localStorage.getItem('text-size-2'))
        }
      
        if (fontSize >= 19) {
          SetMarginTitle('30px');
        } else {
          SetMarginTitle('20px'); // Remettre la valeur de marginTitle à une chaîne vide si la condition n'est pas satisfaite
        }
      }, [fontSize]); // Observer les changements de fontSize
      

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
                
            </div>
                
                <div className='image-container'>
                    {imageDataUrl && <img className='image-info-display' src={imageDataUrl} alt="Image" />}
                </div>
            </div>
        </>
            
    );
}

export default Info;
