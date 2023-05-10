import "./RegisterDevice.style.css";
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function RegisterDevice(){


    const [code, setCode] = useState("")


    return <div className="register">

                <div className="video-wrapper">

                        <QrReader

                        

                        onResult={(result, error) => {
                        if (result && result.text) {
                            setCode(result.text)
                        }

                        if (!!error) {
                            //console.info(error);
                        }
                        }}
                        className="video-scanner"
                    
                        />
                </div>


            <h1>{code}</h1>

    </div>


}

export default RegisterDevice;