// Denna fil ska innehålla din lösning till uppgiften (moment 5).

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
//document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
//document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar

/* Här under börjar du skriva din JavaScript-kod */

//DOM 
const parentLinks = document.querySelector("#mainnavlist")
const numFromInput = document.querySelector("#numrows")


/*Funktionen anropas när sidan laddas, för att ladda 10st data objekt i en array från Sveriges Radios api. Därefter anropas funktionen
med change event och data hämtas beroende på det valda värdet från input #numrows.*/
async function getChannels(evt = null) {

    const numOfChannels = evt?.target.value || 10;

    try {
        const res = await fetch(`http://api.sr.se/api/v2/channels?format=json&size=${numOfChannels}`);

        if (!res.ok) throw new Error(`Något gick fel vid HTTP anropet ${res.status}`)
        const data = await res.json();
        const channelsArr = data.channels;

    } catch (err) {
        console.error(`Det gick inte att hämta kanaler ${err} `)
    }
}

//Anropa när sida laddas med default parametern null
getChannels();

//Anropa funktion vid nytt värde
numFromInput.addEventListener("change", getChannels);

