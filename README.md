# Labbgrund till Moment 5 i kursen DT084G, Introduktion till programmering i JavaScript


## 📝 Uppgift

Utgå från en färdig HTML- och CSS-fil, samt en tom main.js, och implementera följande funktionalitet i JavaScript:

**Obligatorisk funktionalitet**

- Ladda in data från Sveriges Radios API
- Generera valfritt antalet länkar/kanaler med titel-attribut
- När en länk klickas ska en tablå med live- och sändningar under dagen visas med programmets: titel, programtider, undertitel och beskrivning

**Valfri funktionalitet**

- Justera hur många länkar/kanaler som ska visas via ett inputelement
- Samma antalet kanalerna (med ljudlänk) ska visas i en selectbox

**Extra funktionalitet**

- Debounce-funktion för att optimera val av kanaler (inte anropa för varje förändring)
- Välkomstmeddelande när sida laddas


## 💻 Applikationsflöde

- Sida laddas, tio kanaler/länkar, tio kanaler/ljudlänkar visas och ett välkomstmeddelande.
- Användare kan justerar hur många kanaler/länkar som ska visas (chnage eventet triggas med en fördröjning på 500ms)
- Användaren klickar på någon av länkarna och dagens tablå visas: från klockslaget nu och till midnatt
- Användare väljer kanal/ljudlänk i selectbox, klickar på "Spela"-knappen och en live-sändning börjar spelas.


## ✅ Använd teknik

- HTML/CSS
- JavaScript
- DOM-manipulation
- Sveriges Radios API



