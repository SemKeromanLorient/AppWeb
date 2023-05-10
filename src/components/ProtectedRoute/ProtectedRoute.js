import {Navigate, Route} from "react-router-dom"; 
import React, {useEffect } from 'react';
import { getAuthorization, getConnectedUser } from "../../utils/storageUtil";

function ProtectedRoute({redirect, useFor, children}){


    return (getAuthorization(useFor))? children : <Navigate replace to={redirect} />

}

export default ProtectedRoute;