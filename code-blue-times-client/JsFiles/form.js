
const ExecuteProfile = (async () => {
    let firstTime = true;
    populateLocation()
    const EmailError = document.getElementById('Email-error');
    const LocationError = document.getElementById('Location-error')
    const errors = document.getElementsByClassName('Error-Message');

    const FirstName = document.getElementById('First-Name');
    const LastName = document.getElementById('Last-Name');
    const Skype = document.getElementById('Skype');
    const Email = document.getElementById('Email');
    const inputs = document.getElementsByTagName('input');
    const ExIconInput = document.getElementsByClassName('password-Hidden');
    const SaveChangesButton = document.getElementById('SaveChangesButton');
    const inputPc = document.getElementById("pac-input");
    let LatitudeOfUser = '';
    let LongitudeOfUser = '';
    let countryOfUser = '';
    let FullCityName = '';
    let IdOfUser = '';
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
            body: JSON.stringify({ Id: UserId.user[0].Id })
        })
        let responseData = await response.json();
        console.log(responseData);
        if (responseData == null) {
            console.error('No Data available');
            return
        }
        if (firstTime) {
            console.log(responseData.userInfo.First_Name);
            firstTime = false;
            FirstName.value = responseData.userInfo.First_Name;
            LastName.value = responseData.userInfo.Last_Name;
            Email.value = responseData.userInfo.Email;
            inputPc.value = responseData.userInfo.City;
            Skype.value = responseData.userInfo.Skype;
            LatitudeOfUser = responseData.userInfo.Latitude;
            LongitudeOfUser = responseData.userInfo.Longtitude;
            countryOfUser = responseData.userInfo.Country;
            FullCityName = responseData.userInfo.City;
            IdOfUser = responseData.userInfo.Id;
            let allValues = [FirstName.value,
            LastName.value,
            Email.value, Skype.value,
            inputPc.value
            ];

            allValues.forEach((e, index) => {
                if (e !== '') {
                    document.querySelectorAll('.Label-P')[index].classList.add('go-up-P');
                }
            })

        }
    }
    async function SaveChanges() {
        let error = false;
        if (inputPc.value === '') {
            LocationError.style.display = 'flex'
            LocationError.innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
            error = true;
        }
        if (Email.value === '') {
            EmailError.style.display = 'flex'
            EmailError.innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
            error = true;
        }
        if (error) {
            return
        }
        else if (!error) {
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
                    Skype: Skype.value,
                    Latitude: LatitudeOfUser,
                    Longtitude: LongitudeOfUser,
                    Country: countryOfUser,
                    CityName: FullCityName,
                    Id: IdOfUser
                })
            })

            let responseData = await response.json()
            if (responseData == null) {
                console.log('didnt Save');
                for (error of errors) {
                    error.style.display = 'flex'
                    error.innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Error!</p>'
                }
            }
            else {
                console.log('Saved');
                location.reload();
            }
            console.log(responseData.token);
        }

    }
    (async () => {
        const { Autocomplete } = await google.maps.importLibrary("places")
        const option = {
            fields: ['address_components', 'geometry', 'formatted_address'],
            types: ["geocode"],
            strictBounds: true
        }
        const autocomplete = new Autocomplete(inputPc, option)
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()

            countryOfUser.short_name = ''
            for (let i = 0; i < place.address_components.length; i++) {
                if (place.address_components[i].types[0] === 'country') {
                    countryOfUser = place.address_components[i].short_name
                }
            }
            LatitudeOfUser = place.geometry.location.lat();
            LongitudeOfUser = place.geometry.location.lng();
            FullCityName = place.formatted_address
            for (let j = 0; j < files.length; j++) {
                if (files[j].split(' ')[0].includes(ct.getCountryForTimezone(results[i].timeZone).id.toLowerCase())) {
                    results[i].FlagPath = files[j];
                    break;
                }
                else {
                    results[i].FlagPath = 'xx Unknown.svg';
                }
            }
            ///add flag here
        });
    })()


});
(async () => {
    document.body.style.display = 'none'
    await ExecuteProfile()
    document.body.style.display = 'grid';
})()
