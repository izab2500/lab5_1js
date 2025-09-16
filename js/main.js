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
const parentPrograms = document.querySelector("#info")


/*Funktionen anropas när sidan laddas, för att ladda 10st data objekt i en array från Sveriges Radios api. Därefter anropas funktionen
med change event och data hämtas beroende på det valda värdet från input #numrows.*/
async function getChannels(evt = null) {

    const numOfChannels = evt?.target.value || 10;

    try {
        const res = await fetch(`http://api.sr.se/api/v2/channels?format=json&size=${numOfChannels}`);

        if (!res.ok) throw new Error(`Något gick fel vid HTTP anropet ${res.status}`)

        const data = await res.json();

        const channelsArr = data.channels;

        generateChannelsLinks(channelsArr); // Genererar li-taggar med title attribute och länkar


    } catch (err) {
        console.error(`Det gick inte att hämta kanaler ${err} `);
    }
}

//Anropa när sida laddas med default parametern null
getChannels();

// Funktionen skjuter fram anropet på getChannels funtkionen med 500ms, när change eventet triggas
function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    }
}
//Källa: https://www.freecodecamp.org/news/javascript-debounce-example/

//Anropa funktion när värdet ändras
numFromInput.addEventListener("change", debounce(getChannels, 500));

/*Funktionen kontrollerar om argumentet är en array, rensar föregående li-element i #mainnavlist och genererar
li-element med titel attribut, a-element med href attribut och placerar element i DOM*/
function generateChannelsLinks(arr) {
    if (!Array.isArray(arr)) {
        throw new Error("Datan måste vara en array med korrekt innehåll!");
    }

    parentLinks.innerHTML = "";  // Rensa ols li-element

    const fragment = document.createDocumentFragment();

    arr.forEach(obj => {
        const liEl = document.createElement("li");

        liEl.setAttribute("title", obj.tagline);

        const aEl = document.createElement("a");

        aEl.setAttribute("href", obj.scheduleurl);

        aEl.textContent = obj.name;

        liEl.style.maxWidth = "fit-content";  // Visa titletext när muspekaren är över länken

        liEl.appendChild(aEl);

        fragment.appendChild(liEl);
    });

    // Lägg till alla li-element på en gång i DOM
    parentLinks.appendChild(fragment);
}

// Funktionen triggas vid klick på länk och extraherar href-attributets värdet
async function getLink(evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target.tagName !== "A") return

   const programsArr = await getProgramsNowToMidnight(target.href)
   console.log(programsArr)
}

parentLinks.addEventListener("click", getLink);


async function getProgramsNowToMidnight(link) {
    //Dagens datum och tid
    const now = new Date();
    // Tid nu i millisekunder
    const nowMilliSec = now.getTime();

    //Slutet av dagen
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    //Representerar slutet av dagen i millisekunder
    const endOfDayMilliSec = endOfDay.getTime();

    try {
        const res = await fetch(`${link}&format=json&pagination=false`);
        if (!res.ok) throw new Error(`Fel vid HTTP-anropet ${res.status}`);

        const data = await res.json();
        const programArr = data.schedule;

        const programs = programArr.filter(program => {
            const startTimeMilliSec = Number(program.starttimeutc.replace(/\D/g, ""));
            // Bara program som startar nu och fram till midnatt
            if (startTimeMilliSec >= nowMilliSec && startTimeMilliSec <= endOfDayMilliSec) return true

        });
        return programs
    } catch (err) {
        console.error(err);
    }
}



