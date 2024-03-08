
async function checkForCookies() {
    let Token = getCookie('token');
    if (Token == null) {
        console.log('no cookie');
        return;
    }
    let jsonToken = {
        token: Token
    }
    try {
        let response = await fetch('https://codebluetimes.com/app/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonToken)
        })
        let data = await response.json();
        if (data == null) {
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
    else if (userLoggedIn != null) {
        if (userLoggedIn.user == null) {
            window.location.href = 'index.html'
        }
    }
    else {
        return userLoggedIn;
    }
}
async function LogOutToken() {
    let Token = getCookie('token');
    if (Token == null) {
        console.log('no cookie');
        return;
    }
    let jsonToken = {
        token: Token
    }
    let response = await fetch('https://codebluetimes.com/app/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonToken)
    })
    let data = await response.json();
    console.log(data);
    if (data == null) {
        return data
    }
    else{
        console.log(data);
        window.location.href='index.html'
    }
 

}