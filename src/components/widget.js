import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "./widget.css";

function Widget(data) {
  const [data2, setData2] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeWindow = iframeRef.current.contentWindow;
    const scriptElement = iframeWindow.document.querySelector('script');

    if (scriptElement) {
      // Supprimer l'ancien script
      scriptElement.remove();
    }

    // Créer et ajouter le nouveau script
    const newScriptElement = iframeWindow.document.createElement('script');
    newScriptElement.textContent = data.data;
    iframeWindow.document.body.appendChild(newScriptElement);

    setData2(data.data);
  }, [data.data]);
  return (
    <div>
      <iframe
        ref={iframeRef}
        src="about:blank"
        width="680"
        height="890"
        title="Widget IFrame"
      ></iframe>
    </div>
  );
}

export default Widget;
