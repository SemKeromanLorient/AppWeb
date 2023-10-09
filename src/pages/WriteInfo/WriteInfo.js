import React, { useEffect, useState, useContext, useRef  } from 'react';
import './WriteInfo.css';
import { ReactComponent as ArrowNav } from "../../assets/icons/retour-fleche.svg";
import { ReactComponent as AddNew } from "../../assets/icons/add-new.svg";
import { ReactComponent as Remove } from "../../assets/icons/remove.svg";
import { validate } from 'schema-utils';
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

const WriteInfo = () => {

  const [button1State, setButton1State] = useState(true);
  const [button2State, setButton2State] = useState(true);
  const [button3State, setButton3State] = useState(true);
  const [button4State, setButton4State] = useState(true);

  const [policySize1, setPolicySize1] = useState('');
  const [policySize2, setPolicySize2] = useState('');
  const [policySize3, setPolicySize3] = useState('');
  const [policySize4, setPolicySize4] = useState('');

  const [currentPolicySize1, setCurrentPolicySize1] = useState(0);
  const [currentPolicySize2, setCurrentPolicySize2] = useState(0);
  const [currentPolicySize3, setCurrentPolicySize3] = useState(0);
  const [currentPolicySize4, setCurrentPolicySize4] = useState(0);

  const [info1, setInfo1] = useState(null)
  const [info2, setInfo2] = useState(null)
  const [info3, setInfo3] = useState(null)
  const [info4, setInfo4] = useState(null)

  const [delaiPage, setDelaiPage] = useState('');
  const [currentDelaiPage, setCurrentDelaiPage] = useState(10);

  const [inputValues, setInputValues] = useState(['', '', '', '']);
  const [imageFile, setImageFile] = useState(null);

  //Booléens pour se déplacer entre les sous-pages
  const [writingPage, setWritingPage] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);


  useEffect(() => {
    //Récupérer l'image de la derniere modif pour la stocké
    fetchInfo();
    fetchStateButton();
    fetchFontSize();
  }, []);

  useEffect( () => {
    console.log("WRITING PAGE : " + writingPage)
  },[writingPage])

  useEffect( () => {
    console.log("MORE OPTIONS : " + moreOptions)
  },[moreOptions])

  useEffect( () =>{
    setInputValues([info1,info2,info3,info4])

  },[info1, info2, info3, info4])

  useEffect( () => {
    if(imageFile){
      console.log("Image file : "+ imageFile.name)
    }
  },[imageFile])

  const handleInputChange = (e, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
  };


  const handleDeleteImage = () => {
    setImageFile(null);
    //Voir pour supprimer l'image (il faut passer par le backend server)
  };

  const handleSubmit = async (e) => {
    //Permet d'afficher la popup de demande de reconnexion
    e.preventDefault();

    addInfoMDP(inputValues[0],inputValues[1],inputValues[2],inputValues[3]);

    if (imageFile) {  
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const response = await fetch('https://service.keroman.fr/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Fichier téléchargé avec succès !');
        } else {
          console.error('Erreur lors du téléchargement du fichier.');
        }
      } catch (error) {
        console.error('Erreur lors de la requête : ', error);
      }
    } 

  };

  function savePolicySize(number){
    switch(number){
      case 1:
        updateFontSize2(policySize1,"1");
        break;
      case 2:
        updateFontSize2(policySize2,"2");
        break;
      case 3:
        updateFontSize2(policySize3,"3");
        break;
      case 4:
        updateFontSize2(policySize4,"4"); 
        break;
      //Délai entre les pages
      case 5: 
        updateDelaiPage(delaiPage)
    }
  }

  function toggleButtonState (buttonNumber) {
    switch (buttonNumber) { 
      case 1:
        setButton1State(!button1State);
        updateAffichage("1")
        break;
      case 2:
        setButton2State(!button2State);
        updateAffichage("2")
        break;
      case 3:
        setButton3State(!button3State);
        updateAffichage("3")
        break;
      case 4:
        setButton4State(!button4State);
        updateAffichage("4")
        break;
      default:
        break;
    }
  };

  function updateDelaiPage(delai){
    postToServer('/switchPage/updateDelai',{delai},({data}) => {
      console.log("Success, updateDelaiPage : " + JSON.stringify(data))
    })
  }

  function updateAffichage(index){
    postToServer('/switchPage/updateAffichage', {index}, ({data}) => {
      console.log("Success, updateAffichage : " + JSON.stringify(data))
    })
  }

  function updateFontSize2(size,index){
    postToServer('/font2/update', {size,index}, ({data}) => {
      console.log("Success, update : " + JSON.stringify(data));
    })
  }

  //C'est ici qu'a lieu la demande de reconnexion (lorsqu'on fait le postToServer)
  function addInfoMDP(INFO1, INFO2, INFO3, INFO4){
    
      postToServer('/infos/add', {INFO1, INFO2, INFO3, INFO4}, ({data}) => {
        console.log("Success, add : " + data);
    })
  }

  function fetchInfo(){
    getToServer('/infos/lastInfo', {}, ({data}) => {

        setInfo1(data[0].Info1.replace(/\n/g, '<br>'));
        setInfo2(data[0].Info2.replace(/\n/g, '<br>'));
        setInfo3(data[0].Info3.replace(/\n/g, '<br>'));
        setInfo4(data[0].Info4.replace(/\n/g, '<br>'));

    })
  }

  function fetchStateButton(){
    getToServer('/switchPage/',{}, ({data}) => {
      const state1 = (data[0].Page_Info === 1) ? true : false;
      setButton1State(state1);
      const state2 = (data[0].Page_Maree === 1) ? true : false;
      setButton2State(state2);
      const state3 = (data[0].Page_MeteoCotiere === 1) ? true : false;
      setButton3State(state3);
      const state4 = (data[0].Page_TirageCriee === 1) ? true : false;
      setButton4State(state4);
      
      setCurrentDelaiPage(data[0].delai);
    })
  }

  function fetchFontSize(){
    getToServer('/font2/', {} , ({data}) => {
      setCurrentPolicySize1(data[0].Size1);
      setCurrentPolicySize2(data[0].Size2);
      setCurrentPolicySize3(data[0].Size3);
      setCurrentPolicySize4(data[0].Size4);

    })
  }

  function switchPage() {
    setWritingPage(!writingPage);
  }

  function Affichage1() {
    updateFontSize2(14,"1");
    updateFontSize2(14,"2");
    updateFontSize2(14,"3");
  }

  function Affichage2() {
    updateFontSize2(18,"1");
    updateFontSize2(18,"2");
    updateFontSize2(18,"3");
  }

  function Affichage3() {
    updateFontSize2(24,"1");
    updateFontSize2(24,"2");
    updateFontSize2(24,"3");
  }
  
  function Affichage4() {
    updateFontSize2(18,"4");
  }

  function Affichage5() {
    updateFontSize2(24,"4");
  }

  function Affichage6() {
    updateFontSize2(30,"4");
  }

  function moreOptionsMenu(){
    setMoreOptions(!moreOptions)
  }

  return (
    <>
      {(!writingPage && !moreOptions) && (
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
            </div>
          </form>
        </div>
      )}

      {(writingPage && !moreOptions) && (
        <div className='params-update'>
          <div className='sect-navigation'>
            <div className='MedColum-col1'></div>
            <div className='MedColum-col2'>
              <button className='switch-page' onClick={switchPage}>
                Informations <ArrowNav className='arrow-icon' />
              </button>
              </div>
            <div className='MedColum-col3'>
              <AddNew className="addMenu" onClick={moreOptionsMenu}></AddNew>
            </div>
          </div>

          <br/><br/>
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

      {
        (writingPage && moreOptions) && (
          <div className='params-update'>
            <div className='sect-navigation-rem'>
              <div className='MedColum-col1'></div>
              <div className='MedColum-col2'> </div>
              <div className='MedColum-col3'>
                <Remove className="remMenu" onClick={moreOptionsMenu}></Remove>
              </div>
            </div>
            <div className='mainSect'>
              <div className='upSect'>
                <div className='High-col1'>

                  <div className="MedRow-row1"><h1 className='policy-title'> Police/Size </h1></div>

                  <div className="MedRow-row2">
                    <h2 className='policy-subTitle'> Première partie</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={currentPolicySize1}
                    onChange={(e) => setPolicySize1(e.target.value)}
                    />
                    <button className='update-policy2' onClick={() => savePolicySize(1)}> Valider</button>
                  </div>

                  <div className="MedRow-row3">
                    <h2 className='policy-subTitle'> Deuxième partie</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={currentPolicySize2}
                    onChange={(e) => setPolicySize2(e.target.value)}
                    /> 
                    <button className='update-policy2' onClick={() => savePolicySize(2)}> Valider</button>
                  </div>

                  <div className="MedRow-row4">
                    <h2 className='policy-subTitle'> Troisième partie</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={currentPolicySize3}
                    onChange={(e) => setPolicySize3(e.target.value)}
                    /> 
                    <button className='update-policy2' onClick={() => savePolicySize(3)}> Valider</button>
                  </div>

                  <div className="MedRow-row5">
                    <h2 className='policy-subTitle'> Quatrième partie</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={currentPolicySize4}
                    onChange={(e) => setPolicySize4(e.target.value)}
                    /> 
                    <button className='update-policy2' onClick={() => savePolicySize(4)}> Valider</button>
                  </div>



                </div>
                <div className='High-col2'>
                <div className="MedRow-row1"><h1 className='policy-title'> ON/OFF </h1></div>
                <div className="MedRow-row2">
                  <button 
                    className={`on-off-button ${button1State ? 'on' : 'off'}`}
                    onClick={() => toggleButtonState(1)}
                  > 
                  INFOS PORT DE PECHE </button>
                </div>
                <div className="MedRow-row3">
                <button 
                    className={`on-off-button ${button2State ? 'on' : 'off'}`}
                    onClick={() => toggleButtonState(2)}
                  > 
                  MARÉE SHOM </button>

                </div>
                <div className="MedRow-row4">
                <button 
                    className={`on-off-button ${button3State ? 'on' : 'off'}`}
                    onClick={() => toggleButtonState(3)}
                  > 
                  MÉTÉO MARINE COTIÈRE </button>

                </div>
                <div className="MedRow-row5">
                <button 
                    className={`on-off-button ${button4State ? 'on' : 'off'}`}
                    onClick={() => toggleButtonState(4)}
                  > 
                  TIRAGE DU JOUR </button>

                </div>
                </div>
              </div>
              <div className='infSect'>
                <div className='delai-div'>
                  <h1 className='policy-title-delai'> Délai page : </h1>
                  <input className='input-delai' type="number" id="nombre" name="nombre" min="1"  
                  style={{
                    WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                    MozAppearance: "textfield" /* Pour Firefox */
                  }}
                  onChange={(e) => setDelaiPage(e.target.value)}
                  placeholder={currentDelaiPage}
                  />
                </div>
                <div className='validate-delai-div'>
                  <button className='update-policy2'
                  onClick={() => savePolicySize(5)}
                  >Valider</button>
                </div>
              </div>
            </div>
          </div>
          
        )
      }
    </>
  );
};

export default WriteInfo;
