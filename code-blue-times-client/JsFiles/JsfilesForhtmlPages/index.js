(async () => {
    await tryLogin();
    var ForgotPassword = document.getElementById("Forgot-Password");
    let Password = document.getElementById('Password');
    let input = document.getElementsByTagName('input');
    let button = document.getElementById("Log-in-button");
    let errors = document.getElementsByClassName('Error-Message');
    const rememberMe = document.getElementById('rememberMe');
    const PasswordHidden = document.getElementById('password-Hidden');

    let isImage1Displayed = true;
    let clicked = false;
    rememberMe.addEventListener('click', () => {
        if (isImage1Displayed) {
            rememberMe.src = 'Images/NotClicked.svg';

            isImage1Displayed = false;
        } else {
            rememberMe.src = 'Images/frame-3780.svg';
            isImage1Displayed = true
        }

        clicked = true;
    })
    rememberMe.addEventListener('mouseover', () => {
        if (!clicked) {
            if (isImage1Displayed) {

                rememberMe.src = 'Images/HoverClickedCheck.svg';
            } else {
                rememberMe.src = 'Images/NotClickedHoverCheck.svg';
            }
        }

    })
    rememberMe.addEventListener('mouseout', () => {
        if (isImage1Displayed) {
            rememberMe.src = 'Images/frame-3780.svg';
            ;
        } else {
            rememberMe.src = 'Images/NotClicked.svg'
        }
        clicked = false;
    })
    let clickedType = false;
    PasswordHidden.addEventListener('click', () => {
        if (clickedType) {
            Password.type = 'password'
            PasswordHidden.src = 'Images/icon-password-hidden.svg'
        }
        else {
            PasswordHidden.src = 'Images/icon-vector-Shown.svg'
            Password.type = 'text'
        }
        clickedType = !clickedType;
    })
    PasswordHidden.addEventListener('mouseover', () => {
        if (clickedType) {
            PasswordHidden.src = 'Images/HoverStateForPasswordRevield.svg'
        }
        else {
            PasswordHidden.src = 'Images/HoverStateForPasswordHidden.svg'
        }
    })
    PasswordHidden.addEventListener('mouseout', () => {
        if (clickedType) {
            PasswordHidden.src = 'Images/icon-vector-Shown.svg'
        }
        else {
            PasswordHidden.src = 'Images/icon-password-hidden.svg'
        }
    })
    let errorMessage = false;
    button.addEventListener("click", (e) => {
        e.preventDefault()
        LogIn()
    });
    let timer;
    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('click', () => {
            if (errorMessage) {
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                    input[i].style.color = 'gray';
                    errors[i].style.display = 'none';
                }
                errorMessage = false;
            }
        })
        input[i].addEventListener('keypress', () => {
            window.clearTimeout(timer);
            input[i].style.color = 'gray'
        })
        input[i].addEventListener('keyup', () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                input[i].style.color = 'white'
            }, 200);
        })
    }

    ForgotPassword.addEventListener("click", () => {
        window.location.href = "ResetPassword.html";
    })
    async function tryLogin() {
        let userLoggedIn = await checkForCookies();
        console.log(userLoggedIn);
        if (userLoggedIn != null) {
            window.location.href = 'Home-Page.html'
        }
    }

    async function LogIn() {
        let UserData = {
            Password: Password.value,
            Email: Email.value,
            rememberMe: true
        }
        let response = await fetch('https://codebluetimes.com/app/LogIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UserData)
        });
        let data = await response.json();

        if ('error' in data) {
            if (data.error === true) {
                document.querySelectorAll('.Error-Message').forEach(error => {
                    error.style.display = 'flex';
                    error.children[1].innerHTML = 'Password or Email not Correct';
                    for (let i = 0; i < input.length; i++) {
                        input[i].style.color = '#FF2D6C';
                    }
                    errorMessage = true;
                })

            }
        }
        else {
            document.cookie = `token = ${data.accessToken}; expires=Wed, 05 Aug 2024 23:00:00 UTC;`;
            window.location.href = 'Home-Page.html'
        }
    }
})();
