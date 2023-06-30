import React, { useEffect, useState } from 'react';
import Widget from '../widget';
import "./Maree.css"; 
import axios from 'axios';

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
    const response = await axios.get('http://192.168.130.102:8080/fetch-url');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default Maree;
