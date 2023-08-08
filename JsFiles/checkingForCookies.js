
async function checkForCookies() {
    let Token = getCookie('token');
    if (Token == null) {
        console.log('no cookie');
        return;
    }
    let jsonToken = {
        token: Token
    }
    console.log(jsonToken);
    try {
        let response = await fetch('http://localhost:3000/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonToken)
        })
        let data = await response.json();
        if (data == null) {
            console.log(data);
            return data
        }
        let userdata = {
            user: data.user,
            token: jsonToken
        }
        return userdata;

    } catch (error) {
        console.log(error);
        return null
    }


}
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
async function checkLogIn() {
    let userLoggedIn = await checkForCookies();
    if (userLoggedIn == null) {
        window.location.href = 'index.html'
    }
    else if(userLoggedIn != null) {
        if (userLoggedIn.user == null) {
            window.location.href = 'index.html'
        }
    }
    else {
        return userLoggedIn;
    }
}
checkLogIn()
