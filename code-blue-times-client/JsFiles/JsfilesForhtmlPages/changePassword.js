(async () => {

    const inputs = document.getElementsByTagName('input');
    const IconHidden = document.getElementsByClassName('hiddenPass');
    const ChangePasswordButton = document.getElementById('Change-Password-Button')
    const ErrorMessage = document.getElementsByClassName('Error-Message')
    const clickedTypes = new Array(IconHidden.length).fill(false);
    const ExIconInput = document.getElementsByClassName('ExIconInput');
    const errors = document.getElementsByClassName('Error-Message');
    const Labels = document.getElementsByTagName('label');
    const LabelP = document.querySelectorAll('.Label-P');
    let timer;
    for (let i = 0; i < inputs.length; i++) {
        ExIconInput[i].addEventListener('click', () => {
            inputs[i].value = ''
            ExIconInput[i].classList.toggle('hidden');
            IconHidden[i].classList.add('hidden')
            if (inputs[i].placeholder === '' && inputs[i].value === '') {
                LabelP[i].classList.remove("go-up-P");
            }

        })
        inputs[i].addEventListener('click', () => {
            for (error of errors) {
                error.style.display = 'none'
            }
        })
        inputs[i].addEventListener('keypress', () => {
            window.clearTimeout(timer);
            inputs[i].style.color = 'gray'
            LabelP[i].classList.add("go-up-P");

            Labels[i].style.color = '#009AFE'

        })
        inputs[i].addEventListener('keyup', () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                inputs[i].style.color = 'white'
                ExIconInput[i].classList.toggle('hidden');
                IconHidden[i].classList.remove('hidden')
                Labels[i].style.color = '#929BA3'
                if (inputs[i].value === '') {
                    if (LabelP !== undefined) {
                        LabelP[i].classList.remove("go-up-P");
                    }
                }
            }, 200);
        })
    }
    for (let i = 0; i < IconHidden.length; i++) {
        IconHidden[i].addEventListener('click', () => {
            for (error of ErrorMessage) {
                error.style.display = 'none'
            }
            let clickedType = clickedTypes[i];
            if (clickedType) {
                inputs[i].type = 'password'
                IconHidden[i].src = 'Images/icon-password-hidden.svg'
            }
            else {
                IconHidden[i].src = 'Images/icon-vector-Shown.svg'
                inputs[i].type = 'text'
            }
            clickedTypes[i] = !clickedType;
        })
    }
    ChangePasswordButton.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await ChangePasswordInDataBase(inputs)
    })
    async function ChangePasswordInDataBase(inputs) {
        let error = false;

        if (inputs[0].value === '') {
            ErrorMessage[0].style.display = 'flex'
            ErrorMessage[0].innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
            error = true;
        }
        if (inputs[1].value === '') {
            ErrorMessage[1].style.display = 'flex'
            ErrorMessage[1].innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
            error = true;
        }
        if (inputs[2].value === '') {
            ErrorMessage[2].style.display = 'flex'
            ErrorMessage[2].innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Required</p>'
            error = true;
        }
        if (error) {
            return
        }
        else {
            let token = getCookie('token');
            if (token == null) {
                console.log('no cookie');
                return;
            }
            let userinfoId = await checkForCookies()
            let response = await fetch('https://codebluetimes.com/app/ChangePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    Id: userinfoId.user[0].Id,
                    OldPassword: inputs[0].value,
                    NewPassword: inputs[1].value,
                    ConfirmNewPassword: inputs[2].value,
                })
            })
            let responseData = await response.json()
            if (responseData === null) {
                for (error of ErrorMessage) {
                    error.style.display = 'flex'
                    error.innerHTML = '<img src="Images/icon-outline-error.svg" alt=""> <p>Error With Form!</p>'
                }
            }
            else {
                window.location.href = 'My-Profile.html'
            }
        }

    }



})()