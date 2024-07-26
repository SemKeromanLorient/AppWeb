import React, { useEffect, useState, useContext, useRef  } from 'react';
import './WriteInfoARN.css';
import { ReactComponent as ArrowNav } from "../../assets/icons/retour-fleche.svg";
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

const WriteInfoARN = () => {

  const [button1State, setButton1State] = useState(true);
  const [button2State, setButton2State] = useState(true);
  const [button3State, setButton3State] = useState(true);
  const [button4State, setButton4State] = useState(true);

  const [policySize1, setPolicySize1] = useState(0);
  const [policySize2, setPolicySize2] = useState(0);
  const [policySize3, setPolicySize3] = useState(0);
  const [policySize4, setPolicySize4] = useState(0);

  const [currentPolicySize1, setCurrentPolicySize1] = useState(0);
  const [currentPolicySize2, setCurrentPolicySize2] = useState(0);
  const [currentPolicySize3, setCurrentPolicySize3] = useState(0);
  const [currentPolicySize4, setCurrentPolicySize4] = useState(0);

  const [info1, setInfo1] = useState(null)
  const [info2, setInfo2] = useState(null)
  const [info3, setInfo3] = useState(null)
  const [info4, setInfo4] = useState(null)

  const [delaiPageDefilateInfo, setDelaiPageDefilateInfo] = useState(0);
  const [delaiPageMétéo, setDelaiPageMétéo] = useState(0);
  const [delaiPagePlanning, setDelaiPagePlanning] = useState(0);

  const [currentDelaiPage, setCurrentDelaiPage] = useState(10);

  const [inputValuesMessage, setInputValuesMessage] = useState(['', '']);
  const [inputValuesEnvironnement, setInputValuesEnvironnement] = useState(['', '']);
  const [imageFile, setImageFile] = useState(null);

  const [options, setOptions] = useState(false);

  useEffect(() => {
    fetchInfo();
    fetchStateAndDelay();
    fetchFontSize();
  }, []);

  useEffect( () =>{
    setInputValuesMessage([info1,info2])
    setInputValuesEnvironnement([info3,info4])
  },[info1, info2, info3, info4])

  useEffect(() => {
    console.log("Informations délai : ")
    console.log("Délai defilateInfo : " + delaiPageDefilateInfo)
    console.log("Délai pageMétéo : " + delaiPageMétéo)
    console.log("Délai pagePlanning : " + delaiPagePlanning)

  },[delaiPageDefilateInfo, delaiPageMétéo, delaiPagePlanning])

  function fetchInfo(){
    getToServer('/infosARN/lastInfo', {}, ({data}) => {

      setInfo1(data[0].Info1.replace(/<br\s*\/?>/gi, '\n').trim());
      setInfo2(data[0].Info2.replace(/<br\s*\/?>/gi, '\n').trim());
      setInfo3(data[0].Info3.replace(/<br\s*\/?>/gi, '\n').trim());
      setInfo4(data[0].Info4.replace(/<br\s*\/?>/gi, '\n').trim());

    })
  }

  function fetchFontSize(){ 
    getToServer('/fontARN/getAll', {} , ({data}) => {
      setPolicySize1(data[0].Size1);
      setPolicySize2(data[0].Size2);
      setPolicySize3(data[0].Size3);
      setPolicySize4(data[0].Size4);

    })
  }

  function fetchStateAndDelay(){
    getToServer('/switchPageARN/',{}, ({data}) => {
      const state1 = (data[0].Page_Info === 1) ? true : false;
      setButton1State(state1);
      const state2 = (data[0].Page_Environnement === 1) ? true : false;
      setButton2State(state2);
      const state3 = (data[0].Page_Météo === 1) ? true : false;
      setButton3State(state3);
      const state4 = (data[0].Page_Planning === 1) ? true : false;
      setButton4State(state4);
      
      setDelaiPageDefilateInfo(data[0].Délai_Page_DefilateInfo);
      setDelaiPageMétéo(data[0].Délai_Page_Météo);
      setDelaiPagePlanning(data[0].Délai_Page_Planning);
    })
  }

  function addInfoARN(INFO1, INFO2, INFO3, INFO4){
    postToServer('/infosARN/add', {INFO1, INFO2, INFO3, INFO4}, ({data}) => {
      console.log("Success, add : " + data);
    })
  }

  function addAllDelai(){
    postToServer('/switchPageARN/updateDelai', {index: '1', delai : delaiPageDefilateInfo}, ({data}) => {
      console.log("Success, add : " + data);
    })
    postToServer('/switchPageARN/updateDelai', {index: '2', delai : delaiPageMétéo}, ({data}) => {
      console.log("Success, add : " + data);
    })
    postToServer('/switchPageARN/updateDelai', {index: '3', delai : delaiPagePlanning}, ({data}) => {
      console.log("Success, add : " + data);
    })
  }

  function addAllSize(){
    postToServer('/fontARN/update', {size: policySize1, index: '1'}, ({data}) => {
      console.log("Success, add : " + data);
    })
    postToServer('/fontARN/update', {size: policySize2, index: '2'}, ({data}) => {
      console.log("Success, add : " + data);
    })
    postToServer('/fontARN/update', {size: policySize3, index: '3'}, ({data}) => {
      console.log("Success, add : " + data);
    })
    postToServer('/fontARN/update', {size: policySize4, index: '4'}, ({data}) => {
      console.log("Success, add : " + data);
    })
  }

  function updateAffichage(index){
    postToServer('/switchPageARN/updateAffichage', {index}, ({data}) => {
      console.log("Success, updateAffichage : " + JSON.stringify(data))
    })
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

  function switchPage(){
    setOptions(!options)
  }

  function handleSubmit(){
    addInfoARN(inputValuesMessage[0], inputValuesMessage[1], inputValuesEnvironnement[0],inputValuesEnvironnement[1])
  }

  function handleSubmitParams(){
    addAllDelai();
    addAllSize();
  }

  const handleInputChangeMessage = (e, index) => {
    const newInputValues = [...inputValuesMessage];
    newInputValues[index] = e.target.value;
    setInputValuesMessage(newInputValues);
  };

  const handleInputChangeEnvironnement = (e, index) => {
    const newInputValues = [...inputValuesEnvironnement];
    newInputValues[index] = e.target.value;
    setInputValuesEnvironnement(newInputValues);
  };

  return (
    <>
    {!options && 
      <div className='form-text'>
        <div className='sect-params'>
          <button className='switch-page' onClick={switchPage}>
            Paramètres <ArrowNav className='arrow-icon' />
          </button>
        </div>
        <form>
          <h2 className='secondary-title'>Page message</h2>
          {inputValuesMessage.map((inputValue, index) => (
            <textarea
              className='inputARN'
              key={index}
              value={inputValue}
              onChange={(e) => handleInputChangeMessage(e, index)}
            />
          ))}
        </form>
        <form>
          <h2 className='secondary-title'>Page environnement</h2>
          {inputValuesEnvironnement.map((inputValue, index) => (
            <textarea
              key={index}
              value={inputValue}
              onChange={(e) => handleInputChangeEnvironnement(e, index)}
            />
          ))}
        </form>
        <div className='section-button'>
          <button type='submit' className="save-button-2" onClick={handleSubmit}>
            Enregistrer
          </button>
        </div>
      </div>
    }

    {options && 
    // <div className='form-text'>
    //   <h1> TEST OPTIONS PARAMETRES </h1>
    // </div>

    <div className='params-update'>
            <div className='mainSect'>
              <div className='sect-params'>
                <button className='switch-page' onClick={switchPage}>
                  Informations <ArrowNav className='arrow-icon' />
                </button>
              </div>
              <div className='upSect'>
                <div className='High-col1'>

                  <div className="MedRow-row1"><h1 className='policy-title'> Police/Size </h1></div>

                  <div className="MedRow-row2">
                    <h2 className='policy-subTitle'> Titre Info.</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={policySize1}
                    onChange={(e) => setPolicySize1(e.target.value)}
                    />
                  </div>

                  <div className="MedRow-row3">
                    <h2 className='policy-subTitle'> Texte Info.</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={policySize2}
                    onChange={(e) => setPolicySize2(e.target.value)}
                    /> 
                  </div>

                  <div className="MedRow-row4">
                    <h2 className='policy-subTitle'> Titre Env.</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={policySize3}
                    onChange={(e) => setPolicySize3(e.target.value)}
                    /> 
                  </div>

                  <div className="MedRow-row5">
                    <h2 className='policy-subTitle'> Texte Env.</h2>
                    <input type="number" className='input-policy' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={policySize4}
                    onChange={(e) => setPolicySize4(e.target.value)}
                    /> 
                  </div>

                </div>
                <div className='High-col2'>
                <div className="MedRow-row1"><h1 className='policy-title'> ON/OFF </h1></div>
                <div className="MedRow-row2">
                  <div className='Med-col'>
                    <button 
                      className={`on-off-button-ARN ${button1State ? 'on' : 'off'}`}
                      onClick={() => toggleButtonState(1)}
                    > 
                    INFORMATIONS ARN </button>
                  </div>
                  <div className='Med-col'>
                    <input type="number" className='input-delay-defilate-info' id="nombre" name="nombre" min="1"  
                      style={{
                          WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                          MozAppearance: "textfield" /* Pour Firefox */
                      }}
                      placeholder={delaiPageDefilateInfo}
                      onChange={(e) => setDelaiPageDefilateInfo(e.target.value)}
                      /> 
                  </div>
                </div>
                <div className="MedRow-row3">

                  <div className='Med-col'>
                    <button 
                      className={`on-off-button-ARN ${button2State ? 'on' : 'off'}`}
                      onClick={() => toggleButtonState(2)}
                    > 
                    ENVIRONNEMENT </button>
                  </div>

                  <div className='Med-col'>
                  </div>

                </div>
                <div className="MedRow-row4">
                  
                  <div className='Med-col'>
                    <button 
                      className={`on-off-button-ARN ${button3State ? 'on' : 'off'}`}
                      onClick={() => toggleButtonState(3)}
                    > 
                    MÉTÉO MARINE </button>
                  </div>

                  <div className='Med-col'>
                    <input type="number" className='input-delay' id="nombre" name="nombre" min="1"  
                      style={{
                          WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                          MozAppearance: "textfield" /* Pour Firefox */
                      }}
                      placeholder={delaiPageMétéo}
                      onChange={(e) => setDelaiPageMétéo(e.target.value)}
                      /> 
                  </div>
                </div>
                <div className="MedRow-row5">

                  <div className='Med-col'>
                    <button 
                      className={`on-off-button-ARN ${button4State ? 'on' : 'off'}`}
                      onClick={() => toggleButtonState(4)}
                    > 
                    PLANNING ARN </button>
                  </div>

                  <div className='Med-col'>
                    <input type="number" className='input-delay' id="nombre" name="nombre" min="1"  
                    style={{
                        WebkitAppearance: "none", /* Pour les navigateurs Webkit (Chrome, Safari) */
                        MozAppearance: "textfield" /* Pour Firefox */
                    }}
                    placeholder={delaiPagePlanning}
                    onChange={(e) => setDelaiPagePlanning(e.target.value)}
                    /> 
                  </div>

                </div>
                </div>
              </div>
              <div className='infSect'>
              <button type='submit' className="save-button-2" onClick={handleSubmitParams}>
                Enregistrer
              </button>
              </div>
            </div>
      </div>
    
    }
    </>
  );
};

export default WriteInfoARN;
