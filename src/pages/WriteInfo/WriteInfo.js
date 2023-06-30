import React, { useEffect, useState } from 'react';
import './WriteInfo.css';
import { ReactComponent as ArrowNav } from "../../assets/icons/retour-fleche.svg";

const WriteInfo = () => {
  const [textSize, setTextSize] = useState(14);
  const [textSizeSectInf, setTextSizeSectInf] = useState(18);
  const [writingPage, setWritingPage] = useState(false);
  const [inputValues, setInputValues] = useState(['', '', '', '']);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileOrdreCriee, setImageFileOrdreCriee] = useState(null);

  useEffect(() => {
    const storedTextSize = localStorage.getItem('text-size');
    if (storedTextSize) {
      setTextSize(parseInt(storedTextSize));
    }

    const storedInputValues = [];
    for (let i = 0; i < inputValues.length; i++) {
      const storedValue = localStorage.getItem(`information${i + 1}`);
      storedInputValues.push(storedValue || '');
    }
    setInputValues(storedInputValues);

    const storedImage = localStorage.getItem('image');
    if (storedImage) {
      setImageFile(storedImage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('text-size', textSize);
  }, [textSize]);

  useEffect( () => {
    localStorage.setItem('text-size-2',textSizeSectInf)
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
    localStorage.removeItem('image');
    setImageFile(null);
  };

  const handleDeleteImageCriee = () => {
    localStorage.removeItem('image2');
    setImageFileOrdreCriee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enregistrer les informations textuelles dans le localStorage et mettre à jour l'état local
    for (let i = 0; i < inputValues.length; i++) {
      const inputValue = inputValues[i];
      localStorage.setItem(`information${i + 1}`, inputValue);
    }

    // Enregistrer l'image dans le localStorage ou envoyer l'image vers le serveur, selon vos besoins
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        localStorage.setItem('image', imageDataUrl);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  function validateImageCriee(){
    if (imageFileOrdreCriee) {
      const reader2 = new FileReader();
      reader2.onload = (event) => {
        const imageDataUrl = event.target.result;
        localStorage.setItem('image2', imageDataUrl);
      };
      reader2.readAsDataURL(imageFileOrdreCriee);
    }
  }

  function switchPage() {
    setWritingPage(!writingPage);
  }

  function Affichage1() {
    console.log('TEST AFFICHAGE')
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

  return (
    <>
      {!writingPage && (
        <div className='form-text'>
          <div className='sect-navigation'>
            <button className='switch-page' onClick={switchPage}>
              Paramètres <ArrowNav className='arrow-icon' />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
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
                <button type="submit" className="save-button">
                  Enregistrer
                </button>
                <button type="button" className="delete-button" onClick={handleDeleteImage}>
                  Supprimer l'image
                </button>
              </div>
              <div className='button-droite'>
                <input className='file-criee' type="file" onChange={handleImageChangeOrdreCriee} />
                <button onClick={validateImageCriee} className="save-button-criee">
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
