import React, { useEffect, useState } from 'react';
import './WriteInfo.css';
import { ReactComponent as ArrowNav } from "../../assets/icons/retour-fleche.svg";
import { validate } from 'schema-utils';
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";


const WriteInfo = () => {
      
  const [info1, setInfo1] = useState(null)
  const [info2, setInfo2] = useState(null)
  const [info3, setInfo3] = useState(null)
  const [info4, setInfo4] = useState(null)

  const [img1, setImg1] = useState(null)

  const [textSize, setTextSize] = useState(14);
  const [textSizeSectInf, setTextSizeSectInf] = useState(18);
  const [writingPage, setWritingPage] = useState(false);
  const [inputValues, setInputValues] = useState(['', '', '', '']);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileOrdreCriee, setImageFileOrdreCriee] = useState(null);

  useEffect(() => {
    //Récupérer l'image de la derniere modif pour la stocké
    fetchInfo();
  }, []);

  useEffect( () =>{
    setInputValues([info1,info2,info3,info4])

  },[info1, info2, info3, info4])

  useEffect(() => {
    updateFontSize(textSize,1)

  }, [textSize]);

  useEffect( () => {
    updateFontSize(textSizeSectInf,2)
  },[textSizeSectInf])
  
  const handleInputChange = (e, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleImageChangeOrdreCriee = (e) => {
    const file = e.target.files[0];
    setImageFileOrdreCriee(file);

  };

  const handleDeleteImage = () => {
    setImageFile(null);
    addInfoMDP(inputValues[0],inputValues[1],inputValues[2],inputValues[3],null);
  };

  const handleDeleteImageCriee = () => {
    setImageFileOrdreCriee(null);
    addInfoCriee(null)
  };

  const handleSubmit = (e) => {
    //Permet d'afficher la popup de demande de reconnexion
    e.preventDefault();

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        addInfoMDP(inputValues[0],inputValues[1],inputValues[2],inputValues[3],imageDataUrl);
      };
      reader.readAsDataURL(imageFile); // Permet de stocker l'image comme un url
    } else{
      addInfoMDP(inputValues[0],inputValues[1],inputValues[2],inputValues[3],img1);
    }


  };

  //C'est ici qu'a lieu la demande de reconnexion (lorsqu'on fait le postToServer)
  function addInfoMDP(INFO1, INFO2, INFO3, INFO4, Img1, Img2){
    
      postToServer('/infos/add', {INFO1, INFO2, INFO3, INFO4, Img1, Img2}, ({data}) => {
        console.log("Success, add : " + data);
    })
  }

  /**
   * Inscrit dans la bdd l'information de la taille d'écriture
   * @param {*} Size Taille d'écriture a inscrire
   * @param {*} ind Emplacement pour la taille d'écriture (partie supérieur ou inférieur)
   */
  function updateFontSize(Size,ind){
    if (ind === 1){
      let Size1 = Size;
      let Size2 = textSizeSectInf
      postToServer('/font/add', {Size1, Size2}, ({data}) => {
        console.log("Success, add : " + data)
      })
    } else if (ind == 2){
      let Size1 = textSize;
      let Size2 = Size;
      postToServer('/font/add', {Size1 , Size2}, ({data}) => {
        console.log("Success, add : " + data)
      })
    }
  }

  function addInfoCriee(image){
    postToServer('/criee/add', {image}, ({data}) => {
      console.log("Succes, add : " + data)
    })
  }

  function validateImageCriee(){
    if (imageFileOrdreCriee) {
      const reader2 = new FileReader();
      reader2.onload = (event) => {
        const imageDataUrl = event.target.result;
        addInfoCriee(imageDataUrl);
      };
      reader2.readAsDataURL(imageFileOrdreCriee);
    }
  }

  function fetchInfo(){
    getToServer('/infos/lastInfo', {}, ({data}) => {

        setInfo1(data[0].Info1.replace(/\n/g, '<br>'));
        setInfo2(data[0].Info2.replace(/\n/g, '<br>'));
        setInfo3(data[0].Info3.replace(/\n/g, '<br>'));
        setInfo4(data[0].Info4.replace(/\n/g, '<br>'));

        setImg1(data[0].Image1);


    })
}
  function switchPage() {
    setWritingPage(!writingPage);
  }

  function Affichage1() {
    setTextSize(14);
  }

  function Affichage2() {
    setTextSize(18);
  }

  function Affichage3() {
    setTextSize(24);
  }
  
  function Affichage4() {
    setTextSizeSectInf(18);
  }

  function Affichage5() {
    setTextSizeSectInf(24);
  }

  function Affichage6() {
    setTextSizeSectInf(30);
  }
  function test() {
    console.log("WOAW")
  }
  return (
    <>
      {!writingPage && (
        <div className='form-text'>
          <div className='sect-navigation'>
            <button className='switch-page' onClick={switchPage}>
              Paramètres <ArrowNav className='arrow-icon' />
            </button>
          </div>
          <form>
            {inputValues.map((inputValue, index) => (
              <textarea
                key={index}
                value={inputValue}
                onChange={(e) => handleInputChange(e, index)}
              />
            ))}
            <div>
              <div className='button-gauche'>
                <input className='file' type="file" onChange={handleImageChange} />
                <button type='submit' className="save-button" onClick={handleSubmit}>
                  Enregistrer
                </button>
                <button type="button" className="delete-button" onClick={handleDeleteImage}>
                  Supprimer l'image
                </button>
              </div>
              <div className='button-droite'>
                <input className='file-criee' type="file" onChange={handleImageChangeOrdreCriee} />
                <button type='button' onClick={validateImageCriee} className="save-button-criee">
                  Enregistrer - Ordre criée
                </button>
                <button type='button' className='delete-button' onClick={handleDeleteImageCriee} style={{marginLeft:'10px'}}>
                  Supprimer l'image
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {writingPage && (
        <div className='params-update'>
          <div className='sect-navigation'>
            <button className='switch-page' onClick={switchPage}>
              Informations <ArrowNav className='arrow-icon' />
            </button>
          </div>
          <br/><br/><br/>
          <h1 className='policy-title'>Section supérieur :  </h1>
          <div className='sect-policy'>
            <button className='update-policy' onClick={Affichage1}>
              Affichage 1 (Petit)
            </button>
            <button className='update-policy' onClick={Affichage2}>
              Affichage 2 (Moyen)
            </button>
            <button className='update-policy' onClick={Affichage3}>
              Affichage 3 (Grand)
            </button>
          </div>
          <h1 className='policy-title'> Section inferieur :</h1>

          <div className='sect-policy-2'>
          <button className='update-policy' onClick={Affichage4}>
              Affichage 1 (Moyen)
            </button>
            <button className='update-policy' onClick={Affichage5}>
              Affichage 2 (Grand)
            </button>
            <button className='update-policy' onClick={Affichage6}>
              Affichage 3 (Très grand)
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WriteInfo;
