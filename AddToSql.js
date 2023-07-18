const ct = require('countries-and-timezones');
const fs = require('fs');
let files = fs.readdirSync('C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes/Images/Flags');
let countryIntials = [];
let FinalCountryIntialArray = [];
for (let i = 0; i < files.length; i++) {
    let filesSplit = files[i].split(/ |-/);
    countryIntials.push(filesSplit[0]);
}
for (let i = 0; i < countryIntials.length; i++) {
    let country = ct.getCountry(countryIntials[i].toUpperCase());
    if (country !== null) {
        FinalCountryIntialArray.push(country);
    }
}
for (country of FinalCountryIntialArray) {
    console.log(country);
}
