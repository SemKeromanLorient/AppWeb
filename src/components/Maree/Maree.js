/*import React, { useEffect, useState } from 'react';
import Widget from '../widget';
import "./Maree.css"; 
import axios from 'axios';
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

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


  useEffect(() => {
    console.log("SCRIPT TEST : " + script)
  },[script])

  return (
    <div className='maree'> 
      <Widget data={script} />
    </div>
  );
}

async function getScript() {
  try { 
    getToServer('/fetch-url', {}, ({data}) => {
      return data
    })
    //const response = await axios.get('http://192.168.130.102:8080/fetch-url'); //http://192.168.130.102:8080/fetch-url
    //return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default Maree;
*/

import React, { useEffect, useState } from 'react';
import Widget from '../widget';
import "./Maree.css"; 
import axios from 'axios';
import { postToServer, getToServer } from "../../utils/serverHttpCom.js";

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

  useEffect(() => {
    console.log("SCRIPT TEST : " + script)
  }, [script]);

  return (
    <div className='maree'> 
      <Widget data={script} />
    </div>
  );
}

async function getScript() {
  try { 
    return new Promise((resolve, reject) => {
      getToServer('/fetch-url', {}, ({ data }) => {
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
