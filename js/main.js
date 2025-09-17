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
const parentProgramsInfo = document.querySelector("#info")
const channelsList = document.querySelector("#playchannel")
const radioPlayer = document.querySelector("#radioplayer")
const playBtn = document.querySelector("#playbutton")


/*Funktionen anropas när sidan laddas, för att ladda 10st data objekt i en array från Sveriges Radios api. Därefter anropas funktionen
med change event och data hämtas beroende på det valda värdet från input #numrows.*/
async function getChannels(evt = null) {

    const numOfChannels = evt?.target.value || 10;

    try {
        const res = await fetch(`http://api.sr.se/api/v2/channels?format=json&size=${numOfChannels}`);

        if (!res.ok) throw new Error(`Något gick fel vid HTTP anropet ${res.status}`)

        const data = await res.json();

        const channelsArr = data.channels;

        generateChannelsLinks(channelsArr); //Genererar li-taggar med title attribute och länkar

        generatePlayList(channelsArr) //Genererar option-element med värdet av en url - ljud


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

/* Funktionen triggas vid klick på länk och extraherar href-attributets värdet. Anropar två funktioner
där getProgramsNowToMidnight filterar programdata och den andra generera programinfo till gränsnittet.*/
async function getLink(evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target.tagName !== "A") return

    const programsArr = await getProgramsNowToMidnight(target.href)
    generateProgramsInfo(programsArr)
}

parentLinks.addEventListener("click", getLink);


/*Funktionen skapar i millisekunder en tid nu och en tid som representerar slutet av dagen.
Sedan hämtas data från Sverige Radio, där data är program. Ett filter appliceras på data för att
endast returnera program som är i intervallet nutid upp till midnatt. Programen returneras. */
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

/*Funktionen tar programdata från Sveriges radio som en array, skapar för varje iteration ett article-element,
med barn-element som inkluderar data från Sveriges radios program som sänds nu och fram till midnatt*/
function generateProgramsInfo(arr) {
    parentProgramsInfo.innerHTML = "";

    const fragment = document.createDocumentFragment();

    arr.forEach(program => {
        const article = document.createElement("article");

        const h3 = document.createElement("h3");
        h3.textContent = program.title;
        article.appendChild(h3);

        const h4 = document.createElement("h4");
        h4.textContent = program.subtitle || "";
        article.appendChild(h4);

        const h5 = document.createElement("h5");
        h5.textContent = convertTime(program.starttimeutc, program.endtimeutc);
        article.appendChild(h5);

        const p = document.createElement("p");
        p.textContent = program.description;
        article.appendChild(p);

        fragment.appendChild(article);
    })
    parentProgramsInfo.appendChild(fragment);
}

//Funktionen konverter start- sluttider för program på formatet 00:00 och returnera en strängen
function convertTime(startTime, endTime) {
    // Extrahera millisekunder för start- och sluttid
    const startTimeMilliSec = startTime.replace(/\D/g, "");
    const endTimeMilliSec = endTime.replace(/\D/g, "");

    //Radio program start- och slutdatum
    const startDate = new Date(Number(startTimeMilliSec));
    const endDate = new Date(Number(endTimeMilliSec));

    //Omvandla timmar och minuter på formatet 00:00
    const startTimeHours = String(startDate.getHours()).padStart(2, "0");
    const startTimeMins = String(startDate.getMinutes()).padStart(2, "0");

    const endTimeHours = String(endDate.getHours()).padStart(2, "0");
    const endTimeMins = String(endDate.getMinutes()).padStart(2, "0");

    return `Programmtider: ${startTimeHours}:${startTimeMins} - ${endTimeHours}:${endTimeMins}`;
}

//Funktionen genererar option-element med värdet av en url som är länk till live program och lägger in elementen i select-elementet
function generatePlayList(arr) {

    if (!Array.isArray(arr)) {
        console.error("Argumentet är inte en array")
        return
    }

    channelsList.innerHTML = ""; // Radera option-elementen i select

    const fragment = document.createDocumentFragment();

    arr.forEach(channel => {
        const optionEl = document.createElement("option");

        optionEl.textContent = channel.name; // Nament på kanal

        optionEl.setAttribute("value", channel.liveaudio.url); //Url för ljud i mp3 som spelas just nu

        fragment.appendChild(optionEl);
    })

    channelsList.appendChild(fragment);
}


//Funktionen extraherar ljudlänk och spelar pågående program för vald kanal
function playSound() {
    const urlSound = channelsList.value; // Ljudlänk

    if (!urlSound) {
        console.error("Ingen giltig ljudlänk vald");
        return
    }

    radioPlayer.innerHTML = `
    <audio controls="true" autoplay="true">
    <source src=${urlSound} type="audio/mpeg">
    </audio>
    `
}

playBtn.addEventListener("click", playSound);