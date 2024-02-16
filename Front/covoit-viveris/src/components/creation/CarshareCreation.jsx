﻿import React, { useState, useEffect }  from "react";
import { useUser }        from "../../context/UserContext.jsx";
import { useWindowWidth } from "../../context/WindowWidthContext.jsx";
import { geocodeAddress } from "../../functions/geocode.js";

const AutocompleteInput = ({ value, onChange, placeholder }) => {

    const [suggestions, setSuggestions] = useState([]);
    const [timer, setTimer] = useState(null);

    // Fonction de nettoyage pour le timer
    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timer]);

    const handleInputChange = (event) => {
        const query = event.target.value;
        onChange(query); // Mise à jour de l'état du parent avec la valeur de l'input

        // Annuler la recherche précédente en cours
        if (timer) {
            clearTimeout(timer);
        }

        // Configuration d'un nouveau délai
        const newTimer = setTimeout(() => {
            if (query.length >= 3) {
                const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        setSuggestions(data);
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la recherche d\'adresses:', error);
                    });
            } else {
                setSuggestions([]);
            }
        }, 500); // 500ms de délai

        setTimer(newTimer);
    };

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                autoComplete="off"
            />
            {suggestions.length > 0 && (
                <ul style={{ position: 'absolute', zIndex: 1000 }}>
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onChange(suggestion.display_name);
                                setSuggestions([]);
                            }}
                        >
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const CarshareCreation = () => {

    const windowWidth = useWindowWidth();

    const [startPlace, setStartPlace] = useState('');
    const [endPlace, setEndPlace] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [numSeats, setNumSeats] = useState(1);
    const [message, setMessage] = useState('');

    const { user } = useUser();

    const handleCreateClick = () => {

            if (startPlace === '' || endPlace === '' || startDate === '' || startTime === '') {
                setMessage("Certains champs n'ont pas été remplis");
            }
            else {

                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        max_passenger:  numSeats ,
                        is_Full: 'false',
                        schedule: startDate  + ' ' +  startTime ,
                        start_place:  startPlace ,
                        end_place:  endPlace ,
                        //TODO : Ajouter les coordonnées lat et lon de chaque start_place et end_place, ne pas oublier que start et end_place sont maintenant des Addresses. Faire attention a envoyer les bonnes informations pour créer l'objet covoiturage.
                        //TODO: Calculer distance et bonus_pollution avant de faire cette requête POST
                        driver:{
                            uid: user.uid 
                        }
                    })
                };
                fetch('http://localhost:8080/carshare', options).then((res) => { });
                
                // Réinitialise la page en mesure temporaire tant que la gestion de la requête n'est pas finie
                // Il faut récupérer le résultat de la requête puis rediriger l'utilisateur en fonction du résultat
                setMessage("Requête de création de covoiturage envoyée");
                // setStartPlace('');
                // setEndPlace('');
                // setStartDate('');
                // setNumSeats('1');
                
            }
    }

    return (
        <div className="creation-form">
            <p className="center" style={{ marginBottom: "20px" }}>{message} </p>
            <p className="center" style={{ marginBottom: "20px" }}><strong style={{ fontSize: "25px" }}>Planifier un trajet</strong></p>

            <label> Lieu de départ :
                <AutocompleteInput value={startPlace} onChange={setStartPlace} placeholder="Entrez l'adresse de départ" />
                
            </label>

            <label> Lieu d'arrivée :
                <AutocompleteInput value={endPlace} onChange={setEndPlace} placeholder="Entrez l'adresse d'arrivée" />
            </label>

            <br></br>
            <label style={{ marginBottom: "20px" }}> Date et heure de départ :<br></br>
                            <input width="20%" type="date" name="dateStart" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            <input type="time" name="timeStart" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </label>
            <br></br>
            <label> Nombre de places :<br></br>
                <input type="number" name="seats" min="1" max="10" value={numSeats} onChange={e => setNumSeats(e.target.value)} style={{ width: "15%" }} />
            </label>

            <button className="btn" onClick={handleCreateClick}>
                <strong style={{ fontSize: "15px", padding: "5px" }}>Rechercher</strong>
            </button>
        </div>

    );

};

export default CarshareCreation



