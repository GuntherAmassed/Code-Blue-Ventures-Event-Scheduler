(async () => {

    await GetDataFromApi({ SortBy: 'First_Name ASC' });
    document.querySelectorAll('.First-Sort').forEach(e => {
        e.style.color = '#009AFE'
        if (e.children[0]) {
            document.querySelector('#Current-Sort').innerHTML = e.innerHTML;
            e.children[0].src = 'Images/Sorting-top.svg'
        }
    })
    document.querySelector('#table-Container').addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.style.overflow = 'hidden'
        setInterval(() => { document.body.style.overflow = 'auto' }, 100)
    })
    document.querySelector('#table-Container').addEventListener('scroll', (e) => {
        e.stopPropagation();
        console.log('his');
        document.body.style.overflow = 'hidden'
        setInterval(() => { document.body.style.overflow = 'auto' }, 100)
    })
    document.querySelector('#FirstSortDesktop').style.color = '#009AFE'
    SearchOptionfn()
    document.querySelectorAll('th').forEach(e => {
        e.addEventListener('click', async function () {
            let CurrentSortDesktop;
            let ascendOrnot = 'ASC'
            if (this.style.color === 'rgb(0, 154, 254)') {
                this.style.color = 'rgb(0, 154, 253)'
                ascendOrnot = 'DESC'
                document.querySelector('#Sorting-Image').src = 'Images/Sorting-bottom.svg'
            }
            else if (this.style.color === 'rgb(0, 154, 253)') {
                this.style.color = 'rgb(0, 154, 254)'
                ascendOrnot = 'ASC'
                document.querySelector('#Sorting-Image').src = 'Images/Sorting-top.svg'
            }
            else {
                this.style.color = 'rgb(0, 154, 254)'
                ascendOrnot = 'ASC'
                document.querySelector('#Sorting-Image').src = 'Images/Sorting-top.svg'
            }

            if (this.innerText === 'Name') {
                await GetDataFromApi({ SortBy: `First_Name ${ascendOrnot}` });
                CurrentSortDesktop = this;
            }
            else if (this.innerText === 'Location') {
                await GetDataFromApi({ SortBy: `City_Name ${ascendOrnot}` });
                CurrentSortDesktop = this;

            }
            else if (this.innerText === 'Time Zone') {
                await GetDataFromApi({ SortBy: `timeZone ${ascendOrnot}` });
                CurrentSortDesktop = this;
            }
            else {
                await GetDataFromApi({ SortBy: `${this.innerText} ${ascendOrnot}` });
                CurrentSortDesktop = this;
            }
            makeCurrentSortColorDesktop(CurrentSortDesktop)
        })
    })
    const IdOfUser = document.querySelectorAll(".Id-Of-User");
    const EditUser = document.getElementsByClassName('Edit-User');
    const DeleteUser = document.getElementsByClassName('Delete-User')
    const Role = document.getElementById('Current-Role');
    const optionRole = document.getElementsByClassName('Option');
    const FirstName = document.getElementById('First-Name');
    const LastName = document.getElementById('Last-Name');
    const Skype = document.getElementById('Skype');
    const Email = document.getElementById('Email');
    const inputs = document.querySelectorAll('.Form-input');
    const ExIconInput = document.getElementsByClassName('ExIconForInputs');
    // const ExIconLocation = document.getElementById('exIconLocationClose-Hidden-DropDown');
    const DropDownIcon = document.getElementsByClassName('Drop-Down-Icon');
    const DropDownLocations = document.getElementsByClassName('Drop-Down-Locations');
    const AddUser = document.getElementById('Add-User');
    const AddEditUserPage = document.getElementById('Add-Edit-User');
    const AddEditUserPageCloser = document.getElementById('Add-Edit-User-Closer');
    const editOrAdd = document.getElementsByClassName('Edit-Or-Add');
    const errors = document.getElementsByClassName('Error-Message');
    const LocationError = document.getElementById('Location-error')
    const RoleError = document.getElementById('Role-error')
    const EmailError = document.getElementById('Email-error');
    const inputPc = document.getElementById("pac-input");
    const main = document.getElementsByTagName('main');
    const FrameMenu = document.getElementById('Menu-Desktop');
    const Labels = document.getElementsByTagName('label');
    const ExIconRole = document.getElementById('exIconRole');
    const LabelP = document.querySelectorAll('.Label-P');
    let IdOfUserCurrent = '';
    let edit = false;
    let LatitudeOfUser = '';
    let LongitudeOfUser = '';
    let countryOfUser = '';
    let FullCityName = '';
    let timer;

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

        });
    })()

    for (let i = 0; i < inputs.length; i++) {
        ExIconInput[i].addEventListener('click', (e) => {
            e.stopPropagation()
            inputs[i].value = ''
            console.log(inputs[i]);
            ExIconInput[i].classList.add('hidden');
            if (inputs[i].placeholder === '') {
                LabelP[i].classList.remove("go-up-P");
            }
        })


        inputs[i].addEventListener('click', () => {
            for (error of errors) {
                error.style.display = 'none'
            }

            DropDownLocations[0].classList.add('hidden');
            DropDownIcon[0].src = "Images/icon-outline-arrow-down.svg"
        })
        inputs[i].addEventListener('keypress', (e) => {
            if (inputs[i].id !== 'Current-Role') {
                ExIconInput[i].classList.remove('hidden');
                window.clearTimeout(timer);
                inputs[i].style.color = 'gray'
                LabelP[i].classList.add("go-up-P");
            }
        })
        inputs[i].addEventListener('keyup', () => {
            window.clearTimeout(timer);

            timer = window.setTimeout(() => {
                inputs[i].style.color = 'white'
                Labels[i].style.color = '#929BA3'

            }, 200);
        })
        inputs[i].addEventListener('input', (e) => {
            ExIconInput[i].classList.remove('hidden');
            if (inputs[i].value === '' && e.inputType === 'deleteContentBackward') {
                ExIconInput[i].classList.add('hidden');
            }
            LabelP[i].classList.add("go-up-P");

            Labels[i].style.color = '#009AFE'
            timer = window.setTimeout(() => {
                inputs[i].style.color = 'white'
                Labels[i].style.color = '#929BA3'

            }, 200);

        })
    }
    ExIconRole.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        DropDownLocations[0].classList.add('hidden')
        DropDownIcon[0].src = "Images/icon-outline-arrow-down.svg"
    })
    for (let i = 0; i < optionRole.length; i++) {
        optionRole[i].addEventListener('click', () => {
            Role.value = optionRole[i].innerHTML;
            DropDownLocations[0].classList.add('hidden');
            DropDownIcon[0].src = "Images/icon-outline-arrow-down.svg"
            LabelP[LabelP.length - 1].classList.add("go-up-P");
            ExIconInput[ExIconInput.length - 1].classList.remove('hidden');
        })
    }
    AddUser.addEventListener('click', () => {
        for (let h = 0; h < ExIconInput.length; h++) {
            ExIconInput[h].classList.add('hidden');
            LabelP[h].classList.remove("go-up-P");
        }
        AddEditUserPage.classList.remove('hidden');
        editOrAdd[0].textContent = 'ADD USER';
        editOrAdd[1].textContent = 'ADD USER';
        AddEditUserPage.style.opacity = 1;
        main[0].style.opacity = 0.1;
        FrameMenu.style.opacity = .1
        FirstName.value = ''
        LastName.value = ''
        Email.value = ''
        inputPc.value = ''
        Skype.value = ''
        Role.value = ''
        edit = false;
        console.log(edit);
        editOrAdd[1].removeEventListener('click', async (e) => {
            e.preventDefault()
            await SaveChanges();
        });
        editOrAdd[1].addEventListener('click', async (e) => {
            e.preventDefault()
            await AddUserToDatabase()
        })
    })
    AddEditUserPageCloser.addEventListener('click', (e) => {
        console.log('hi');
        e.stopPropagation();
        main[0].style.opacity = 1;
        FrameMenu.style.opacity = 1
        AddEditUserPage.classList.add('hidden');
    })
    let clickedtheRole = true;
    document.querySelector('#TheRoleLabel').addEventListener('click', (e) => {
        e.stopPropagation()
        if (clickedtheRole) {
            DropDownLocations[0].classList.remove('hidden');
            console.log('hi');
            DropDownIcon[0].src = "Images/icon-outline-arrow-up.svg"
        }
        else {
            DropDownLocations[0].classList.add('hidden');
            console.log('bye');
            DropDownIcon[0].src = "Images/icon-outline-arrow-down.svg"
        }
        clickedtheRole = !clickedtheRole;


    })


    for (let i = 0; i < EditUser.length; i++) {
        EditUser[i].addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            for (let q = 0; q < inputs.length; q++) {
                inputs[q].style.color = 'white'
            }
            AddEditUserPage.classList.remove('hidden');
            editOrAdd[0].textContent = 'EDIT USER';
            editOrAdd[1].textContent = 'SAVE CHANGES';
            AddEditUserPage.style.opacity = 1;
            main[0].style.opacity = 0.1;
            FrameMenu.style.opacity = .1
            populateLocation(IdOfUser[i].textContent)
            edit = true;
            editOrAdd[1].removeEventListener("click", async (e) => {
                e.preventDefault()
                await AddUserToDatabase()
            });
            editOrAdd[1].addEventListener('click', async (e) => {
                e.preventDefault()

                await SaveChanges();
            });
        })
        DeleteUser[i].addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            deleteUserFromDatabase(IdOfUser[i].textContent)
        })
    }

    let sortTabelClicked = false
    document.querySelector('#Sort-Option-P').addEventListener('click', () => {
        hideOrShowSortTable();
    });

    //add click events for td
    document.querySelectorAll('.Sort-Option-td').forEach(e => e.addEventListener('click', async () => {

        let CurrentSort;
        if (e.style.color !== 'rgb(0, 154, 254)') {

            if (e.innerText === 'Name Ascending' || e.innerText === 'Name Descending') {
                if (e.innerText.includes('Ascending')) {
                    await GetDataFromApi({ SortBy: 'First_Name ASC' });
                    CurrentSort = e;
                }
                else {
                    await GetDataFromApi({ SortBy: 'First_Name DESC' });
                    CurrentSort = e;
                }
            }
            else if (e.innerText === 'Location Ascending' || e.innerText === 'Location Descending') {
                if (e.innerText.includes('Ascending')) {
                    await GetDataFromApi({ SortBy: 'City_Name ASC' });
                    CurrentSort = e;
                }
                else {
                    await GetDataFromApi({ SortBy: 'City_Name DESC' });
                    CurrentSort = e;
                }
            }
            else if (e.innerText === 'Role Ascending' || e.innerText === 'Role Descending') {
                if (e.innerText.includes('Ascending')) {
                    await GetDataFromApi({ SortBy: 'Role ASC' });
                    CurrentSort = e;
                }
                else {
                    await GetDataFromApi({ SortBy: 'Role DESC' });
                    document.querySelector('#Current-Sort').innerHTML = e.innerHTML;
                    CurrentSort = e;
                }
            }
            makeCurrentSortColor(CurrentSort)
        }

    }))
    function makeCurrentSortColor(CurrentSort) {
        document.querySelectorAll('.Sort-Option-td').forEach(e => {
            if (e === CurrentSort) {
                document.querySelector('#Current-Sort').innerHTML = CurrentSort.innerHTML;
                CurrentSort.style.color = '#009AFE';
                if (CurrentSort.innerText.includes('Ascending')) {
                    CurrentSort.children[0].src = 'Images/Sorting-top.svg'
                }
                else {
                    CurrentSort.children[0].src = 'Images/Sorting-bottom.svg'
                }

            }
            else {
                e.style.color = 'White';
                if (e.innerText.includes('Ascending')) {
                    e.children[0].src = 'Images/Sorting-top-not-Active.svg'
                }
                else {
                    e.children[0].src = 'Images/Sorting-bottom-Not-Active.svg'
                }
            }
        })
    }
    function makeCurrentSortColorDesktop(CurrentSort) {
        document.querySelectorAll('th').forEach(e => {
            if (e !== CurrentSort) {
                e.style.color = '#929BA3';
            }
            else {
                CurrentSort.appendChild(document.querySelector('#Sorting-Image'))
            }
        })
    }

    //functions

    function hideOrShowSortTable() {
        if (!sortTabelClicked) {
            document.querySelector('#sort-Icon-Drop-D').src = 'Images/icon-outline-arrow-up.svg'
            document.querySelector('#Sorting-Table').classList.remove('hidden')
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto'
            document.querySelector('main').style.maxHeight = 'none'
            sortTabelClicked = true
        }
        else {
            document.querySelector('#Sorting-Table').classList.add('hidden')
            document.querySelector('#sort-Icon-Drop-D').src = 'Images/icon-outline-arrow-down copy.svg'
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh'
            document.querySelector('main').style.maxHeight = '100vh'
            sortTabelClicked = false
        }
    }

    async function deleteUserFromDatabase(Id) {
        let token = getCookie('token');
        if (token == null) {
            console.log('no cookie');
            return;
        }
        let response = await fetch('https://codebluetimes.com/app/DeleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                Id: Id,
            })

        })
        let responseData = await response.json()
        if (responseData == null) {
            console.log('didnt Delete');
        }
        else {
            console.log('deleted');
            location.reload()
        }
    }


    async function populateLocation(id) {
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
            body: JSON.stringify({ Id: id })
        })
        let responseData = await response.json();

        if (responseData == null) {
            console.error('No Data available');
            return
        }
        if (edit) {
            FirstName.value = responseData.userInfo.First_Name;
            LastName.value = responseData.userInfo.Last_Name;
            Email.value = responseData.userInfo.Email;
            inputPc.value = responseData.userInfo.City;
            Skype.value = responseData.userInfo.Skype;
            Role.value = responseData.userInfo.Role;
            LatitudeOfUser = responseData.userInfo.Latitude;
            LongitudeOfUser = responseData.userInfo.Longtitude;
            countryOfUser = responseData.userInfo.Country;
            FullCityName = responseData.userInfo.City;
            console.log(responseData.userInfo.Id);
            IdOfUserCurrent = responseData.userInfo.Id
            let allValues = ['', FirstName.value,
                LastName.value,
                Email.value,
                Skype.value,
                inputPc.value,
                Role.value]
            allValues.forEach((e, index) => {
                if (e !== '') {
                    LabelP[index].classList.add("go-up-P");
                    ExIconInput[index].classList.remove('hidden');
                }
            })

        }

    }
    async function AddUserToDatabase() {
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

        if (Role.value === '') {
            console.log(Role.value, Role);
            RoleError.style.display = 'flex'
            RoleError.innerHTML = ' <img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
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
            let response = await fetch('https://codebluetimes.com/app/AddUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    FirstName: FirstName.value,
                    LastName: LastName.value,
                    Email: Email.value,
                    Latitude: LatitudeOfUser,
                    Longtitude: LongitudeOfUser,
                    Skype: Skype.value,
                    Country: countryOfUser,
                    CityName: FullCityName,
                    Role: Role.value
                })
            })

            let responseData = await response.json()
            if (responseData == null) {
                console.log('didnt add');
                for (error of errors) {
                    error.style.display = 'flex'
                    error.innerHTML = ' <img src="Images/icon-outline-error.svg" alt=""> <p>Error</p>'
                }
            }
            else {
                console.log('added');
                location.reload()
            }
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

        if (Role.value ==='') {
            console.log(Role.value, Role);
            RoleError.style.display = 'flex'
            RoleError.innerHTML = ' <img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
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
                    Latitude: LatitudeOfUser,
                    Longtitude: LongitudeOfUser,

                    Country: countryOfUser,
                    CityName: FullCityName,
                    Role: Role.value,
                    Id: IdOfUserCurrent,
                    Skype: Skype.value,
                })
            })

            let responseData = await response.json()
            if (responseData == null) {
                console.log('didnt Save');
                for (error of errors) {
                    error.style.display = 'flex'
                    error.innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Error</p>'
                }
            }
            else {
                console.log('Saved');
                location.reload()
            }
        }

    }
})();
