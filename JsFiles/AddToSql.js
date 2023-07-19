const ct = require('countries-and-timezones');
const fs = require('fs');
let files = fs.readdirSync('C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes/Images/Flags');
const { createPool } = require('mysql2');
let FinalCountryIntialArray = [];
let fileNames=[];
const InsertLocations = 'INSERT INTO locationtable (location,timezones) VALUES (?, ?)';
const createUserQuery = 'INSERT INTO userinfo (Email, First_Name, Last_Name, Skype, timeZone, Password, Role) VALUES (?, ?, ?, ?, ?, ? ,?)';
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginforzunta'
});

class RandomNameGenerator {
    constructor() {
        this.firstName = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
        this.lastName = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
    }
    GenerateName() {
        let rFirst = this.firstName[Math.floor(Math.random() * this.firstName.length)];
        let rLast = this.lastName[Math.floor(Math.random() * this.lastName.length)];
        return [rFirst, rLast];
    }
}
const nameGenerator = new RandomNameGenerator();
getCountries();
getFlagNames();
function getCountries() {

    let countryIntials = [];
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
}
function addUsersToDataBase() {
    for (let i = 0; i < 1000; i++) {
        let Name = nameGenerator.GenerateName();
        let values = [`${Name[0]}${i}@gmail.com`, Name[0], Name[1], 1234, FinalCountryIntialArray[Math.floor(Math.random() * FinalCountryIntialArray.length)].timezones[0], '1234', 'test'];
        pool.query(createUserQuery, [`${Name[0]}${i}@gmail.com`, Name[0], Name[1], 1234, FinalCountryIntialArray[Math.floor(Math.random() * FinalCountryIntialArray.length)].timezones[0], '1234', 'test'], (error) => {
            if (error) {
                console.error(error);
                console.log(values);
            } else {
                console.log(Name[0] + ' ' + Name[1] + ' ' + 'Inserted');
            }
        })
    }
}
function addTimezonesToDataBase() {

    for (let i = 0; i < FinalCountryIntialArray.length; i++) {

        for (let j = 0; j < FinalCountryIntialArray[i].timezones.length; j++) {

            pool.query(InsertLocations, [FinalCountryIntialArray[i].name, FinalCountryIntialArray[i].timezones[j]], (error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(FinalCountryIntialArray[i].timezones[j] + 'Inserted');
                }
            })

        }
    }
}
function getFlagNames() {
    for (let i = 0; i < FinalCountryIntialArray.length; i++) {
        for (let j = 0; j < files.length; j++) {
            if(files[j].includes(FinalCountryIntialArray[i].name)){
                fileNames.push(files[j])
            }
        }
       
    }
}


