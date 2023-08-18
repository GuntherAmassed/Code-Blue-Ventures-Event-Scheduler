let firstTime = true;
populateLocation()
const FirstName = document.getElementById('First-Name');
const LastName = document.getElementById('Last-Name');
const Skype = document.getElementById('Skype');
const Email = document.getElementById('Email');
const State = document.getElementById('State-For-Country-name');
const LocationId = document.getElementById('Location-Id-For-Country-name');
const inputs = document.getElementsByTagName('input');
const ExIconInput = document.getElementsByClassName('password-Hidden');
const ExIconLocation = document.getElementById('password-Hidden-DropDown');
const DropDownIcon = document.getElementById('Drop-Down-Icon');
const DropDownLocations = document.getElementById('Drop-Down-Locations');
const CurrentLocation = document.getElementById('Country-For-User');
const CurrentCityLocation = document.getElementById('City-For-Country-name');
const SaveChangesButton = document.getElementById('SaveChangesButton');

SaveChangesButton.addEventListener('click', (e) => {
    e.preventDefault()
    SaveChanges();
});

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', () => {
        if (inputs[i].value.trim() !== '') {
            inputs[i].classList.add('input-padding');
        } else {
            inputs[i].classList.remove('input-padding');
        }
    })
    ExIconInput[i].addEventListener('click', () => {
        inputs[i].value = '';
        inputs[i].classList.remove('input-padding');
        inputs[i].style.margin = '0'
    })
}
DropDownIcon.addEventListener('click', () => {
    if (DropDownIcon.src.endsWith("arrow-down.svg")) {
        DropDownIcon.src = "public/images/icon-outline-arrow-up.svg"
    }
    else {
        DropDownIcon.src = "public/images/icon-outline-arrow-down.svg"
    }
    DropDownLocations.classList.toggle('hidden');
})

ExIconLocation.addEventListener('click', () => {
    CurrentLocation.innerHTML = '';
    CurrentCityLocation.innerHTML = '';
    State.innerHTML = ''
    LocationId.innerHTML = ''
    populateLocation()
})
async function populateLocation() {
    let UserId = await checkForCookies();
    if (UserId == null) {
        console.error('No Id available');
        return
    }
    let response = await fetch('https://codebluetimes.com/app/Locations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Id: UserId.user.id })
    })
    let responseData = await response.json();

    if (responseData == null) {
        console.error('No Data available');
        return
    }
    DropDownLocations.innerHTML = responseData.HtmlLocationCitiesFromDataBase;
    if (firstTime) {
        firstTime = false;
        FirstName.value = responseData.userInfo.First_Name;
        LastName.value = responseData.userInfo.Last_Name;
        Email.value = responseData.userInfo.Email;
        CurrentLocation.innerHTML = `<img id="Location-Image" src="Images/Flags/${responseData.userInfo.FlagPath}" alt="">` + responseData.userInfo.Country;
        State.innerHTML = responseData.userInfo.State;
        CurrentCityLocation.innerHTML = responseData.userInfo.City;
        LocationId.value = responseData.userInfo.LocationID;
        Skype.value = responseData.userInfo.Skype;
    }

    const Locations = document.getElementsByClassName('Location');
    for (let i = 0; i < Locations.length; i++) {
        Locations[i].addEventListener('click', () => {
            CurrentLocation.innerHTML = Locations[i].innerHTML;
            CurrentCityLocation.innerHTML = '';
            State.innerHTML = ''
            LocationId.innerHTML = ''
            getStatesForCountry(Locations[i].textContent);
        })
    }
}
async function getIdForCountry(City, State, Country) {
    let CountryTrim = Country.trim();
    let StateTrim = State.trim()
    let CityTrim = City.trim()
    let response = await fetch('https://codebluetimes.com/app/GetLocationId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Country: CountryTrim, State: StateTrim, City: CityTrim })
    })
    let responseData = await response.json()
    if (responseData == null) {
        console.log('no cities');
    }
    LocationId.value = responseData.IdForCountry
    console.log(responseData.IdForCountry);

}
async function getCitiesForCountry(StateCountry, Country) {
    let CountryTrim = Country.trim();
    let StateTrim = StateCountry.trim()
    let response = await fetch('https://codebluetimes.com/app/GetCities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Country: CountryTrim, State: StateTrim })
    })
    let responseData = await response.json()
    if (responseData == null) {
        console.log('no cities');
    }
    DropDownLocations.innerHTML = responseData.CitiesForCountry;
    const LocationCities = document.getElementsByClassName('City-Location');
    for (let i = 0; i < LocationCities.length; i++) {
        LocationCities[i].addEventListener('click', () => {
            CurrentCityLocation.innerHTML = LocationCities[i].innerHTML;
            getIdForCountry(LocationCities[i].textContent, State.textContent, CurrentLocation.textContent)
        })
    }
}
async function getStatesForCountry(Country) {
    let CountryTrim = Country.trim();
    let response = await fetch('https://codebluetimes.com/app/GetStates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Country: CountryTrim })
    })
    let responseData = await response.json()
    if (responseData == null) {
        console.log('no cities');
    }
    console.log(responseData);
    DropDownLocations.innerHTML = responseData.StatesForCountry;
    const LocatioStates = document.getElementsByClassName('State-Location');
    for (let i = 0; i < LocatioStates.length; i++) {
        LocatioStates[i].addEventListener('click', () => {
            State.innerHTML = LocatioStates[i].innerHTML;
            console.log(LocatioStates[i].textContent, CurrentLocation.textContent);
            getCitiesForCountry(LocatioStates[i].textContent, CurrentLocation.textContent)
        })
    }
}
async function SaveChanges() {
    let token = getCookie('token');
    if (token == null) {
        console.log('no cookie');
        return;
    }
    let response = await fetch('https://codebluetimes.com/app/SaveChanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token,
            FirstName: FirstName.value,
            LastName: LastName.value,
            Email: Email.value,
            LocationId: LocationId.value,
            Skype: Skype.value
        })
    })

    let responseData = await response.json()
    if (responseData == null) {
        console.log('didnt Save');
    }
    else {
        console.log('Saved');
        document.cookie = `token = ${responseData.token}; expires=Wed, 05 Aug 2024 23:00:00 UTC;`;
        location.reload();
    }
    console.log(responseData.token);
}

