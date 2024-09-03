import React, { useEffect, useState } from 'react';
import Widget from '../../widget';
import "./Maree.css"; 
import axios from 'axios';
import { postToServer, getToServer } from "../../../utils/serverHttpCom.js";

function Maree() {
  const [script, setScript] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await getScript();
        setScript(value);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className='maree'> 
      <Widget data={script} />
    </div>
  );
}

async function getScript() {
  try { 
    return new Promise((resolve, reject) => {
      getToServer('/utility/fetch-url', {}, ({ data }) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default Maree;
