import { createContext } from "react";
import React, { useState } from "react";

const AffichageContext = createContext();

const AffichageContextProvider = ({children}) => {
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    const [number3, setNumber3] = useState(0);
    const [number4, setNumber4] = useState(0);

    return (
        <AffichageContext.Provider value={{ 
        number1, 
        setNumber1, 
        number2, 
        setNumber2, 
        number3, 
        setNumber3, 
        number4, 
        setNumber4 
        }}>
        {children}
        </AffichageContext.Provider>
    );
};

export { AffichageContext, AffichageContextProvider };