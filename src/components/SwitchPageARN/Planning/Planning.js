import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../../../authConfig';
import axios from 'axios';
import "./Planning.css";
import { WidgetMouvement } from "../../../components";

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
                    },
                    params: {
                        '$top': 50  // Demande jusqu'à 50 événements
                    }
                }).then(res => {
                    const today = new Date();
                    const currentDay = today.getDay();
                    
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 4); // Vendredi
                    endOfWeek.setHours(23, 59, 59, 999);
                    const filteredEvents = res.data.value
                        .filter(event => {
                            const eventDate = new Date(event.start.dateTime);
                            console.log("EventDate : " + eventDate)
                            return eventDate >= startOfWeek && eventDate <= endOfWeek;
                        })
                        .map(event => {
                            console.log("TEST 1 : " + event)
                            const eventDate = new Date(event.start.dateTime);
                            return {
                                date: eventDate,
                                category: event.categories && event.categories.length > 0 ? event.categories[0] : 'Uncategorized',
                                subject: event.subject
                            };
                        });
                    console.log("TEST 2 : " + JSON.stringify(filteredEvents))
                    setEvents(filteredEvents);
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

    // Fonction pour trier les événements par heure de début
    const sortEventsByTime = (events) => {
        return events.sort((a, b) => a.date - b.date);
    };

    // Grouper les événements par jour de la semaine
    const groupEventsByDay = (events) => {
        console.log("Events : " + events)
        const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
        let groupedEvents = {};

        daysOfWeek.forEach((day, index) => {
            const dayEvents = events.filter(event => {
                return event.date.getDay() === index + 1; // index + 1 car getDay() retourne 1 pour Lundi, etc.
            });
            groupedEvents[day] = sortEventsByTime(dayEvents);
        });
        console.log("GroupedEvents : " + JSON.stringify(groupedEvents))
        return groupedEvents;
    };

    const colorMapping = {
        "Montée": "red",
        "Descente": "blue",
        "Arrêt Technique": "orange",
        "Mvt terre-plein": "purple",
        "Uncategorized": "gray"
    };

    const groupedEvents = groupEventsByDay(events);

    return (
        <div className='container-planning-ARN'>
            <div className='sect-title-planning'>
                <h2 className='title-planning'>Planning</h2>
            </div>
            <div className='sect-days-planning'>
                {Object.keys(groupedEvents).map(day => (
                    <div className='sect-day' key={day}>
                        <div className='sect-header-day'>
                            <h2 className='title-day'>{day}</h2>
                        </div>
                        <div className='sect-widget-mouvement'>
                            {groupedEvents[day].map(event => (
                                <WidgetMouvement 
                                    key={event.id} 
                                    text={event.subject} 
                                    couleur={colorMapping[event.category]} 
                                    size={2}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Planning;
