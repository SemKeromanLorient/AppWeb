// import React from 'react';
// import "./Planning.css";
// import { ReactComponent as KeromanIcon } from "../../../assets/icons/Logo_SEM_Keroman.svg";
// import { useEffect, useState } from 'react';
// import { getToServer } from "../../../utils/serverHttpCom.js";

// function Planning() {
//     return <>
//     <iframe src="https://outlook.office365.com/owa/calendar/56e48bd57e794b4b9e4196a923ec3a9a@keroman.fr/a56c8fa487574adbb53ab6c52618f52814548381469027406089/calendar.html" width="1200" height="1000" frameborder="0" scrolling="no"></iframe>
//     </>
// }

// export default Planning;

import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest, msalConfig } from '../../../authConfig';
import axios from 'axios';

function Planning() {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            const request = {
                ...loginRequest,
                account: accounts[0]
            };

            instance.acquireTokenSilent(request).then(response => {
                axios.get("https://graph.microsoft.com/v1.0/me/events", {
                    headers: {
                        Authorization: `Bearer ${response.accessToken}`
                    }
                }).then(res => {
                    setEvents(res.data.value);
                }).catch(err => {
                    console.error(err);
                });
            });
        }
    }, [isAuthenticated, instance, accounts]);

    if (!isAuthenticated) {
        return (
            <button onClick={() => instance.loginPopup(loginRequest)}>Sign In</button>
        );
    }

    return (
        <div>
            <h2>Calendrier</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>{event.subject} - {new Date(event.start.dateTime).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
}

export default Planning;
